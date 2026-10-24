import { useState } from "react";

const offers = [
  {
    id: 1,
    name: "Peanuts Deluxe Cafe",
    address: "275 E San Fernando St",
    meals: 80,
    cost: 640,
    ready: "4:00 PM",
    status: "available",
  },
  {
    id: 2,
    name: "Home Eat",
    address: "88 S 4th St",
    meals: 120,
    cost: 960,
    ready: "5:00 PM",
    status: "available",
  },
  {
    id: 3,
    name: "Sammy G's Pizzeria",
    address: "330 S 10th St",
    meals: 60,
    cost: 600,
    ready: "7:00 PM",
    status: "late",
  },
  {
    id: 4,
    name: "La Victoria Taqueria",
    address: "140 E San Carlos St",
    meals: 90,
    cost: 720,
    ready: "5:30 PM",
    status: "available",
  },
];

function NewRequest({ setPage }) {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    shelter: "San José State University",
    meals: 200,
    budget: 2000,
    deadline: "18:00",
  });

  const [selectedOffers, setSelectedOffers] = useState([]);
  const [toast, setToast] = useState("");
  const [approved, setApproved] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function showToast(message) {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 2400);
  }

  function toggleOffer(offer) {
    if (offer.status === "late") {
      showToast(
        `${offer.name} cannot be selected because it misses the deadline.`
      );
      return;
    }

    if (selectedOffers.includes(offer.id)) {
      setSelectedOffers((current) =>
        current.filter((id) => id !== offer.id)
      );

      showToast(`${offer.name} removed from the plan.`);
      return;
    }

    setSelectedOffers((current) => [
      ...current,
      offer.id,
    ]);

    showToast(
      `Interest notification prepared for ${offer.name}.`
    );
  }

  const selectedRestaurants = offers.filter((offer) =>
    selectedOffers.includes(offer.id)
  );

  const selectedMeals = selectedRestaurants.reduce(
    (sum, offer) => sum + offer.meals,
    0
  );

  const selectedCost = selectedRestaurants.reduce(
    (sum, offer) => sum + offer.cost,
    0
  );

  const remainingBudget =
    Number(form.budget) - selectedCost;

  const shortfall = Math.max(
    Number(form.meals) - selectedMeals,
    0
  );

  function approvePlan() {
    setApproved(true);

    showToast(
      "Relief plan approved for coordinator follow-up."
    );
  }

  return (
    <main className="standardPage">
      {toast && (
        <div className="offerToast">
          <div className="toastIcon">✓</div>

          <div>
            <strong>Relify update</strong>
            <span>{toast}</span>
          </div>
        </div>
      )}

      <header className="pageHeader">
        <div>
          <span className="eyebrow">
            NEW RELIEF REQUEST
          </span>

          <h1>Create a Relief Request</h1>

          <p>
            Define the need, select nearby offers, and approve
            a coordination plan.
          </p>
        </div>

        <button
          type="button"
          className="backButton"
          onClick={() => setPage("dashboard")}
        >
          ← Dashboard
        </button>
      </header>

      <div className="stepper">
        {[
          ["1", "Request Details"],
          ["2", "Review Offers"],
          ["3", "Recommendation"],
          ["4", "Approve Plan"],
        ].map(([number, label], index) => (
          <div
            key={number}
            className={
              step >= Number(number)
                ? "stepperItem stepperActive"
                : "stepperItem"
            }
          >
            <span>{number}</span>
            <small>{label}</small>

            {index < 3 && (
              <div className="stepLine"></div>
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <section className="workflowCard">
          <div className="workflowHeading">
            <span className="eyebrow">STEP 1</span>
            <h2>Request Details</h2>
            <p>
              Enter the requirements for the relief site.
            </p>
          </div>

          <div className="locationBanner">
            <div className="locationBannerIcon">⌖</div>

            <div>
              <strong>San José State University</strong>
              <span>
                One Washington Square · San José, CA
              </span>
            </div>

            <span className="demoPill">
              Demo relief site
            </span>
          </div>

          <div className="requestFields">
            <label>
              Relief location
              <input
                name="shelter"
                value={form.shelter}
                onChange={updateField}
              />
            </label>

            <label>
              Meals needed
              <input
                type="number"
                min="1"
                name="meals"
                value={form.meals}
                onChange={updateField}
              />
            </label>

            <label>
              Budget ($)
              <input
                type="number"
                min="0"
                name="budget"
                value={form.budget}
                onChange={updateField}
              />
            </label>

            <label>
              Needed by
              <input
                type="time"
                name="deadline"
                value={form.deadline}
                onChange={updateField}
              />
            </label>
          </div>

          <div className="workflowFooter">
            <div>
              <strong>Current request</strong>
              <span>
                {form.meals} meals · ${form.budget} ·{" "}
                {form.deadline}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
            >
              Find Nearby Offers →
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="workflowCard">
          <div className="workflowHeading">
            <span className="eyebrow">STEP 2</span>
            <h2>Review Restaurant Offers</h2>
            <p>
              Click an available restaurant to add or remove
              its demo offer.
            </p>
          </div>

          <div className="selectionSummary">
            <div>
              <span>Selected</span>
              <strong>{selectedOffers.length}</strong>
            </div>

            <div>
              <span>Meals secured</span>
              <strong>
                {selectedMeals} / {form.meals}
              </strong>
            </div>

            <div>
              <span>Current cost</span>
              <strong>${selectedCost}</strong>
            </div>

            <div>
              <span>Remaining budget</span>
              <strong>${remainingBudget}</strong>
            </div>
          </div>

          <div className="offerList">
            {offers.map((offer) => {
              const selected =
                selectedOffers.includes(offer.id);

              const late = offer.status === "late";

              return (
                <button
                  type="button"
                  key={offer.id}
                  className={[
                    "offerSelectCard",
                    selected ? "offerSelected" : "",
                    late ? "offerLate" : "",
                  ].join(" ")}
                  onClick={() => toggleOffer(offer)}
                >
                  <div className="offerCheck">
                    {late
                      ? "!"
                      : selected
                        ? "✓"
                        : "+"}
                  </div>

                  <div className="offerInformation">
                    <strong>{offer.name}</strong>

                    <span className="offerAddress">
                      {offer.address}
                    </span>

                    <span>
                      {offer.meals} demo meals · $
                      {offer.cost} · Ready {offer.ready}
                    </span>
                  </div>

                  <div className="offerStatus">
                    {selected && (
                      <span className="selectedBadge">
                        Selected
                      </span>
                    )}

                    {!selected && !late && (
                      <span className="availableBadge">
                        Available
                      </span>
                    )}

                    {late && (
                      <span className="lateBadge">
                        Too late
                      </span>
                    )}

                    {!late && (
                      <small>
                        {selected
                          ? "Click to remove"
                          : "Click to select"}
                      </small>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedOffers.length > 0 && (
            <div
              className={
                shortfall === 0
                  ? "coverageBox coverageComplete"
                  : "coverageBox"
              }
            >
              <div>{shortfall === 0 ? "✓" : "!"}</div>

              <p>
                <strong>
                  {shortfall === 0
                    ? "Meal requirement covered"
                    : `${shortfall} meals still needed`}
                </strong>

                <span>
                  {shortfall === 0
                    ? "Your current selections cover the request."
                    : "Select another available offer to improve coverage."}
                </span>
              </p>
            </div>
          )}

          <div className="demoNotice">
            <strong>Demo information</strong>
            <span>
              Restaurant names and addresses are real.
              Participation, meal availability, price, and
              readiness are simulated for the Relify demo.
            </span>
          </div>

          <div className="workflowFooter">
            <button
              type="button"
              className="secondaryWorkflowButton"
              onClick={() => setStep(1)}
            >
              ← Back
            </button>

            <button
              type="button"
              disabled={selectedOffers.length === 0}
              onClick={() => setStep(3)}
            >
              Review Recommendation →
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="workflowCard">
          <div className="workflowHeading">
            <span className="eyebrow">STEP 3</span>
            <h2>Coordinator Recommendation</h2>
            <p>
              Review the proposed combination before approval.
            </p>
          </div>

          <div className="recommendationLarge">
            <div className="recommendationSpark">
              ✦
            </div>

            <div>
              <span className="eyebrow">
                PROPOSED PLAN
              </span>

              <h3>
                {selectedRestaurants
                  .map((offer) => offer.name)
                  .join(" + ")}
              </h3>

              <p>
                Your selections provide{" "}
                <strong>{selectedMeals}</strong> meals for a
                combined demo cost of{" "}
                <strong>${selectedCost}</strong>.
              </p>

              <div className="recommendationStats">
                <div>
                  <strong>
                    {selectedMeals} / {form.meals}
                  </strong>
                  <span>Meals covered</span>
                </div>

                <div>
                  <strong>${selectedCost}</strong>
                  <span>Total cost</span>
                </div>

                <div>
                  <strong>${remainingBudget}</strong>
                  <span>Budget remaining</span>
                </div>
              </div>

              <div className="reasonPills">
                {remainingBudget >= 0 && (
                  <span>✓ Within budget</span>
                )}

                {shortfall === 0 ? (
                  <span>✓ Full meal coverage</span>
                ) : (
                  <span className="warningPill">
                    ! {shortfall} meals uncovered
                  </span>
                )}

                <span>✓ Ready before deadline</span>
              </div>
            </div>
          </div>

          <div className="workflowFooter">
            <button
              type="button"
              className="secondaryWorkflowButton"
              onClick={() => setStep(2)}
            >
              ← Change Selection
            </button>

            <button
              type="button"
              onClick={() => setStep(4)}
            >
              Review & Approve →
            </button>
          </div>
        </section>
      )}

      {step === 4 && (
        <section className="workflowCard">
          <div className="approvalState">
            <div className="approvalIcon">
              {approved ? "✓" : "→"}
            </div>

            <span className="eyebrow">STEP 4</span>

            <h2>
              {approved
                ? "Relief Plan Approved"
                : "Plan Ready for Approval"}
            </h2>

            <p>
              {approved
                ? "The plan is ready for coordinator follow-up."
                : "Review the final plan before confirming it."}
            </p>

            <div className="approvalSummary">
              <div>
                <span>Restaurants</span>
                <strong>
                  {selectedRestaurants.length}
                </strong>
              </div>

              <div>
                <span>Meals</span>
                <strong>{selectedMeals}</strong>
              </div>

              <div>
                <span>Cost</span>
                <strong>${selectedCost}</strong>
              </div>

              <div>
                <span>Deadline</span>
                <strong>{form.deadline}</strong>
              </div>
            </div>

            {!approved ? (
              <button
                type="button"
                className="approveButton"
                onClick={approvePlan}
              >
                ✓ Approve Relief Plan
              </button>
            ) : (
              <button
                type="button"
                className="approveButton"
                onClick={() => setPage("dashboard")}
              >
                Return to Dashboard →
              </button>
            )}

            {!approved && (
              <button
                type="button"
                className="approvalBack"
                onClick={() => setStep(3)}
              >
                ← Back to recommendation
              </button>
            )}
          </div>
        </section>
      )}
    </main>
  );
}

export default NewRequest;