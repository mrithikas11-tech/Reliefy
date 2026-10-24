"""Restaurant offer workflow.

Three framework-agnostic operations that return plain dicts:
submit, update, and cancel. No FastAPI, AWS, Bedrock, or database here.

Error convention:
- ValueError  -> invalid input or invalid state (e.g. empty field,
                 updating a cancelled offer, or cancelling one twice)
- KeyError    -> the requested offer_id does not exist (raised by the store)
"""

from . import store
from .models import build_offer, UPDATED, CANCELLED, _now_iso


def _require_non_empty(value, field_name):
    """Validate that a string field is present and not blank."""
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{field_name} cannot be empty")


def submit_offer(restaurant_name, message):
    """Create and store a new active offer. Returns the offer dict."""
    _require_non_empty(restaurant_name, "restaurant_name")
    _require_non_empty(message, "message")

    # Normalize the restaurant name. The message is intentionally left
    # untouched for downstream Amazon Bedrock processing.
    offer = build_offer(restaurant_name.strip(), message)
    return store.save(offer)


def update_offer(offer_id, message):
    """Replace an offer's message and mark it updated. Returns the offer.

    Raises KeyError if the offer does not exist, and ValueError if the
    offer is cancelled or the new message is empty.
    """
    _require_non_empty(message, "message")

    offer = store.get(offer_id)  # raises KeyError if missing
    if offer["status"] == CANCELLED:
        raise ValueError(f"Cannot update a cancelled offer (offer_id={offer_id!r})")

    offer["message"] = message
    offer["status"] = UPDATED
    offer["updated_at"] = _now_iso()
    return store.save(offer)


def cancel_offer(offer_id):
    """Mark an offer cancelled. Returns the offer.

    Raises KeyError if the offer does not exist, and ValueError if the
    offer is already cancelled (cancelled is a terminal state).
    """
    offer = store.get(offer_id)  # raises KeyError if missing
    if offer["status"] == CANCELLED:
        raise ValueError("Offer is already cancelled")

    offer["status"] = CANCELLED
    offer["updated_at"] = _now_iso()
    return store.save(offer)
