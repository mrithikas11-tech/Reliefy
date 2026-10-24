import ReliefMap from "../components/ReliefMap";

function LiveMap({ setPage }) {
  return (
    <main className="standardPage">
      <header className="pageHeader">
        <div>
          <span className="eyebrow">
            LIVE RELIEF NETWORK
          </span>

          <h1>SJSU Restaurant Coverage</h1>

          <p>
            View the relief site and nearby participating
            restaurant offers.
          </p>
        </div>

        <button
          type="button"
          className="newRequestButton"
          onClick={() => setPage("request")}
        >
          + New Request
        </button>
      </header>

      <div className="mapFilters">
        <button type="button" className="filterActive">
          All
        </button>

        <button type="button">Selected</button>
        <button type="button">Available</button>
        <button type="button">Too Late</button>
      </div>

      <ReliefMap large />

      <div className="mapRecommendation">
        <div>
          <span className="eyebrow">
            CURRENT PLAN
          </span>

          <h2>
            Peanuts Deluxe Cafe + Home Eat
          </h2>

          <p>
            Demo availability: 200 potential meals · $1,600
            combined cost.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setPage("request")}
        >
          Review Offers →
        </button>
      </div>
    </main>
  );
}

export default LiveMap;