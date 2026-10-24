import { useState } from "react";
import "./App.css";

const mockOffers = [
  {
    id: 1,
    name: "Sunrise Kitchen",
    meals: 80,
    cost: 640,
    ready: "4:00 PM",
    status: "recommended",
  },
  {
    id: 2,
    name: "Maple Bistro",
    meals: 120,
    cost: 960,
    ready: "5:00 PM",
    status: "recommended",
  },
  {
    id: 3,
    name: "Garden Plate",
    meals: 60,
    cost: 600,
    ready: "7:00 PM",
    status: "late",
  },
];

function App() {
  const [meals, setMeals] = useState("200");
  const [budget, setBudget] = useState("2000");
  const [deadline, setDeadline] = useState("18:00");

  const [showResults, setShowResults] = useState(false);
  const [approved, setApproved] = useState(false);

  function handleFindMeals() {
    setApproved(false);
    setShowResults(true);

    setTimeout(() => {
      document
        .getElementById("results")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  function scrollToRequest() {
    document
      .getElementById("request")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="app">

      {/* NAVIGATION */}
      <header className="navbar">
        <div className="navInner">

          <button className="brand" onClick={() => window.scrollTo(0, 0)}>
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
              Relify helps disaster relief coordinators source meals
              from local restaurants and quickly identify feasible
              options based on quantity, cost, and readiness.
            </p>

            <button className="primaryButton" onClick={scrollToRequest}>
              Create meal request
              <span>→</span>
            </button>

          </div>


          {/* SMALL EXPLANATION PANEL */}
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
                Enter the food requirements for the shelter or
                relief location you are coordinating.
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
                Relify will compare available offers against
                these requirements.
              </p>

              <button className="primaryButton" onClick={handleFindMeals}>
                Find meal options
                <span>→</span>
              </button>

            </div>

          </div>

        </div>

      </section>


      {/* RESULTS */}
      {showResults && (

        <section className="resultsSection" id="results">

          <div className="sectionContainer">

            <div className="resultsHeading">

              <div>
                <p className="smallLabel">RESTAURANT OFFERS</p>

                <h2>Recommended meal plan</h2>

                <p>
                  Based on the current meal requirement,
                  budget, deadline, and reported restaurant availability.
                </p>
              </div>


              <div className="coverage">

                <strong>200 / 200</strong>

                <span>Meals covered</span>

              </div>

            </div>


            {/* OFFERS */}
            <div className="offersGrid">

              {mockOffers.map((offer) => (

                <article
                  className={`offerCard ${
                    offer.status === "late" ? "offerLate" : ""
                  }`}
                  key={offer.id}
                >

                  <div className="offerHeader">

                    <div>
                      <p className="restaurantType">
                        RESTAURANT
                      </p>

                      <h3>{offer.name}</h3>
                    </div>


                    {offer.status === "recommended" ? (

                      <span className="recommendedTag">
                        Recommended
                      </span>

                    ) : (

                      <span className="lateTag">
                        Too late
                      </span>

                    )}

                  </div>


                  <div className="offerStats">

                    <div>
                      <span>Meals</span>
                      <strong>{offer.meals}</strong>
                    </div>

                    <div>
                      <span>Cost</span>
                      <strong>${offer.cost}</strong>
                    </div>

                    <div>
                      <span>Ready by</span>
                      <strong>{offer.ready}</strong>
                    </div>

                  </div>


                  <div className="offerFooter">

                    {offer.status === "recommended" ? (
                      <>
                        <span className="greenDot"></span>
                        Reported available
                      </>
                    ) : (
                      <>Misses the requested deadline</>
                    )}

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
                    Sunrise Kitchen + Maple Bistro
                  </h3>

                  <p>
                    These two reported offers together cover all
                    200 requested meals before the 6:00 PM deadline
                    and remain within the $2,000 budget.
                  </p>

                  <p className="verificationNote">
                    Restaurant availability and fulfillment should
                    be confirmed by the coordinator before purchase.
                  </p>

                </div>

              </div>


              <div className="recommendationRight">

                <div className="recommendationStats">

                  <div>
                    <span>Meals covered</span>
                    <strong>200</strong>
                  </div>

                  <div>
                    <span>Total cost</span>
                    <strong>$1,600</strong>
                  </div>

                  <div>
                    <span>Remaining budget</span>
                    <strong className="positive">$400</strong>
                  </div>

                </div>


                <button
                  className={approved ? "approvedButton" : "approveButton"}
                  onClick={() => setApproved(true)}
                >
                  {approved ? "✓ Plan approved" : "Approve plan →"}
                </button>

              </div>

            </div>


            {approved && (

              <div className="successBanner">

                <div className="successIcon">
                  ✓
                </div>

                <div>
                  <strong>Plan approved</strong>

                  <p>
                    The recommendation has been marked for
                    coordinator follow-up and restaurant confirmation.
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

            <h2>
              A simpler path from food need to food plan.
            </h2>

          </div>


          <div className="stepsGrid">

            <article>

              <span className="stepNumber">
                01
              </span>

              <h3>Define the need</h3>

              <p>
                The coordinator enters meal quantity,
                available budget, and required delivery time.
              </p>

            </article>


            <article>

              <span className="stepNumber">
                02
              </span>

              <h3>Collect offers</h3>

              <p>
                Participating restaurants report available
                meals, pricing, and preparation time.
              </p>

            </article>


            <article>

              <span className="stepNumber">
                03
              </span>

              <h3>Review the match</h3>

              <p>
                Relify structures the offers and helps the
                coordinator identify a feasible purchasing plan.
              </p>

            </article>

          </div>

        </div>

      </section>


      {/* FOOTER */}
      <footer>

        <div className="footerInner">

          <div className="footerBrand">

            <span className="footerMark">
              R
            </span>

            <strong>
              Relify
            </strong>

          </div>

          <p>
            AI-assisted emergency food coordination.
          </p>

        </div>

      </footer>

    </div>
  );
}

export default App;