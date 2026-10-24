"""In-memory offer store.

A deliberately thin layer so it can be swapped for a real datastore later
by replacing only this file. Keyed by ``offer_id``. Standard library only.
"""

# offer_id -> offer dict
_offers = {}


def save(offer):
    """Insert or overwrite an offer. Returns the stored offer."""
    _offers[offer["offer_id"]] = offer
    return offer


def get(offer_id):
    """Return the offer for ``offer_id``.

    Raises KeyError if no offer with that id exists.
    """
    if offer_id not in _offers:
        raise KeyError(f"No offer found with offer_id={offer_id!r}")
    return _offers[offer_id]


def all_offers():
    """Return a list of all stored offers."""
    return list(_offers.values())


def clear():
    """Remove all offers. Useful for demos and repeatable runs."""
    _offers.clear()
