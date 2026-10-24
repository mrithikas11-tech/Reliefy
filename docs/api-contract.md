# API Contract

## `GET /health`
Returns `{"status":"ok","service":"reliefy-api"}`.

## `POST /analyze`
Request:
- `meals_needed`: positive integer
- `budget`: non-negative number
- `deadline`: local time as `HH:MM`, 24-hour format
- `restaurant_messages`: array of raw offer messages

Response:
- `meals_needed`
- `meals_covered`
- `total_cost`
- `shortfall`
- `selected_offers`
- `excluded_offers`
- `status` (currently `pending_verification`)
- `note`

Current starter uses hard-coded demo offers. Bedrock parsing is a follow-up task.
