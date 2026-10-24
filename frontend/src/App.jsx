import { useState } from "react";
import "./App.css";

function App() {
  const [meals, setMeals] = useState("200");
  const [budget, setBudget] = useState("2000");
  const [deadline, setDeadline] = useState("18:00");

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
          <a href="#restaurants">For Restaurants</a>
          <button className="outlineButton">Coordinator</button>
        </div>
      </nav>

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
            Relify helps disaster relief coordinators connect with local
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
            Tell Relify what your shelter needs.
          </p>

          <div className="formGrid">
            <label>
              Meals needed
              <input
                type="number"
                value={meals}
                onChange={(e) => setMeals(e.target.value)}
              />
            </label>

            <label>
              Budget ($)
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </label>

            <label>
              Needed by
              <input
                type="time"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </label>
          </div>

          <button className="findButton">
            Find Meal Options →
          </button>
        </section>
      </main>

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
            <p>Relify analyzes the offers and recommends a feasible plan.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;