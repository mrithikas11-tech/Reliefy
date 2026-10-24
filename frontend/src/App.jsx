import { useState } from "react";
import "./App.css";
import { analyze } from "./services/api.js";
import RestaurantPortal from "./components/RestaurantPortal.jsx";

function App() {
  // Which experience is shown. Coordinator stays the default so the existing
  // experience is unchanged on load.
  const [view, setView] = useState("coordinator");
  const [meals, setMeals] = useState("200");
  const [budget, setBudget] = useState("2000");
  const [deadline, setDeadline] = useState("18:00");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await analyze({
        meals_needed: Number(meals),
        budget: Number(budget),
        deadline,
        restaurant_messages: [
          "Restaurant A offers 80 meals for $640, ready at 4 PM",
          "Restaurant B offers 120 meals for $960, ready at 5 PM",
          "Restaurant C offers 60 meals for $600, ready at 7 PM",
        ],
      });
      setResult(data);
    } catch (err) {
      setError(
        err.message || "Could not connect to the API. Is the backend running?"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <div
          className="logo"
          role="button"
          tabIndex={0}
          onClick={() => setView("coordinator")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setView("coordinator");
          }}
        >
          <div className="logoMark">R</div>
          <span>Reliefy</span>
        </div>

        <div className="navLinks">
          <a href="#how">How it works</a>
          <a
            href="#restaurants"
            onClick={(e) => {
              e.preventDefault();
              setView("restaurant");
            }}
          >
            For Restaurants
          </a>
          <button
            className="outlineButton"
            onClick={() => setView("coordinator")}
          >
            Coordinator
          </button>
        </div>
      </nav>

      {/* RESTAURANT PARTNER EXPERIENCE */}
      {view === "restaurant" && <RestaurantPortal />}

      {/* COORDINATOR EXPERIENCE (default, unchanged) */}
      {view === "coordinator" && (
      <>
      {/* HERO */}
      <main className="main">
        <section className="heroSection">
          <div className="badge">AI-powered disaster food coordination</div>

          <h1>
            Local food.
            <br />
            <span>Real impact.</span>
          </h1>

          <p>
            Reliefy helps disaster relief coordinators connect with local
            restaurants and turn available meals into actionable food plans.
          </p>

          <button
            className="primaryButton"
            onClick={() =>
              document
                .getElementById("request")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Create Meal Request →
          </button>
        </section>

        {/* REQUEST */}
        <section className="requestCard" id="request">
          <div className="cardHeader">
            <div>
              <p className="eyebrow">COORDINATOR PORTAL</p>
              <h2>Create a meal request</h2>
            </div>
            <span className="status">● Active</span>
          </div>

          <p className="description">
            Tell Reliefy what your shelter needs.
          </p>

          <form className="requestForm" onSubmit={handleSubmit}>
          <div className="formGrid">
            <label>
              Meals needed
              <input
                type="number"
                min="1"
                required
                value={meals}
                onChange={(e) => setMeals(e.target.value)}
              />
            </label>

            <label>
              Budget ($)
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </label>

            <label>
              Needed by
              <input
                type="time"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </label>
          </div>

          <button className="findButton" type="submit" disabled={loading}>
            {loading ? "Analyzing…" : "Find Meal Options →"}
          </button>
          </form>

          {error && <p className="errorMessage">{error}</p>}
        </section>
      </main>

      {/* RESULTS */}
      {result && (
        <section className="resultsSection" id="results">
          <div className="resultsCard">
            <div className="cardHeader">
              <div>
                <p className="eyebrow">AI RECOMMENDATION</p>
                <h2>Recommended coverage</h2>
              </div>
              <span className="resultStatus">
                {String(result.status).replace(/_/g, " ")}
              </span>
            </div>

            <div className="metrics">
              <div>
                <span>Meals covered</span>
                <strong>
                  {result.meals_covered} / {result.meals_needed}
                </strong>
              </div>
              <div>
                <span>Total cost</span>
                <strong>${Number(result.total_cost).toLocaleString()}</strong>
              </div>
              <div>
                <span>Shortfall</span>
                <strong>{result.shortfall} meals</strong>
              </div>
            </div>

            <h3>Selected offers</h3>
            <ul className="offerList">
              {result.selected_offers?.map((offer) => (
                <li key={offer.restaurant}>
                  <strong>{offer.restaurant}</strong> — {offer.meals} meals · $
                  {offer.total_cost} · ready {offer.ready_time}
                </li>
              ))}
            </ul>
            <p className="resultNote">{result.note}</p>
          </div>
        </section>
      )}
      </>
      )}

      {/* HOW IT WORKS */}
      <section className="howSection" id="how">
        <p className="eyebrow">HOW IT WORKS</p>
        <h2>From local kitchens to communities in need.</h2>

        <div className="steps">
          <div className="step">
            <span>01</span>
            <h3>Request</h3>
            <p>A coordinator enters the number of meals, budget and deadline.</p>
          </div>

          <div className="step">
            <span>02</span>
            <h3>Restaurants respond</h3>
            <p>Local restaurants submit what they can prepare and when.</p>
          </div>

          <div className="step">
            <span>03</span>
            <h3>AI matches</h3>
            <p>Reliefy analyzes the offers and recommends a feasible plan.</p>
          </div>
        </div>
      </section>

      <footer className="siteFooter">
        Prototype only · Simulated offers · Human verification required
      </footer>
    </div>
  );
}

export default App;
