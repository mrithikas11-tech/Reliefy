const activities = [
  {
    status: "success",
    text: "Sunrise Kitchen submitted an offer",
    time: "10:24 AM",
  },
  {
    status: "info",
    text: "Maple Bistro updated availability",
    time: "10:18 AM",
  },
  {
    status: "danger",
    text: "Garden Plate marked too late",
    time: "9:45 AM",
  },
];

function ActivityFeed() {
  return (
    <section className="activityCard">
      <div className="cardHeading">
        <div>
          <span className="eyebrow">LIVE UPDATES</span>
          <h3>Recent Activity</h3>
        </div>

        <button>View all</button>
      </div>

      <div className="activityFeed">
        {activities.map((activity) => (
          <div className="activityFeedRow" key={activity.text}>
            <span
              className={`activityStatus ${activity.status}`}
            ></span>

            <span className="activityFeedText">
              {activity.text}
            </span>

            <time>{activity.time}</time>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ActivityFeed;