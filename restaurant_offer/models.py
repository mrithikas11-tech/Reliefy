"""Offer data contract and status constants.

Single source of truth for the shape of a restaurant offer and the
valid status values. Uses only the Python standard library.
"""

from datetime import datetime, timezone
from uuid import uuid4

# Valid offer statuses.
ACTIVE = "active"
UPDATED = "updated"
CANCELLED = "cancelled"

VALID_STATUSES = (ACTIVE, UPDATED, CANCELLED)


def _now_iso():
    """Return the current UTC time as an ISO 8601 string."""
    return datetime.now(timezone.utc).isoformat()


def _new_offer_id():
    """Generate a short, unique offer id."""
    return uuid4().hex[:8]


def build_offer(restaurant_name, message):
    """Assemble a well-formed offer dict with a fresh id and timestamps.

    The ``message`` is stored exactly as provided. It is intentionally left
    unparsed so the team's Amazon Bedrock step can extract quantity, price,
    food type, and ready time later.
    """
    now = _now_iso()
    return {
        "offer_id": _new_offer_id(),
        "restaurant_name": restaurant_name,
        "message": message,
        "status": ACTIVE,
        "created_at": now,
        "updated_at": now,
    }
