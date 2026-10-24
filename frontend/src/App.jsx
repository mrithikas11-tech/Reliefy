import { useState } from "react";
import "./App.css";

function App() {
  const [meals, setMeals] = useState("200");
  const [budget, setBudget] = useState("2000");
  const [deadline, setDeadline] = useState("18:00");
  const [showResults, setShowResults] = useState(false);
  const [approved, setApproved] = useState(false);

  const handleFindMeals = () => {
    setShowResults(true);
    setApproved(false);

    setTimeout(() => {
      document
        .getElementById("results")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          <div className="logoMark">R</div>
          <span>Relify</span>
        </div>

        <div className="navLinks">
          <a href="#how">How it works</a>
          <a href="#request">Coordinator</a>
          <button
            className="navButton"
            onClick={() =>
              document
                .getElementById("request")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Create Request
          </button>
        </div>
      </nav>

      {/* HERO */}
      <main className="hero">
        {/* LEFT SIDE */}
        <section className="heroContent">
          <div className="badge">
            AI-powered disaster food coordination
          </div>

          <h1>
            Local food.
            <span>Real impact.</span>
          </h1>

          <p className="heroDescription">
            Relify helps disaster relief coordinators connect with local
            restaurants and turn available meals into actionable food plans.
          </p>

          <button
            className="primaryButton"
            onClick={() =>
              document
                .getElementById("request")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Create Meal Request
            <span>→</span>
          </button>
        </section>

        {/* REQUEST CARD */}
        <section className="requestCard" id="request">
          <div className="requestHeader">
            <div className="requestTitle">
              <p className="eyebrow">COORDINATOR PORTAL</p>

              <h2>Create a meal request</h2>

              <p className="requestDescription">
                Tell Relify what your shelter needs.
              </p>
            </div>

            <div className="activeStatus">
              <span className="activeDot"></span>
              Active
            </div>
          </div>

          <div className="requestForm">
            <label>
              <span>Meals needed</span>
              <input
                type="number"
                min="1"
                value={meals}
                onChange={(e) => setMeals(e.target.value)}
              />
            </label>

            <label>
              <span>Budget ($)</span>
              <input
                type="number"
                min="0"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </label>

            <label>
              <span>Needed by</span>
              <input
                type="time"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </label>
          </div>

          <button className="findButton" onClick={handleFindMeals}>
            Find Meal Options
            <span>→</span>
          </button>
        </section>
      </main>

      {/* RESULTS */}
      {showResults && (
        <section className="resultsSection" id="results">
          <div className="resultsHeader">
            <div>
              <p className="eyebrow">RELIFY MATCH</p>

              <h2>Your recommended meal plan</h2>

              <p className="resultsDescription">
                Relify compared available restaurant offers against your
                meal count, budget, and deadline.
              </p>
            </div>

            <div className="coverageBadge">
              <strong>200 / 200</strong>
              <span>meals covered</span>
            </div>
          </div>

          {/* RESTAURANTS */}
          <div className="restaurantGrid">
            <article className="restaurantCard selectedCard">
              <div className="restaurantTop">
                <div>
                  <span className="restaurantLabel">RESTAURANT</span>
                  <h3>Sunrise Kitchen</h3>
                </div>

                <span className="recommendedBadge">
                  Recommended
                </span>
              </div>

              <div className="restaurantStats">
                <div>
                  <strong>80</strong>
                  <span>Meals</span>
                </div>

                <div>
                  <strong>$640</strong>
                  <span>Total cost</span>
                </div>

                <div>
                  <strong>4:00 PM</strong>
                  <span>Ready by</span>
                </div>
              </div>

              <div className="availability">
                <span className="smallDot"></span>
                Confirmed available
              </div>
            </article>

            <article className="restaurantCard selectedCard">
              <div className="restaurantTop">
                <div>
                  <span className="restaurantLabel">RESTAURANT</span>
                  <h3>Maple Bistro</h3>
                </div>

                <span className="recommendedBadge">
                  Recommended
                </span>
              </div>

              <div className="restaurantStats">
                <div>
                  <strong>120</strong>
                  <span>Meals</span>
                </div>

                <div>
                  <strong>$960</strong>
                  <span>Total cost</span>
                </div>

                <div>
                  <strong>5:00 PM</strong>
                  <span>Ready by</span>
                </div>
              </div>

              <div className="availability">
                <span className="smallDot"></span>
                Confirmed available
              </div>
            </article>

            <article className="restaurantCard lateCard">
              <div className="restaurantTop">
                <div>
                  <span className="restaurantLabel">RESTAURANT</span>
                  <h3>Garden Plate</h3>
                </div>

                <span className="lateBadge">
                  Too late
                </span>
              </div>

              <div className="restaurantStats">
                <div>
                  <strong>60</strong>
                  <span>Meals</span>
                </div>

                <div>
                  <strong>$600</strong>
                  <span>Total cost</span>
                </div>

                <div>
                  <strong>7:00 PM</strong>
                  <span>Ready by</span>
                </div>
              </div>

              <div className="lateReason">
                Misses your 6:00 PM deadline
              </div>
            </article>
          </div>

          {/* AI RECOMMENDATION */}
          <div className="aiPlan">
            <div className="aiPlanText">
              <div className="aiTitleRow">
                <div className="aiIcon">✦</div>

                <div>
                  <p className="eyebrow">AI RECOMMENDATION</p>
                  <h3>Sunrise Kitchen + Maple Bistro</h3>
                </div>
              </div>

              <p>
                Together, these restaurants cover all 200 requested meals
                before your 6:00 PM deadline while staying within budget.
              </p>
            </div>

            <div className="planSummary">
              <div className="summaryItem">
                <span>Meals</span>
                <strong>200</strong>
              </div>

              <div className="summaryItem">
                <span>Total cost</span>
                <strong>$1,600</strong>
              </div>

              <div className="summaryItem">
                <span>Under budget</span>
                <strong className="greenText">$400</strong>
              </div>

              <button
                className={approved ? "approvedButton" : "approveButton"}
                onClick={() => setApproved(true)}
              >
                {approved ? "✓ Plan Approved" : "Approve Plan →"}
              </button>
            </div>
          </div>

          {approved && (
            <div className="successMessage">
              <div className="successIcon">✓</div>

              <div>
                <strong>Meal plan approved.</strong>
                <p>
                  The selected restaurant offers are ready for coordinator
                  confirmation.
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="howSection" id="how">
        <p className="sectionLabel">HOW IT WORKS</p>

        <h2>From local kitchens to communities in need.</h2>

        <div className="steps">
          <article className="stepCard">
            <div className="stepNumber">01</div>

            <h3>Request</h3>

            <p>
              A coordinator enters the number of meals, available budget,
              and deadline.
            </p>
          </article>

          <article className="stepCard">
            <div className="stepNumber">02</div>

            <h3>Restaurants respond</h3>

            <p>
              Local restaurants share how many meals they can prepare,
              their price, and when they will be ready.
            </p>
          </article>

          <article className="stepCard">
            <div className="stepNumber">03</div>

            <h3>AI matches</h3>

            <p>
              Relify analyzes the offers and recommends a feasible meal
              plan for the coordinator.
            </p>
          </article>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footerLogo">
          <div className="footerMark">R</div>
          <strong>Relify</strong>
        </div>

        <p>Local food. Real impact.</p>
      </footer>
    </div>
  );
}

export default App;