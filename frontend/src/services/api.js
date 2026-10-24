const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

export async function analyze(payload) {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error(`API request failed (${response.status})`)
  return response.json()
}

// ---------------------------------------------------------------------------
// Restaurant Offer Workflow (Shravya)
// Thin client over the backend /offers endpoints. Each returns the
// restaurant_offer dict exactly as the backend sends it (lowercase status).
// ---------------------------------------------------------------------------

async function parseError(response) {
  // FastAPI error bodies look like { "detail": "..." }. Fall back to status.
  try {
    const body = await response.json()
    if (body && body.detail) return body.detail
  } catch {
    // ignore non-JSON error bodies
  }
  return `Request failed (${response.status})`
}

export async function submitOffer(payload) {
  const response = await fetch(`${API_BASE}/offers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error(await parseError(response))
  return response.json()
}

export async function updateOffer(offerId, payload) {
  const response = await fetch(`${API_BASE}/offers/${offerId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error(await parseError(response))
  return response.json()
}

export async function cancelOffer(offerId) {
  const response = await fetch(`${API_BASE}/offers/${offerId}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!response.ok) throw new Error(await parseError(response))
  return response.json()
}
