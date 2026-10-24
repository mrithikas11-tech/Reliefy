import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import NewRequest from "./pages/NewRequest";
import LiveMap from "./pages/LiveMap";
import RestaurantPortal from "./components/RestaurantPortal";

import "./App.css";

function App() {
  const [page, setPage] = useState("dashboard");

  function renderPage() {
    switch (page) {
      case "request":
        return <NewRequest setPage={setPage} />;

      case "restaurants":
        return <RestaurantPortal />;

      case "map":
        return <LiveMap setPage={setPage} />;

      case "activity":
        return (
          <main className="standardPage">
            <header className="pageHeader">
              <div>
                <span className="eyebrow">
                  LIVE ACTIVITY
                </span>

                <h1>Relief Activity</h1>

                <p>
                  Track restaurant offers, updates,
                  cancellations, and coordination changes.
                </p>
              </div>
            </header>

            <div className="fullActivityCard">
              <div className="fullActivityRow">
                <span className="activityDot success"></span>

                <div>
                  <strong>
                    Peanuts Deluxe Cafe submitted an offer
                  </strong>

                  <p>
                    80 demo meals available by 4:00 PM.
                  </p>
                </div>

                <time>10:24 AM</time>
              </div>

              <div className="fullActivityRow">
                <span className="activityDot info"></span>

                <div>
                  <strong>
                    Home Eat updated availability
                  </strong>

                  <p>
                    120 demo meals available by 5:00 PM.
                  </p>
                </div>

                <time>10:18 AM</time>
              </div>

              <div className="fullActivityRow">
                <span className="activityDot danger"></span>

                <div>
                  <strong>
                    Sammy G's offer missed the deadline
                  </strong>

                  <p>
                    Offer readiness is after the 6:00 PM deadline.
                  </p>
                </div>

                <time>9:45 AM</time>
              </div>
            </div>
          </main>
        );

      case "dashboard":
      default:
        return <Dashboard setPage={setPage} />;
    }
  }

  return (
    <div className="relifyApp">
      <Sidebar
        page={page}
        setPage={setPage}
      />

      <div className="appContent">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;