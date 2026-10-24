import { useState } from "react";
import { analyzeMealRequest } from "./api";
import "./App.css";

function formatTime(time) {
  if (!time) return "—";

  const [hours, minutes] = time.split(":");
  const date = new Date();

  date.setHours(Number(hours), Number(minutes));

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function App() {
  const [meals, setMeals] = useState("200");
  const [budget, setBudget] = useState("2000");
  const [deadline, setDeadline] = useState("18:00");

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [approved, setApproved] = useState(false);

  function scrollToRequest() {
    document.getElementById("request")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  async function handleFindMeals() {
    setLoading(true);
    setError("");
    setApproved(false);

    try {
      const data = await analyzeMealRequest({
        meals,
        budget,
        deadline,
        restaurantMessages: [],
      });

      setResults(data);

      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    } catch (err) {
      console.error(err);

      setError(
        "Could not reach the recommendation service. Make sure the Relify backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  const remainingBudget = results
    ? Number(budget) - Number(results.total_cost)
    : 0;

  return (
    <div className="app">
      {/* NAVIGATION */}
      <header className="navbar">
        <div className="navInner">
          <button
            className="brand"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            <span className="brandMark">R</span>
            <span>Relify</span>
          </button>

          <nav className="navLinks">
            <a href="#how">How it works</a>
            <a href="#request">Coordinator</a>

            <button className="navCTA" onClick={scrollToRequest}>
              Create request
            </button>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="heroInner">
          <div className="heroContent">
            <div className="pill">
              AI-assisted emergency food coordination
            </div>

            <h1>
              Local food.
              <span>Real impact.</span>
            </h1>

            <p>
              Relify helps disaster relief coordinators source meals from
              local restaurants and quickly identify feasible options based
              on quantity, cost, and readiness.
            </p>

            <button className="primaryButton" onClick={scrollToRequest}>
              Create meal request
              <span>→</span>
            </button>
          </div>

          <div className="heroPanel">
            <p className="smallLabel">BUILT FOR RELIEF TEAMS</p>

            <h2>
              Make food procurement easier when time matters.
            </h2>

            <div className="miniSteps">
              <div>
                <span>01</span>
                <p>Enter shelter requirements</p>
              </div>

              <div>
                <span>02</span>
                <p>Compare restaurant offers</p>
              </div>

              <div>
                <span>03</span>
                <p>Review an AI-assisted plan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REQUEST */}
      <section className="requestSection" id="request">
        <div className="sectionContainer">
          <div className="sectionHeading">
            <div>
              <p className="smallLabel">COORDINATOR PORTAL</p>

              <h2>Create a meal request</h2>

              <p>
                Enter the food requirements for the shelter or relief
                location you are coordinating.
              </p>
            </div>

            <div className="statusBadge">
              <span></span>
              Active request
            </div>
          </div>

          <div className="requestCard">
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

            <div className="requestAction">
              <p>
                Relify will compare available offers against these
                requirements.
              </p>

              <button
                className="primaryButton"
                onClick={handleFindMeals}
                disabled={loading}
              >
                {loading ? "Analyzing offers..." : "Find meal options"}

                {!loading && <span>→</span>}
              </button>
            </div>

            {error && <div className="errorMessage">{error}</div>}
          </div>
        </div>
      </section>

      {/* RESULTS */}
      {results && (
        <section className="resultsSection" id="results">
          <div className="sectionContainer">
            <div className="resultsHeading">
              <div>
                <p className="smallLabel">RESTAURANT OFFERS</p>

                <h2>Recommended meal plan</h2>

                <p>
                  Based on the current meal requirement, budget, deadline,
                  and reported restaurant availability.
                </p>
              </div>

              <div className="coverage">
                <strong>
                  {results.meals_covered} / {results.meals_needed}
                </strong>

                <span>Meals covered</span>
              </div>
            </div>

            <div className="offersGrid">
              {results.selected_offers?.map((offer, index) => (
                <article className="offerCard" key={`selected-${index}`}>
                  <div className="offerHeader">
                    <div>
                      <p className="restaurantType">RESTAURANT</p>
                      <h3>{offer.restaurant}</h3>
                    </div>

                    <span className="recommendedTag">
                      Recommended
                    </span>
                  </div>

                  <div className="offerStats">
                    <div>
                      <span>Meals</span>
                      <strong>{offer.meals}</strong>
                    </div>

                    <div>
                      <span>Cost</span>
                      <strong>${offer.total_cost}</strong>
                    </div>

                    <div>
                      <span>Ready by</span>
                      <strong>{formatTime(offer.ready_time)}</strong>
                    </div>
                  </div>

                  <div className="offerFooter">
                    <span className="greenDot"></span>
                    Included in proposed plan
                  </div>
                </article>
              ))}

              {results.excluded_offers?.map((offer, index) => (
                <article
                  className="offerCard offerLate"
                  key={`excluded-${index}`}
                >
                  <div className="offerHeader">
                    <div>
                      <p className="restaurantType">RESTAURANT</p>
                      <h3>{offer.restaurant}</h3>
                    </div>

                    <span className="lateTag">Not selected</span>
                  </div>

                  <div className="offerStats">
                    <div>
                      <span>Meals</span>
                      <strong>{offer.meals}</strong>
                    </div>

                    <div>
                      <span>Cost</span>
                      <strong>${offer.total_cost}</strong>
                    </div>

                    <div>
                      <span>Ready by</span>
                      <strong>{formatTime(offer.ready_time)}</strong>
                    </div>
                  </div>

                  <div className="offerFooter">
                    Not included in the proposed plan
                  </div>
                </article>
              ))}
            </div>

            {/* AI RECOMMENDATION */}
            <div className="recommendationCard">
              <div className="recommendationContent">
                <div className="aiMark">✦</div>

                <div>
                  <p className="smallLabel">
                    AI-ASSISTED RECOMMENDATION
                  </p>

                  <h3>
                    {results.selected_offers
                      ?.map((offer) => offer.restaurant)
                      .join(" + ")}
                  </h3>

                  <p>
                    This proposed combination covers{" "}
                    <strong>{results.meals_covered}</strong> of{" "}
                    <strong>{results.meals_needed}</strong> requested meals
                    for a total cost of{" "}
                    <strong>${results.total_cost}</strong>.
                  </p>

                  <p className="verificationNote">{results.note}</p>
                </div>
              </div>

              <div className="recommendationRight">
                <div className="recommendationStats">
                  <div>
                    <span>Meals covered</span>
                    <strong>{results.meals_covered}</strong>
                  </div>

                  <div>
                    <span>Total cost</span>
                    <strong>${results.total_cost}</strong>
                  </div>

                  <div>
                    <span>Remaining budget</span>
                    <strong className="positive">
                      ${remainingBudget}
                    </strong>
                  </div>
                </div>

                <button
                  className={
                    approved ? "approvedButton" : "approveButton"
                  }
                  onClick={() => setApproved(true)}
                >
                  {approved ? "✓ Plan approved" : "Approve plan →"}
                </button>
              </div>
            </div>

            {results.shortfall > 0 && (
              <div className="shortfallWarning">
                <strong>
                  {results.shortfall} meals remain uncovered.
                </strong>

                <p>Additional restaurant capacity is required.</p>
              </div>
            )}

            {approved && (
              <div className="successBanner">
                <div className="successIcon">✓</div>

                <div>
                  <strong>Plan approved</strong>

                  <p>
                    The recommendation has been marked for coordinator
                    follow-up and restaurant confirmation.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="howSection" id="how">
        <div className="sectionContainer">
          <div className="howHeading">
            <p className="smallLabel">HOW IT WORKS</p>

            <h2>A simpler path from food need to food plan.</h2>
          </div>

          <div className="stepsGrid">
            <article>
              <span className="stepNumber">01</span>

              <h3>Define the need</h3>

              <p>
                The coordinator enters meal quantity, available budget,
                and required time.
              </p>
            </article>

            <article>
              <span className="stepNumber">02</span>

              <h3>Collect offers</h3>

              <p>
                Participating restaurants report available meals,
                pricing, and preparation time.
              </p>
            </article>

            <article>
              <span className="stepNumber">03</span>

              <h3>Review the match</h3>

              <p>
                Relify structures the offers and helps identify a
                feasible plan.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footerInner">
          <div className="footerBrand">
            <span className="footerMark">R</span>
            <strong>Relify</strong>
          </div>

          <p>AI-assisted emergency food coordination.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;