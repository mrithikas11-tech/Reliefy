# Reliefy — Restaurant Offer Workflow

A lightweight, framework-agnostic Python module for the restaurant side of
Reliefy. It lets a restaurant **submit**, **update**, and **cancel** a
natural-language food offer during a disaster-relief event.

This module has **no** dependencies beyond the Python standard library. It
does **not** include FastAPI, React, AWS, boto3, Bedrock, or a database — it
is meant to be imported and called by the team's FastAPI backend.

> The restaurant's `message` is stored **exactly as written** and is never
> parsed or modified here. The team's Amazon Bedrock step is responsible for
> extracting quantity, price, food type, and ready time from `message`
> downstream.

## Install / run

No install needed. Requires Python 3.7+ (standard library only).

Run the demo from the project root:

```bash
python3 examples/usage_demo.py
```

## Offer JSON contract

Every operation returns a plain dict with this shape:

```json
{
  "offer_id": "a1b2c3d4",
  "restaurant_name": "Tony's Kitchen",
  "message": "We can prepare 80 vegetarian meals for $8 each, ready by 4 PM.",
  "status": "active",
  "created_at": "2026-10-23T18:00:00+00:00",
  "updated_at": "2026-10-23T18:00:00+00:00"
}
```

| Field             | Type   | Notes                                                        |
| ----------------- | ------ | ------------------------------------------------------------ |
| `offer_id`        | string | Generated on submit. Use it to update/cancel.                |
| `restaurant_name` | string | Required, non-empty. Leading/trailing whitespace stripped.   |
| `message`         | string | Required, non-empty. Raw natural language, left unparsed.    |
| `status`          | string | One of `active`, `updated`, `cancelled`.                     |
| `created_at`      | string | ISO 8601 UTC timestamp, set on submit.                       |
| `updated_at`      | string | ISO 8601 UTC timestamp, refreshed on update/cancel.          |

### Status values and transitions

- `active` — set when an offer is first submitted.
- `updated` — set when the message is changed.
- `cancelled` — set when the offer is cancelled. Terminal: a cancelled
  offer cannot be updated or cancelled again.

```
submit  -> active
update  -> updated      (not allowed if already cancelled)
cancel  -> cancelled    (not allowed if already cancelled)
```

## API

```python
from restaurant_offer import submit_offer, update_offer, cancel_offer
```

### `submit_offer(restaurant_name, message) -> dict`
Strips whitespace from `restaurant_name`, generates an `offer_id`, sets
`status="active"`, sets `created_at` and `updated_at`, stores the offer, and
returns it. The `message` is stored exactly as entered.

### `update_offer(offer_id, message) -> dict`
Finds the offer, replaces `message`, sets `status="updated"`, refreshes
`updated_at`, and returns it.

### `cancel_offer(offer_id) -> dict`
Finds the offer, sets `status="cancelled"`, refreshes `updated_at`, and
returns it.

## Validation and errors

- `ValueError` — raised for invalid input or invalid state:
  - empty `restaurant_name`
  - empty `message`
  - attempting to update a `cancelled` offer
  - attempting to cancel an already-`cancelled` offer
- `KeyError` — raised when `offer_id` does not exist (on update/cancel).

Suggested mapping for the FastAPI layer:

| Exception    | HTTP status |
| ------------ | ----------- |
| `ValueError` | 400         |
| `KeyError`   | 404         |

## Integration notes

- The in-memory store lives in `restaurant_offer/store.py`. Swap it for a
  real datastore by replacing just that file; the workflow logic does not
  change.
- All operations return plain dicts, so they serialize to JSON directly for
  API responses and are ready to forward to the Bedrock extraction step.
