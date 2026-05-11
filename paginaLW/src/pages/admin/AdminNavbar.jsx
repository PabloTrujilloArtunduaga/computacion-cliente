import { Link, useNavigate, useLocation } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  let user = null;

  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Error parsing user:", error);
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>

        {/* 🔥 LOGO */}
        <div onClick={() => navigate("/")} style={logoStyle}>
          MalaCopa
        </div>

        {/* 🔗 MENÚ */}
        <nav>
          <ul style={menuStyle}>

            <NavItem to="/admin" label="Dashboard" active={isActive("/admin")} />
            <NavItem to="/admin/usuarios" label="Usuarios" active={isActive("/admin/usuarios")} />
            <NavItem to="/admin/productos" label="Productos" active={isActive("/admin/productos")} />
            <NavItem to="/admin/facturas" label="Facturas" active={isActive("/admin/facturas")} />

            {/* 👤 USER */}
            <li style={userStyle}>
              👤 {user?.nombre || "Admin"}
            </li>

            {/* 🚪 LOGOUT */}
            <li>
              <span onClick={handleLogout} style={logoutStyle}>
                Cerrar sesión
              </span>
            </li>

          </ul>
        </nav>

      </div>
    </header>
  );
}

/* 🔹 COMPONENTE LINK */
function NavItem({ to, label, active }) {
  return (
    <li>
      <Link
        to={to}
        style={{
          ...linkStyle,
          borderBottom: active ? "2px solid #facc15" : "2px solid transparent",
          color: active ? "#fff" : "#9ca3af",
        }}
      >
        {label}
      </Link>
    </li>
  );
}

/* 🎨 ESTILOS */

const headerStyle = {
  width: "100%",
  background: "#0d1117",
  borderBottom: "1px solid #1f2937",
  position: "sticky",
  top: 0,
  zIndex: 1000,
};

const containerStyle = {
  width: "100%",
  padding: "0 40px",
  height: "70px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const logoStyle = {
  fontSize: "1.9rem",
  fontWeight: "bold",
  color: "#facc15",
  cursor: "pointer",
  letterSpacing: "1px",
};

const menuStyle = {
  display: "flex",
  gap: "25px",
  listStyle: "none",
  margin: 0,
  alignItems: "center",
};

const linkStyle = {
  textDecoration: "none",
  fontWeight: "500",
  paddingBottom: "5px",
  transition: "all 0.2s ease",
};

const userStyle = {
  color: "#9ca3af",
  fontWeight: "500",
  borderLeft: "1px solid #374151",
  paddingLeft: "15px",
};

const logoutStyle = {
  cursor: "pointer",
  color: "#f87171",
  fontWeight: "600",
};