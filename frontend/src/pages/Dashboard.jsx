import StatCard from "../components/StatCard";
import ReliefMap from "../components/ReliefMap";
import ReliefPlan from "../components/ReliefPlan";
import ActivityFeed from "../components/ActivityFeed";

function Dashboard({ setPage }) {
  return (
    <main className="dashboard">
      <header className="dashboardHeader">
        <div>
          <span className="eyebrow">
            COORDINATOR DASHBOARD
          </span>

          <h1>Relief Coordination Dashboard</h1>

<p>
  Monitor active meal requests, restaurant offers,
  and relief coverage in real time.
</p>
        </div>

        <div className="dashboardActions">
          <div className="urgentAlert">
            ⚠ 40 meals still needed
          </div>

          <button
            type="button"
            className="newRequestButton"
            onClick={() => setPage("request")}
          >
            + New Request
          </button>
        </div>
      </header>

      <section className="statsGrid">
        <StatCard
          title="Meals Needed"
          value="200"
          subtitle="Current request"
          icon="♨"
          tone="blue"
        />

        <StatCard
          title="Meals Secured"
          value="160"
          subtitle="80% covered"
          icon="✓"
          tone="green"
        />

        <StatCard
          title="Budget Used"
          value="$1,600"
          subtitle="$400 remaining"
          icon="$"
          tone="orange"
        />

        <StatCard
          title="Restaurants"
          value="2"
          subtitle="Currently selected"
          icon="⌂"
          tone="purple"
        />
      </section>

      <section className="dashboardBody">
        <div className="dashboardLeft">
          <ReliefMap />
          <ActivityFeed />
        </div>

        <ReliefPlan setPage={setPage} />
      </section>
    </main>
  );
}

export default Dashboard;