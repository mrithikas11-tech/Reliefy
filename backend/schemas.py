"""Request/response schemas can be centralized here as the API grows."""
from pydantic import BaseModel


class Offer(BaseModel):
    restaurant: str
    meals: int
    total_cost: float
    ready_time: str


class SubmitOfferRequest(BaseModel):
    """Body for POST /offers."""
    restaurant_name: str
    message: str


class UpdateOfferRequest(BaseModel):
    """Body for PUT /offers/{offer_id}."""
    message: str
