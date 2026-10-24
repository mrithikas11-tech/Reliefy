
from matcher import match_restaurants

offers = [
    {
        "name": "Restaurant A",
        "meals": 80,
        "price_per_meal": 8,
        "ready_time": "16:00",
        "confirmed": True
    },
    {
        "name": "Restaurant B",
        "meals": 120,
        "price_per_meal": 8,
        "ready_time": "17:00",
        "confirmed": True
    },
    {
        "name": "Restaurant C",
        "meals": 60,
        "price_per_meal": 10,
        "ready_time": "19:00",
        "confirmed": True
    }
]

result = match_restaurants(
    offers,
    meals_needed=200,
    budget=2000,
    deadline="18:00"
)

print(result)
