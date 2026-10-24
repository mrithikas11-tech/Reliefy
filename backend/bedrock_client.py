import json
import re

import boto3
from pydantic import BaseModel, Field, ValidationError

from backend.config import AWS_REGION, BEDROCK_MODEL_ID


class RestaurantOffer(BaseModel):
    restaurant: str = Field(min_length=1)
    meals: int = Field(gt=0)
    total_cost: float = Field(ge=0)
    ready_time: str = Field(
        pattern=r"^(?:[01]\d|2[0-3]):[0-5]\d$"
    )


client = boto3.client(
    "bedrock-runtime",
    region_name=AWS_REGION,
)


def extract_offer(message: str) -> dict:
    """Extract one restaurant offer and validate the returned fields."""
    response = client.converse(
        modelId=BEDROCK_MODEL_ID,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "text": (
                            "Extract the restaurant offer from the message "
                            "as one JSON object with exactly these fields: "
                            "restaurant (string), meals (integer), "
                            "total_cost (number), ready_time (24-hour HH:MM). "
                            "Do not guess missing information. If any required "
                            "field is missing or unclear, return "
                            '{"error":"missing_or_unclear_field"}. '
                            "Return JSON only.\n\n"
                            f"Restaurant message:\n{message}"
                        )
                    }
                ],
            }
        ],
        inferenceConfig={
            "maxTokens": 300,
        },
    )

    text = response["output"]["message"]["content"][0]["text"].strip()

    # Also tolerate a model response wrapped in Markdown code fences.
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)

    # Recover a JSON object if the model adds a little surrounding text.
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end < start:
        raise ValueError("Bedrock did not return a JSON object.")

    data = json.loads(text[start:end + 1])

    if "error" in data:
        raise ValueError("The restaurant message is missing clear offer details.")

    try:
        offer = RestaurantOffer.model_validate(data)
    except ValidationError as exc:
        raise ValueError(
            f"The extracted restaurant offer failed validation: {exc}"
        ) from exc

    return offer.model_dump()
