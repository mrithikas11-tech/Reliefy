from itertools import combinations


def _minutes(hhmm: str) -> int:
    hours, minutes = hhmm.split(":")
    return int(hours) * 60 + int(minutes)


def choose_offers(meals_needed: int, budget: float, deadline: str, offers: list[dict]) -> dict:
    """Pick the lowest-cost feasible combination, maximizing covered meals first.

    An offer is feasible only if it is ready by the deadline and the total
    selected cost stays within budget. This small brute-force approach is for
    hackathon-sized demo data.
    """
    deadline_minutes = _minutes(deadline)
    eligible = [
        offer for offer in offers
        if _minutes(offer["ready_time"]) <= deadline_minutes
        and offer["total_cost"] <= budget
    ]

    best = []
    best_key = (-1, float("inf"))
    for size in range(1, len(eligible) + 1):
        for combo in combinations(eligible, size):
            meals = sum(item["meals"] for item in combo)
            cost = sum(item["total_cost"] for item in combo)
            if cost <= budget:
                key = (min(meals, meals_needed), cost)
                if key[0] > best_key[0] or (key[0] == best_key[0] and key[1] < best_key[1]):
                    best, best_key = list(combo), key

    meals_covered = sum(item["meals"] for item in best)
    total_cost = sum(item["total_cost"] for item in best)
    return {
        "meals_needed": meals_needed,
        "meals_covered": meals_covered,
        "total_cost": round(total_cost, 2),
        "shortfall": max(0, meals_needed - meals_covered),
        "selected_offers": best,
        "excluded_offers": [o for o in offers if o not in best],
    }
