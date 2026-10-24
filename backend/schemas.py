"""Request/response schemas can be centralized here as the API grows."""
from pydantic import BaseModel


class Offer(BaseModel):
    restaurant: str
    meals: int
    total_cost: float
    ready_time: str
