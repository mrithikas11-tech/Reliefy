# Reliefy

AI-powered food procurement copilot for disaster-relief coordinators.

## Team ownership
- **Mrithika:** GitHub coordination, FastAPI backend, AWS Bedrock connection
- **Zada:** React dashboard in `frontend/`
- **Akshita:** offer schema and deterministic matching in `matching/`
- **Shravya:** sample restaurant offers and cancellation scenarios in `data/`
- **Manisha:** integration testing, demo script, and pitch in `docs/`

## Quick start

### Backend
Requires Python 3.10+.

```bash
python -m venv .venv
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# macOS/Linux:
# source .venv/bin/activate
python -m pip install -r requirements.txt
uvicorn backend.main:app --reload
```

Open `http://127.0.0.1:8000/health` and `http://127.0.0.1:8000/docs`.

The starter backend uses mock offers and does **not** call Bedrock yet. Add Bedrock in `backend/bedrock_client.py` after the end-to-end demo works.

### Frontend
Requires Node.js 18+.

```bash
cd frontend
npm install
npm run dev
```

## Demo scenario
- Shelter needs **200 meals**, budget **$2,000**, deadline **6:00 PM**.
- Restaurant A: 80 meals for $640, ready 4:00 PM.
- Restaurant B: 120 meals for $960, ready 5:00 PM.
- Restaurant C: 60 meals for $600, ready 7:00 PM (too late).
- Recommended: A + B = 200 meals for $1,600.
- Cancellation twist: if B cancels, only 80 meals remain covered from A; shortfall is 120.

## API contract
`POST /analyze` request:

```json
{
  "meals_needed": 200,
  "budget": 2000,
  "deadline": "18:00",
  "restaurant_messages": [
    "Restaurant A offers 80 meals for $640, ready at 4:00 PM",
    "Restaurant B offers 120 meals for $960, ready at 5:00 PM",
    "Restaurant C offers 60 meals for $600, ready at 7:00 PM"
  ]
}
```

The response includes `meals_covered`, `total_cost`, `shortfall`, `status`, and selected offers.

## Git collaboration
- Create a branch for each feature: `feature/frontend-dashboard`, `feature/bedrock`, etc.
- Keep commits small and descriptive.
- Open a pull request before merging into `main`.
- Never commit AWS credentials, `.env` files, virtual environments, or `node_modules`.
