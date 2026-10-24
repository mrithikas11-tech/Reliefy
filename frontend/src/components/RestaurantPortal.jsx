import { useState } from "react";
import { submitOffer, updateOffer, cancelOffer } from "../services/api.js";

// Shravya: Restaurant Partner experience.
// Talks to the backend /offers endpoints via the restaurant_offer workflow.
// The natural-language message is preserved EXACTLY as entered (never trimmed
// or reformatted) because it is sent to Amazon Bedrock for AI extraction
// downstream. "Cancelled" is a terminal state (mirrors the Python workflow):
// once cancelled, an offer can no longer be updated.

// Mock shelter need (hardcoded for the MVP demo).
const MOCK_NEED = {
  meals: 200,
  budget: 2000,
  readyBy: "6:00 PM",
};

// The backend returns lowercase statuses (active/updated/cancelled). Display
// them capitalized WITHOUT changing the stored value from the backend.
function displayStatus(status) {
  if (!status) return "";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function RestaurantPortal() {
  // Form inputs.
  const [restaurantName, setRestaurantName] = useState("");
  const [message, setMessage] = useState("");

  // The offer dict exactly as returned by the backend
  // ({ offer_id, restaurant_name, message, status, created_at, updated_at }).
  const [offer, setOffer] = useState(null);

  // Inline-edit state for the Update flow.
  const [editing, setEditing] = useState(false);
  const [draftMessage, setDraftMessage] = useState("");

  // Network state so the UI never fails silently.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isCancelled = offer?.status === "cancelled";

  async function handleSubmit(event) {
    event.preventDefault();
    // Preserve the message verbatim. Only guard against an empty submission.
    if (!restaurantName.trim() || !message.trim()) return;
    setLoading(true);
    setError("");
    try {
      const saved = await submitOffer({
        restaurant_name: restaurantName,
        message, // exact natural-language text, untouched
      });
      setOffer(saved);
      setEditing(false);
    } catch (err) {
      setError(err.message || "Could not submit the offer. Is the API running?");
    } finally {
      setLoading(false);
    }
  }

  function startEdit() {
    if (isCancelled) return; // terminal state guard
    setDraftMessage(offer.message);
    setError("");
    setEditing(true);
  }

  async function handleSaveEdit() {
    if (isCancelled) return; // terminal state guard
    // Reject an empty/whitespace-only draft, but send the original text
    // untouched so the natural-language message stays intact for Bedrock.
    if (!draftMessage.trim()) return;
    setLoading(true);
    setError("");
    try {
      const saved = await updateOffer(offer.offer_id, {
        message: draftMessage, // exact text as edited, untouched
      });
      setOffer(saved);
      setEditing(false);
    } catch (err) {
      setError(err.message || "Could not update the offer. Is the API running?");
    } finally {
      setLoading(false);
    }
  }

  function handleDiscardEdit() {
    setEditing(false);
  }

  async function handleCancelOffer() {
    setLoading(true);
    setError("");
    try {
      const saved = await cancelOffer(offer.offer_id);
      setOffer(saved);
      setEditing(false);
    } catch (err) {
      setError(err.message || "Could not cancel the offer. Is the API running?");
    } finally {
      setLoading(false);
    }
  }

  // Map status -> pill class, reusing existing design tokens.
  const statusClass =
    offer?.status === "cancelled"
      ? "offerStatus offerStatusCancelled"
      : offer?.status === "updated"
        ? "offerStatus offerStatusUpdated"
        : "offerStatus";

  return (
    <main className="main restaurantMain" id="restaurants">
      <section className="requestCard restaurantIntro">
        <p className="eyebrow">RESTAURANT PORTAL</p>
        <h2>Restaurant Partner Portal</h2>
        <p className="description">
          Local restaurants can respond to emergency meal requests from relief
          coordinators. Tell us what you can prepare in plain language and
          submit your offer — no forms to decode, just describe what you can do.
        </p>

        {/* MOCK SHELTER NEED */}
        <div className="needCard">
          <p className="needHeading">Current shelter need</p>
          <div className="needMetrics">
            <div>
              <span>Meals needed</span>
              <strong>{MOCK_NEED.meals}</strong>
            </div>
            <div>
              <span>Budget</span>
              <strong>${MOCK_NEED.budget.toLocaleString()}</strong>
            </div>
            <div>
              <span>Needed by</span>
              <strong>{MOCK_NEED.readyBy}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* OFFER FORM */}
      <section className="requestCard">
        <div className="cardHeader">
          <div>
            <p className="eyebrow">SUBMIT AN OFFER</p>
            <h2>What can you provide?</h2>
          </div>
        </div>

        <form className="requestForm restaurantForm" onSubmit={handleSubmit}>
          <label className="stackedLabel">
            Restaurant Name
            <input
              type="text"
              required
              placeholder="Example: Tony's Kitchen"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
            />
          </label>

          <label className="stackedLabel">
            What can you provide?
            <textarea
              className="offerTextarea"
              required
              rows={4}
              placeholder="Example: We can prepare 80 vegetarian meals for $8 each, ready by 4 PM."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>

          <button className="findButton" type="submit" disabled={loading}>
            {loading && !offer ? "Submitting…" : "Submit Offer →"}
          </button>
        </form>

        {error && !offer && <p className="errorMessage">{error}</p>}
      </section>

      {/* OFFER CONFIRMATION */}
      {offer && (
        <section
          className={
            isCancelled ? "requestCard offerConfirm isCancelled" : "requestCard offerConfirm"
          }
        >
          <div className="cardHeader">
            <div>
              <p className="eyebrow">YOUR OFFER</p>
              <h2>{offer.restaurant_name}</h2>
            </div>
            <span className={statusClass}>{displayStatus(offer.status)}</span>
          </div>

          {editing ? (
            <>
              <label className="stackedLabel">
                Update your message
                <textarea
                  className="offerTextarea"
                  rows={4}
                  value={draftMessage}
                  onChange={(e) => setDraftMessage(e.target.value)}
                />
              </label>
              <div className="offerActions">
                <button
                  className="findButton"
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={loading}
                >
                  {loading ? "Saving…" : "Save Changes"}
                </button>
                <button
                  className="outlineButton"
                  type="button"
                  onClick={handleDiscardEdit}
                  disabled={loading}
                >
                  Discard
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="offerMessageLabel">Offer message</p>
              <p className="offerMessage">{offer.message}</p>

              {isCancelled ? (
                <p className="cancelledNotice">
                  This offer has been cancelled and can no longer be updated.
                </p>
              ) : (
                <div className="offerActions">
                  <button
                    className="outlineButton"
                    type="button"
                    onClick={startEdit}
                    disabled={loading}
                  >
                    Update Offer
                  </button>
                  <button
                    className="dangerButton"
                    type="button"
                    onClick={handleCancelOffer}
                    disabled={loading}
                  >
                    {loading ? "Working…" : "Cancel Offer"}
                  </button>
                </div>
              )}
            </>
          )}

          {error && offer && <p className="errorMessage">{error}</p>}
        </section>
      )}
    </main>
  );
}
