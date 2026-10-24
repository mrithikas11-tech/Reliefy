"""
Reliefy — restaurant offer extraction.

Turns a natural-language restaurant message into the structured offer
schema the matcher expects:

    {
        "name": "Restaurant A",
        "meals": 80,
        "price_per_meal": 8.0,
        "ready_time": "16:00",
        "confirmed": false
    }

Two modes, selected by the RELIEFY_AI_MODE environment variable:

    mock    (default) — a local parser that needs no AWS credentials.
    bedrock           — Amazon Bedrock Converse API via boto3.

Safety rule that drives the whole module: an offer is only marked
confirmed=True when every required field is present, well-typed, and
valid. Uncertain language ("maybe", "probably", "might") or any missing
/ invalid field forces confirmed=False, and unknown fields are null.
That way the matcher never acts on data we are not sure about.
"""

import json
import os
import re

# Words that signal the restaurant is not committing yet.
UNCERTAIN_WORDS = ("maybe", "probably", "might", "possibly", "perhaps", "tentative")

# The fields the matcher relies on.
REQUIRED_FIELDS = ("name", "meals", "price_per_meal", "ready_time", "confirmed")

_TIME_RE = re.compile(r"^([01]?\d|2[0-3]):([0-5]\d)$")


# --------------------------------------------------------------------------
# Public API
# --------------------------------------------------------------------------
def extract_offer(message: str) -> dict:
    """Extract a structured offer from a free-text restaurant message.

    Always returns a dict matching the schema. On any failure or
    uncertainty the offer is returned with confirmed=False so it is safe
    to hand to the matcher (which filters out unconfirmed offers).
    """
    if not isinstance(message, str) or not message.strip():
        return _blank_offer()

    mode = os.getenv("RELIEFY_AI_MODE", "mock").strip().lower()

    try:
        if mode == "bedrock":
            raw = _extract_with_bedrock(message)
        else:
            raw = _extract_with_mock(message)
    except Exception as exc:  # never let an extraction error crash the caller
        print(f"[ai] extraction failed ({mode} mode): {exc}")
        return _blank_offer()

    return _validate_offer(raw, message)


# --------------------------------------------------------------------------
# Validation — the single gate everything passes through
# --------------------------------------------------------------------------
def _blank_offer() -> dict:
    """An all-unknown, unconfirmed offer."""
    return {
        "name": None,
        "meals": None,
        "price_per_meal": None,
        "ready_time": None,
        "confirmed": False,
    }


def _coerce_number(value):
    """Return a number for valid numeric input, else None. Rejects bools."""
    if isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
        return value
    if isinstance(value, str):
        cleaned = value.strip().replace("$", "").replace(",", "")
        try:
            return float(cleaned)
        except ValueError:
            return None
    return None


def _normalize_time(value):
    """Return a zero-padded HH:MM string if valid, else None.

    Zero-padding matters: the matcher compares ready_time to the deadline
    as plain strings, so '9:00' would sort wrong against '16:00'.
    """
    if not isinstance(value, str):
        return None
    m = _TIME_RE.match(value.strip())
    if not m:
        return None
    return f"{int(m.group(1)):02d}:{m.group(2)}"


def _validate_offer(raw: dict, message: str) -> dict:
    """Normalize, type-check, and decide confirmed.

    Produces a schema-complete dict. Any missing/invalid field becomes
    null and forces confirmed=False.
    """
    offer = _blank_offer()
    if not isinstance(raw, dict):
        return offer

    # name — non-empty string
    name = raw.get("name")
    if isinstance(name, str) and name.strip():
        offer["name"] = name.strip()

    # meals — positive whole number
    meals = _coerce_number(raw.get("meals"))
    if meals is not None and meals > 0 and float(meals).is_integer():
        offer["meals"] = int(meals)

    # price_per_meal — non-negative number
    price = _coerce_number(raw.get("price_per_meal"))
    if price is not None and price >= 0:
        offer["price_per_meal"] = float(price)

    # ready_time — valid HH:MM
    offer["ready_time"] = _normalize_time(raw.get("ready_time"))

    # confirmed decision ----------------------------------------------------
    all_present = all(
        offer[f] is not None for f in ("name", "meals", "price_per_meal", "ready_time")
    )

    model_confirmed = raw.get("confirmed")
    model_confirmed = model_confirmed is True  # anything non-True -> False

    uncertain = _sounds_uncertain(message)

    offer["confirmed"] = bool(all_present and model_confirmed and not uncertain)
    return offer


def _sounds_uncertain(message: str) -> bool:
    lowered = message.lower()
    return any(word in lowered for word in UNCERTAIN_WORDS)


# --------------------------------------------------------------------------
# Mock mode — no AWS required
# --------------------------------------------------------------------------
def _extract_with_mock(message: str) -> dict:
    """A small heuristic parser used for local testing.

    It is intentionally simple: it recognizes common phrasings so you can
    exercise extract_offer end-to-end without Bedrock. All results still
    pass through _validate_offer, so the confirmed rules are identical to
    real mode.
    """
    text = message.strip()
    lowered = text.lower()

    # name: prefer "Restaurant <label>" where <label> is a short run of
    # capitalized words / codes (e.g. "A", "Blue Door"). We stop at the first
    # lowercase word so verbs like "can"/"might" don't get pulled into the name.
    name = None
    # (?i:restaurant) matches the keyword in any case, while the label classes
    # stay case-sensitive so a following lowercase verb ("can", "might") ends
    # the name instead of being absorbed into it.
    m = re.search(
        r"(?i:\brestaurant)\s+([A-Z][A-Za-z0-9'&.\-]*(?:\s+[A-Z][A-Za-z0-9'&.\-]*){0,3})",
        text,
    )
    if m:
        name = ("Restaurant " + m.group(1)).strip()
    else:
        # Fallback: the chunk of text before the first clause break, but only
        # if it is short enough to plausibly be a name (avoids grabbing a
        # whole sentence).
        m = re.match(r"\s*([A-Za-z0-9'&.\- ]{1,40}?)\s*[,:;]", text)
        if m and len(m.group(1).split()) <= 5:
            name = m.group(1).strip()

    # meals: a number near "meals"/"plates"/"portions"
    meals = None
    m = re.search(r"(\d+)\s*(?:meals|plates|portions|dishes|servings)", lowered)
    if m:
        meals = int(m.group(1))

    # price: a dollar sign is the strongest signal, so try it first.
    price = None
    m = re.search(r"\$\s*(\d+(?:\.\d+)?)", text)
    if m:
        price = float(m.group(1))
    else:
        # "8 dollars per meal", "8/meal", "8 per plate", "8 each" — the price
        # unit MUST be present so we don't mistake the meal count for a price.
        m = re.search(
            r"(\d+(?:\.\d+)?)\s*(?:dollars?|usd)?\s*(?:/\s*|per\s+)(?:meal|plate|portion)"
            r"|(\d+(?:\.\d+)?)\s*(?:dollars?|usd)\b"
            r"|(\d+(?:\.\d+)?)\s*(?:per\s+)?each\b",
            lowered,
        )
        if m:
            price = float(next(g for g in m.groups() if g is not None))

    # time: "16:00", "4pm", "by 5 pm"
    ready_time = None
    m = re.search(r"\b([01]?\d|2[0-3]):([0-5]\d)\b", text)
    if m:
        ready_time = f"{m.group(1)}:{m.group(2)}"
    else:
        m = re.search(r"\b(\d{1,2})\s*(am|pm)\b", lowered)
        if m:
            hour = int(m.group(1)) % 12
            if m.group(2) == "pm":
                hour += 12
            ready_time = f"{hour:02d}:00"

    # The model/heuristic's own "confirmed" guess. Validation + uncertainty
    # checks still have the final say.
    confirmed = not _sounds_uncertain(message)

    return {
        "name": name,
        "meals": meals,
        "price_per_meal": price,
        "ready_time": ready_time,
        "confirmed": confirmed,
    }


# --------------------------------------------------------------------------
# Bedrock mode — Amazon Bedrock Converse API via boto3
# --------------------------------------------------------------------------
_SYSTEM_PROMPT = (
    "You extract a restaurant meal offer from a message for a disaster-relief "
    "meal procurement system. Return ONLY a single JSON object, no prose, no "
    "code fences, with exactly these keys:\n"
    "  name (string or null), meals (integer or null), "
    "price_per_meal (number or null), ready_time (string 'HH:MM' 24-hour or "
    "null), confirmed (boolean).\n"
    "Rules:\n"
    "- Never invent values. If a field is not clearly stated, use null.\n"
    "- ready_time must be 24-hour zero-padded HH:MM (e.g. '09:00', '16:30').\n"
    "- Set confirmed=false if the message is uncertain (contains words like "
    "'maybe', 'probably', 'might') or if any required field is missing.\n"
    "- Set confirmed=true only when the restaurant clearly commits and name, "
    "meals, price_per_meal and ready_time are all present."
)


def _extract_with_bedrock(message: str) -> dict:
    """Call the Bedrock Converse API and parse its JSON response."""
    import boto3  # imported lazily so mock mode needs no boto3 install

    model_id = os.getenv("BEDROCK_MODEL_ID")
    region = os.getenv("AWS_REGION") or os.getenv("AWS_DEFAULT_REGION")
    if not model_id:
        raise RuntimeError("BEDROCK_MODEL_ID environment variable is not set.")
    if not region:
        raise RuntimeError("AWS_REGION environment variable is not set.")

    # Credentials come from the standard boto3 chain (env vars, shared
    # config, IAM role). We never read or store them here.
    client = boto3.client("bedrock-runtime", region_name=region)

    response = client.converse(
        modelId=model_id,
        system=[{"text": _SYSTEM_PROMPT}],
        messages=[{"role": "user", "content": [{"text": message}]}],
        inferenceConfig={"maxTokens": 512, "temperature": 0.0},
    )

    text = response["output"]["message"]["content"][0]["text"]
    return _parse_json_object(text)


def _parse_json_object(text: str) -> dict:
    """Extract the first JSON object from model text, tolerating fences."""
    text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    # Fall back to the first {...} block if the model wrapped it in prose.
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        return json.loads(text[start : end + 1])
    raise ValueError(f"Could not parse JSON from model output: {text!r}")


# --------------------------------------------------------------------------
# Manual smoke test:  python ai.py
# --------------------------------------------------------------------------
if __name__ == "__main__":
    samples = [
        "Restaurant A can provide 80 meals at $8 per meal, ready by 16:00.",
        "Restaurant B might do 120 plates around 5pm, price maybe $8 each.",
        "We can cook some food later, not sure how much.",
    ]
    for s in samples:
        print(s)
        print("  ->", extract_offer(s))
        print()
