
from itertools import combinations

def match_restaurants(offers, meals_needed, budget, deadline):
    valid = [
        o for o in offers
        if o["confirmed"]
        and o["ready_time"] <= deadline
        and o["meals"] > 0
        and o["price_per_meal"] >= 0
    ]

    best = None

    for size in range(1, len(valid) + 1):
        for group in combinations(valid, size):
            total_meals = sum(o["meals"] for o in group)
            total_cost = sum(
                o["meals"] * o["price_per_meal"]
                for o in group
            )

            if total_cost > budget:
                continue

            covered = min(total_meals, meals_needed)

            candidate = {
                "restaurants": [o["name"] for o in group],
                "meals_covered": covered,
                "total_cost": round(total_cost, 2),
                "shortfall": max(0, meals_needed - covered)
            }

            if best is None or (
                candidate["meals_covered"] > best["meals_covered"]
                or (
                    candidate["meals_covered"] == best["meals_covered"]
                    and candidate["total_cost"] < best["total_cost"]
                )
            ):
                best = candidate

    return best or {
        "restaurants": [],
        "meals_covered": 0,
        "total_cost": 0,
        "shortfall": meals_needed
    }
