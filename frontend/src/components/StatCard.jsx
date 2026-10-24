function StatCard({
  title,
  value,
  subtitle,
  icon,
  tone = "blue",
}) {
  return (
    <article className="statCard">
      <div className={`statIcon stat-${tone}`}>
        {icon}
      </div>

      <div className="statContent">
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{subtitle}</small>
      </div>
    </article>
  );
}

export default StatCard;