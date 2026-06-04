function Sidebar({ page, setPage }) {
  const menus = [
    { id: "home", label: "홈", icon: "🏠" },
    { id: "bus", label: "공대버스", icon: "🚌" },
    { id: "classroom", label: "빈 강의실", icon: "🏫" },
    { id: "map", label: "공대맵", icon: "🗺️" },
    { id: "community", label: "커뮤니티", icon: "💬" },
  ];

  return (
    <aside className="sidebar">
      <h1 className="logo">FOR KSUS</h1>
      <p className="logo-sub">공대생 통합 편의 서비스</p>

      <nav>
        {menus.map((menu) => (
          <button
            key={menu.id}
            className={page === menu.id ? "active" : ""}
            onClick={() => setPage(menu.id)}
          >
            <span>{menu.icon}</span>
            {menu.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;