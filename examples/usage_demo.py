"""Runnable demo of the Restaurant Offer Workflow.

Shows the full lifecycle: submit -> update -> cancel, printing the offer
after each step so the status transition (active -> updated -> cancelled)
is visible.

Run from the project root:

    python3 examples/usage_demo.py
"""

import json
import os
import sys

# Allow running directly from the project root without installation.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from restaurant_offer import submit_offer, update_offer, cancel_offer


def show(label, offer):
    print(label)
    print(json.dumps(offer, indent=2))
    print()


def main():
    # 1. Submit a natural-language offer.
    offer = submit_offer(
        "Tony's Kitchen",
        "We can prepare 80 vegetarian meals for $8 each, ready by 4 PM.",
    )
    show("1. Submitted (status should be 'active'):", offer)

    offer_id = offer["offer_id"]

    # 2. Update the offer's message.
    offer = update_offer(
        offer_id,
        "We can now prepare 120 vegetarian meals for $7 each, ready by 5 PM.",
    )
    show("2. Updated (status should be 'updated'):", offer)

    # 3. Cancel the offer.
    offer = cancel_offer(offer_id)
    show("3. Cancelled (status should be 'cancelled'):", offer)

    print(
        "Lifecycle complete: "
        f"active -> updated -> cancelled (offer_id={offer_id})"
    )


if __name__ == "__main__":
    main()
