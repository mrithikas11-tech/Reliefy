function ReliefPlan({ setPage }) {
  return (
    <aside className="reliefPlan">
      <div className="planTop">
        <div>
          <span className="eyebrow">CURRENT REQUEST</span>
          <h2>Live Relief Plan</h2>
        </div>

        <span className="livePill">
          <span></span>
          Live
        </span>
      </div>

      <section className="planMetric">
        <div className="planMetricHeader">
          <span>Meals secured</span>
          <strong>160 / 200</strong>
        </div>

        <div className="progressBar">
          <div className="progressGreen"></div>
        </div>

        <p className="dangerText">
          40 meals still needed
        </p>
      </section>

      <section className="planMetric">
        <div className="planMetricHeader">
          <span>Budget used</span>
          <strong>$1,600 / $2,000</strong>
        </div>

        <div className="progressBar">
          <div className="progressBlue"></div>
        </div>

        <p>$400 remaining</p>
      </section>

      <div className="miniStats">
        <div>
          <strong>2</strong>
          <span>Selected</span>
        </div>

        <div>
          <strong>6:00 PM</strong>
          <span>Deadline</span>
        </div>

        <div>
          <strong>3</strong>
          <span>Offers</span>
        </div>
      </div>

      <section className="recommendation">
        <span>✦ Latest Recommendation</span>

        <h3>
          Sunrise Kitchen + Maple Bistro
        </h3>

        <ul>
          <li>Within the $2,000 budget</li>
          <li>Both ready before deadline</li>
          <li>Best current combination</li>
        </ul>
      </section>

      <button
        className="planPrimaryButton"
        onClick={() => setPage("request")}
      >
        Review Plan →
      </button>

      <button className="planSecondaryButton">
        ↻ Recalculate
      </button>
    </aside>
  );
}

export default ReliefPlan;