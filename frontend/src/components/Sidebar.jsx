const navItems = [
  { id: "dashboard", icon: "⌂", label: "Dashboard" },
  { id: "request", icon: "+", label: "New Request" },
  { id: "restaurants", icon: "♨", label: "Restaurants" },
  { id: "map", icon: "⌖", label: "Live Map" },
  { id: "activity", icon: "≡", label: "Activity" },
];

function Sidebar({ page, setPage }) {
  return (
    <aside className="sidebar">
      <button
        type="button"
        className="sidebarBrand"
        onClick={() => setPage("dashboard")}
      >
        <span className="sidebarLogo">R</span>

        <span className="brandText">
          <strong>Relify</strong>
          <small>Food Coordination</small>
        </span>
      </button>

      <nav className="sidebarNav">
        {navItems.map((item) => (
          <button
            type="button"
            key={item.id}
            className={
              page === item.id
                ? "sidebarItem sidebarItemActive"
                : "sidebarItem"
            }
            onClick={() => setPage(item.id)}
          >
            <span className="sidebarItemIcon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebarBottom">
        <div className="reliefIcon">+</div>

        <div>
          <strong>Disaster Relief</strong>
          <span>Food Coordination</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;