import { useState } from "react";

// Shravya: Restaurant Partner experience.
// Local React state only — no API calls yet. The natural-language message is
// preserved EXACTLY as entered because it will later be sent to Amazon Bedrock
// for AI extraction. "Cancelled" is a terminal state (mirrors the Python
// restaurant_offer workflow): once cancelled, an offer can no longer be updated.

// Mock shelter need (hardcoded for the MVP demo).
const MOCK_NEED = {
  meals: 200,
  budget: 2000,
  readyBy: "6:00 PM",
};

export default function RestaurantPortal() {
  // Form inputs.
  const [restaurantName, setRestaurantName] = useState("");
  const [message, setMessage] = useState("");

  // The submitted offer lives here once "Submit Offer" is pressed.
  // Shape: { restaurantName, message, status } | null
  const [offer, setOffer] = useState(null);

  // Inline-edit state for the Update flow.
  const [editing, setEditing] = useState(false);
  const [draftMessage, setDraftMessage] = useState("");

  const isCancelled = offer?.status === "Cancelled";

  function handleSubmit(event) {
    event.preventDefault();
    // Preserve the message verbatim. Only guard against an empty submission.
    if (!restaurantName.trim() || !message.trim()) return;
    setOffer({
      restaurantName: restaurantName.trim(),
      message, // exact natural-language text, untouched
      status: "Active",
    });
    setEditing(false);
  }

  function startEdit() {
    if (isCancelled) return; // terminal state guard
    setDraftMessage(offer.message);
    setEditing(true);
  }

  function saveEdit() {
    if (isCancelled) return; // terminal state guard
    // Reject an empty/whitespace-only draft, but store the original text
    // untouched so the natural-language message stays intact for Bedrock.
    if (!draftMessage.trim()) return;
    setOffer((prev) => ({
      ...prev,
      message: draftMessage, // exact text as edited, untouched
      status: "Updated",
    }));
    setEditing(false);
  }

  function cancelEdit() {
    setEditing(false);
  }

  function cancelOffer() {
    setEditing(false);
    setOffer((prev) => ({ ...prev, status: "Cancelled" }));
  }

  // Map status -> pill class, reusing existing design tokens.
  const statusClass =
    offer?.status === "Cancelled"
      ? "offerStatus offerStatusCancelled"
      : offer?.status === "Updated"
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

          <button className="findButton" type="submit">
            Submit Offer →
          </button>
        </form>
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
              <h2>{offer.restaurantName}</h2>
            </div>
            <span className={statusClass}>{offer.status}</span>
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
                <button className="findButton" type="button" onClick={saveEdit}>
                  Save Changes
                </button>
                <button
                  className="outlineButton"
                  type="button"
                  onClick={cancelEdit}
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
                  >
                    Update Offer
                  </button>
                  <button
                    className="dangerButton"
                    type="button"
                    onClick={cancelOffer}
                  >
                    Cancel Offer
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      )}
    </main>
  );
}
