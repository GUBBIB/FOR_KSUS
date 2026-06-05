function Header({ page, setPage }) {
  const menus = [
    { id: "home", label: "홈" },
    { id: "bus", label: "공대버스" },
    { id: "classroom", label: "빈 강의실" },
    { id: "map", label: "공대맵" },
    { id: "community", label: "커뮤니티" },
  ];

  return (
    <header className="header">
      <div className="top-menu">
        {menus.map((menu) => (
          <button
            key={menu.id}
            className={page === menu.id ? "top-active" : ""}
            onClick={() => setPage(menu.id)}
          >
            {menu.label}
          </button>
        ))}
      </div>

      <div className="header-icons">
        <button>🔔</button>
        <button>👤</button>
      </div>
    </header>
  );
}

export default Header;