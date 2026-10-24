from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from matching.matcher import choose_offers
from matching.offer_schema import DEMO_OFFERS

app = FastAPI(title="Reliefy API", version="0.1.0")

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
    restaurant_messages: list[str] = []


@app.get("/health")
def health():
    return {"status": "ok", "service": "reliefy-api"}


@app.post("/analyze")
def analyze(request: AnalyzeRequest):
    # Starter uses deterministic demo offers. Later, parse restaurant_messages
    # with Bedrock, validate the parsed offers, then pass them to choose_offers.
    result = choose_offers(
        meals_needed=request.meals_needed,
        budget=request.budget,
        deadline=request.deadline,
        offers=DEMO_OFFERS,
    )
    result["status"] = "pending_verification"
    result["note"] = "Demo data is used for now; confirm offers before real-world use."
    return result
