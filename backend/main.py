from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from botocore.exceptions import BotoCoreError, ClientError

from backend.bedrock_client import extract_offer
from matching.matcher import choose_offers
from matching.offer_schema import DEMO_OFFERS

app = FastAPI(title="Reliefy API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    meals_needed: int = Field(gt=0)
    budget: float = Field(ge=0)
    deadline: str
    restaurant_messages: list[str] = Field(default_factory=list)


@app.get("/health")
def health():
    return {"status": "ok", "service": "reliefy-api"}


@app.post("/analyze")
def analyze(request: AnalyzeRequest):
    if request.restaurant_messages:
        messages = [
            message.strip()
            for message in request.restaurant_messages
            if message.strip()
        ]

        if not messages:
            raise HTTPException(
                status_code=422,
                detail="Provide at least one non-empty restaurant message.",
            )

        try:
            offers = [extract_offer(message) for message in messages]
        except (ValueError, ClientError, BotoCoreError) as exc:
            raise HTTPException(
                status_code=502,
                detail=f"Could not extract a valid restaurant offer: {exc}",
            ) from exc
    else:
        # Keep the demo usable without supplying restaurant messages.
        offers = DEMO_OFFERS

    result = choose_offers(
        meals_needed=request.meals_needed,
        budget=request.budget,
        deadline=request.deadline,
        offers=offers,
    )
    result["status"] = "pending_verification"
    result["note"] = (
        "AI-extracted or demo offers require human verification "
        "before real-world use."
    )
    return result
