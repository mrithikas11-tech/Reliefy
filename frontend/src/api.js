const API_URL = "http://127.0.0.1:8000";

export async function analyzeMealRequest({
  meals,
  budget,
  deadline,
  restaurantMessages = [],
}) {
  const response = await fetch(`${API_URL}/analyze`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      meals_needed: Number(meals),
      budget: Number(budget),
      deadline,
      restaurant_messages: restaurantMessages,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail || `Request failed (${response.status})`
    );
  }

  return response.json();
}