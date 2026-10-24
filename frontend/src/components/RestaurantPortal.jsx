import { useState } from "react";
import {
  submitOffer,
  updateOffer,
  cancelOffer,
} from "../services/api.js";

const ACTIVE_REQUEST = {
  location: "San José State University",
  address: "One Washington Square, San José, CA",
  meals: 200,
  budget: 2000,
  deadline: "6:00 PM",
  priority: "Urgent",
};

function formatStatus(status) {
  if (!status) return "Active";

  return status.charAt(0).toUpperCase() + status.slice(1);
}

function RestaurantPortal() {
  const [restaurantName, setRestaurantName] = useState("");
  const [message, setMessage] = useState("");

  const [offer, setOffer] = useState(null);

  const [editing, setEditing] = useState(false);
  const [draftMessage, setDraftMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const isCancelled = offer?.status === "cancelled";

  function showToast(text) {
    setToast(text);

    window.setTimeout(() => {
      setToast("");
    }, 2600);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!restaurantName.trim() || !message.trim()) {
      setError(
        "Enter your restaurant name and describe your offer."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const saved = await submitOffer({
        restaurant_name: restaurantName,
        message,
      });

      setOffer(saved);
      setEditing(false);

      showToast(
        "Offer submitted. The relief coordinator can now review it."
      );
    } catch (err) {
      setError(
        err.message ||
          "Could not submit the offer. Make sure the Reliefy API is running."
      );
    } finally {
      setLoading(false);
    }
  }

  function startEdit() {
    if (!offer || isCancelled) return;

    setDraftMessage(offer.message);
    setEditing(true);
    setError("");
  }

  function discardEdit() {
    setEditing(false);
    setDraftMessage("");
    setError("");
  }

  async function saveEdit() {
    if (!offer || isCancelled || !draftMessage.trim()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const saved = await updateOffer(offer.offer_id, {
        message: draftMessage,
      });

      setOffer(saved);
      setEditing(false);

      showToast(
        "Offer updated. The coordinator will see your latest availability."
      );
    } catch (err) {
      setError(
        err.message ||
          "Could not update the offer. Make sure the Reliefy API is running."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    if (!offer || isCancelled) return;

    const confirmed = window.confirm(
      "Cancel this offer? The coordinator will no longer be able to use it."
    );

    if (!confirmed) return;

    setLoading(true);
    setError("");

    try {
      const saved = await cancelOffer(offer.offer_id);

      setOffer(saved);
      setEditing(false);

      showToast(
        "Offer cancelled. The coordinator will see the updated status."
      );
    } catch (err) {
      setError(
        err.message ||
          "Could not cancel the offer. Make sure the Reliefy API is running."
      );
    } finally {
      setLoading(false);
    }
  }

  const statusClass =
    offer?.status === "cancelled"
      ? "restaurantOfferStatus cancelled"
      : offer?.status === "updated"
        ? "restaurantOfferStatus updated"
        : "restaurantOfferStatus active";

  return (
    <main className="restaurantPortalPage">
      {toast && (
        <div className="offerToast">
          <div className="toastIcon">✓</div>

          <div>
            <strong>Relify update</strong>
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* HEADER */}

      <header className="restaurantPortalHeader">
        <div>
          <span className="eyebrow">
            RESTAURANT PARTNER PORTAL
          </span>

          <h1>Help your community with food.</h1>

          <p>
            View active relief needs, submit meal availability,
            and manage your commitment in one place.
          </p>
        </div>

        <div className="partnerNetworkBadge">
          <span></span>
          Partner Network
        </div>
      </header>

      {/* ACTIVE REQUEST */}

      <section className="activeReliefRequest">
        <div className="activeRequestHeader">
          <div>
            <span className="activeRequestLabel">
              ACTIVE RELIEF REQUEST
            </span>

            <h2>{ACTIVE_REQUEST.location}</h2>

            <p>⌖ {ACTIVE_REQUEST.address}</p>
          </div>

          <span className="urgentRestaurantBadge">
            ● {ACTIVE_REQUEST.priority}
          </span>
        </div>

        <div className="restaurantRequestMetrics">
          <div>
            <span>Meals needed</span>
            <strong>{ACTIVE_REQUEST.meals}</strong>
          </div>

          <div>
            <span>Available budget</span>
            <strong>
              ${ACTIVE_REQUEST.budget.toLocaleString()}
            </strong>
          </div>

          <div>
            <span>Needed by</span>
            <strong>{ACTIVE_REQUEST.deadline}</strong>
          </div>

          <div>
            <span>Relief site</span>
            <strong>SJSU</strong>
          </div>
        </div>

        <div className="requestExplanation">
          <div>i</div>

          <p>
            <strong>How you can help</strong>

            <span>
              Submit the number of meals you can prepare,
              pricing, dietary options, and when they will be
              ready. Reliefy helps the coordinator compare
              participating offers.
            </span>
          </p>
        </div>
      </section>

      {/* MAIN PORTAL */}

      <div className="restaurantPortalColumns">
        <section className="restaurantSubmitPanel">
          <div className="restaurantPanelHeader">
            <div>
              <span className="eyebrow">SUBMIT AN OFFER</span>

              <h2>What can you provide?</h2>

              <p>
                Describe your availability naturally. Your
                original message is preserved for processing.
              </p>
            </div>

            <span className="restaurantStepNumber">01</span>
          </div>

          <form
            className="restaurantSubmissionForm"
            onSubmit={handleSubmit}
          >
            <label>
              Restaurant name

              <input
                type="text"
                required
                placeholder="Example: Peanuts Deluxe Cafe"
                value={restaurantName}
                onChange={(event) =>
                  setRestaurantName(event.target.value)
                }
              />
            </label>

            <label>
              Describe your offer

              <textarea
                required
                rows={6}
                placeholder="Example: We can prepare 80 vegetarian meals for $8 each, ready by 4 PM."
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
              />
            </label>

            <div className="restaurantExample">
              <span>EXAMPLE OFFER</span>

              <p>
                “We can prepare 80 vegetarian meals for $8
                each, ready by 4 PM.”
              </p>
            </div>

            <button
              type="submit"
              className="restaurantPrimaryButton"
              disabled={loading}
            >
              {loading && !offer
                ? "Submitting…"
                : "Submit Offer →"}
            </button>
          </form>

          {error && !offer && (
            <div className="restaurantError">
              ⚠ {error}
            </div>
          )}
        </section>

        {/* HOW IT WORKS */}

        <aside className="restaurantGuide">
          <span className="eyebrow">HOW IT WORKS</span>

          <h3>From kitchen to relief site.</h3>

          <div className="restaurantGuideSteps">
            <div>
              <span>1</span>

              <p>
                <strong>Submit availability</strong>
                <small>
                  Tell Reliefy what your kitchen can provide.
                </small>
              </p>
            </div>

            <div>
              <span>2</span>

              <p>
                <strong>Offer is structured</strong>
                <small>
                  Reliefy converts the response into
                  coordination data.
                </small>
              </p>
            </div>

            <div>
              <span>3</span>

              <p>
                <strong>Coordinator reviews</strong>
                <small>
                  Your offer can be compared with other
                  available options.
                </small>
              </p>
            </div>

            <div>
              <span>4</span>

              <p>
                <strong>Stay in control</strong>
                <small>
                  Update or cancel your commitment if
                  circumstances change.
                </small>
              </p>
            </div>
          </div>

          <div className="restaurantGuideNotice">
            <strong>Only commit what you can deliver.</strong>

            <p>
              Relief coordinators depend on accurate meal
              quantities and preparation times.
            </p>
          </div>
        </aside>
      </div>

      {/* CURRENT OFFER */}

      {offer && (
        <section
          className={
            isCancelled
              ? "restaurantCurrentOffer restaurantCurrentOfferCancelled"
              : "restaurantCurrentOffer"
          }
        >
          <div className="currentOfferHeader">
            <div>
              <span className="eyebrow">
                YOUR CURRENT OFFER
              </span>

              <h2>{offer.restaurant_name}</h2>
            </div>

            <span className={statusClass}>
              ● {formatStatus(offer.status)}
            </span>
          </div>

          {editing ? (
            <div className="restaurantEditOffer">
              <label>
                Update your offer

                <textarea
                  rows={5}
                  value={draftMessage}
                  onChange={(event) =>
                    setDraftMessage(event.target.value)
                  }
                />
              </label>

              <div className="restaurantOfferButtons">
                <button
                  type="button"
                  className="restaurantPrimaryButton"
                  onClick={saveEdit}
                  disabled={loading}
                >
                  {loading ? "Saving…" : "Save Changes"}
                </button>

                <button
                  type="button"
                  className="restaurantOutlineButton"
                  onClick={discardEdit}
                  disabled={loading}
                >
                  Discard
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="restaurantMessageBox">
                <span>OFFER MESSAGE</span>

                <p>“{offer.message}”</p>
              </div>

              {isCancelled ? (
                <div className="restaurantCancelledNotice">
                  <strong>Offer cancelled</strong>

                  <span>
                    This offer is no longer available to the
                    coordinator and cannot be updated.
                  </span>
                </div>
              ) : (
                <div className="restaurantOfferButtons">
                  <button
                    type="button"
                    className="restaurantOutlineButton"
                    onClick={startEdit}
                    disabled={loading}
                  >
                    ✎ Update Offer
                  </button>

                  <button
                    type="button"
                    className="restaurantCancelButton"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    {loading
                      ? "Working…"
                      : "Cancel Offer"}
                  </button>
                </div>
              )}
            </>
          )}

          {error && offer && (
            <div className="restaurantError">
              ⚠ {error}
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default RestaurantPortal;