const API_URL = "http://localhost:8000";

export async function findMealOptions(request) {
  try {
    const response = await fetch(`${API_URL}/analyze`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Relify API error:", error);
    throw error;
  }
}