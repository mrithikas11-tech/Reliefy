"""
Reliefy — end-to-end integration test (mock mode).

Exercises the full workflow:

    natural-language message  ->  extract_offer()  ->  match_restaurants()

It runs entirely in mock mode, so no AWS credentials are required. Each
message is parsed into the structured offer schema, the offers are printed,
and the matcher's recommendation for the shelter's needs is printed.

Two scenarios are run:

    1. All three restaurants confirm  -> A + B cover 200 meals, no shortfall.
    2. Restaurant B cancels           -> only A is usable (C is past the
                                          deadline), leaving a 120-meal
                                          shortfall.

Run it:

    python test_integration.py
"""

import os

from ai import extract_offer
from matcher import match_restaurants

# Force mock mode so this test never reaches out to AWS, regardless of how the
# environment happens to be configured.
os.environ["RELIEFY_AI_MODE"] = "mock"

# Shelter requirements, shared by every scenario.
MEALS_NEEDED = 200
BUDGET = 2000
DEADLINE = "18:00"

# --- Scenario 1: every restaurant confirms --------------------------------
SCENARIO_ALL_CONFIRM = [
    "Restaurant A can provide 80 meals at $8 per meal, ready by 16:00.",
    "Restaurant B can provide 120 meals at $8 per meal, ready by 17:00.",
    "Restaurant C can provide 60 meals at $10 per meal, ready by 19:00.",
]

# --- Scenario 2: Restaurant B cancels -------------------------------------
# B's message uses uncertain wording ("might", "maybe"), so extract_offer()
# naturally returns confirmed=False -- we exercise the real extraction path
# rather than hand-editing the offer dict. A and C are unchanged, so C is
# still excluded by the matcher for being ready after the 18:00 deadline.
SCENARIO_B_CANCELS = [
    "Restaurant A can provide 80 meals at $8 per meal, ready by 16:00.",
    "Restaurant B might do 120 meals, maybe around $8 per meal by 17:00.",
    "Restaurant C can provide 60 meals at $10 per meal, ready by 19:00.",
]


def _format_offer(offer: dict) -> str:
    """Readable one-line view, tolerant of null/unconfirmed fields."""
    name = offer.get("name") or "(unknown)"
    meals = offer.get("meals")
    price = offer.get("price_per_meal")
    ready = offer.get("ready_time") or "(unknown)"
    confirmed = offer.get("confirmed", False)

    meals_str = meals if meals is not None else "(unknown)"
    price_str = f"${price:.2f}" if price is not None else "(unknown)"

    return (
        f"{name}: meals={meals_str}, price_per_meal={price_str}, "
        f"ready_time={ready}, confirmed={confirmed}"
    )


def run_scenario(title: str, messages: list) -> dict:
    """Extract offers from `messages`, run the matcher, print, and return it."""
    print("=" * 60)
    print(title)
    print("=" * 60)
    print(
        f"Shelter needs {MEALS_NEEDED} meals, "
        f"budget ${BUDGET}, deadline {DEADLINE}\n"
    )

    # --- Step 1: extract structured offers from the messages -------------
    print("Extracted offers")
    print("-" * 60)
    offers = []
    for msg in messages:
        offer = extract_offer(msg)
        offers.append(offer)
        print(f"message : {msg}")
        print(f"offer   : {_format_offer(offer)}\n")

    # --- Step 2: report which offers are usable by the matcher -----------
    # The matcher only considers confirmed offers with complete data, so we
    # surface anything it will silently skip.
    confirmed = [o for o in offers if o.get("confirmed")]
    skipped = [o for o in offers if not o.get("confirmed")]

    print("Matcher input summary")
    print("-" * 60)
    print(f"usable (confirmed) offers : {len(confirmed)}")
    if skipped:
        for o in skipped:
            name = o.get("name") or "(unknown)"
            print(f"  skipped (unconfirmed/incomplete): {name}")
    print()

    # --- Step 3: run the matcher -----------------------------------------
    recommendation = match_restaurants(
        offers,
        meals_needed=MEALS_NEEDED,
        budget=BUDGET,
        deadline=DEADLINE,
    )

    print("Final recommendation")
    print("-" * 60)
    chosen = recommendation.get("restaurants") or []
    print(f"restaurants   : {', '.join(chosen) if chosen else '(none)'}")
    print(f"meals_covered : {recommendation.get('meals_covered')}")
    print(f"total_cost    : ${recommendation.get('total_cost')}")
    print(f"shortfall     : {recommendation.get('shortfall')}")
    print("=" * 60)
    print()
    return recommendation


def main() -> None:
    run_scenario(
        "Scenario 1 — all restaurants confirm (mock mode)",
        SCENARIO_ALL_CONFIRM,
    )
    run_scenario(
        "Scenario 2 — Restaurant B cancels (mock mode)",
        SCENARIO_B_CANCELS,
    )


if __name__ == "__main__":
    main()
