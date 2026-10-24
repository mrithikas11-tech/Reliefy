const shelterNames = [
  "Downtown Relief Shelter",
  "Riverside Community Center",
  "Northside Emergency Hub",
  "Central City Relief Center",
  "Hope Community Shelter",
  "Westside Support Center",
];

const restaurantNames = [
  "Sunrise Kitchen",
  "Maple Bistro",
  "Garden Plate",
  "Harvest Table",
  "Community Grill",
  "Green Fork",
  "Oak Street Kitchen",
  "Golden Spoon",
  "Cornerstone Cafe",
  "Fresh Table",
  "Neighborhood Kitchen",
  "Riverfront Bistro",
];

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function formatTime(hour) {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour;

  return `${displayHour}:00 ${period}`;
}

export function generateDemoScenario() {
  const mealsNeeded = randomNumber(150, 400);

  const budget = randomNumber(18, 45) * 100;

  const deadlineHour = randomNumber(17, 21);

  const names = shuffle(restaurantNames).slice(0, 4);

  const restaurants = names.map((name, index) => {
    const meals = randomNumber(50, 150);

    const pricePerMeal = randomNumber(7, 12);

    const readyHour = randomNumber(14, 21);

    const distance = (
      randomNumber(5, 45) / 10
    ).toFixed(1);

    return {
      id: index + 1,
      name,
      meals,
      cost: meals * pricePerMeal,
      readyHour,
      readyTime: formatTime(readyHour),
      distance: Number(distance),
      status:
        readyHour <= deadlineHour
          ? "available"
          : "late",
    };
  });

  const availableRestaurants = restaurants
    .filter(
      (restaurant) =>
        restaurant.readyHour <= deadlineHour
    )
    .sort((a, b) => {
      const priceA = a.cost / a.meals;
      const priceB = b.cost / b.meals;

      return priceA - priceB;
    });

  let mealsCovered = 0;
  let totalCost = 0;

  const selected = [];

  for (const restaurant of availableRestaurants) {
    if (mealsCovered >= mealsNeeded) {
      break;
    }

    if (totalCost + restaurant.cost <= budget) {
      selected.push(restaurant.id);

      mealsCovered += restaurant.meals;
      totalCost += restaurant.cost;
    }
  }

  const finalRestaurants = restaurants.map(
    (restaurant) => ({
      ...restaurant,

      status: selected.includes(restaurant.id)
        ? "selected"
        : restaurant.status,
    })
  );

  return {
    shelter: randomItem(shelterNames),

    mealsNeeded,

    budget,

    deadlineHour,

    deadline: formatTime(deadlineHour),

    restaurants: finalRestaurants,

    mealsCovered: Math.min(
      mealsCovered,
      mealsNeeded
    ),

    totalCost,

    remainingBudget: budget - totalCost,

    shortfall: Math.max(
      mealsNeeded - mealsCovered,
      0
    ),
  };
}