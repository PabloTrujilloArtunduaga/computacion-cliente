import { Link, useNavigate, useLocation } from "react-router-dom";

export default function ClienteNavbar() {
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
    localStorage.removeItem("rol");

    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>

        {/* ───── LOGO ───── */}
        <div
          onClick={() => navigate("/")}
          style={logoContainerStyle}
        >
          <div style={logoIconStyle}>🍷</div>

          <div>
            <h1 style={logoTextStyle}>MalaCopa</h1>
            <span style={logoSubTextStyle}>
              Cliente
            </span>
          </div>
        </div>

        {/* ───── MENÚ ───── */}
        <nav style={navStyle}>
          <ul style={menuStyle}>

            <NavItem
              to="/"
              label="Inicio"
              active={isActive("/")}
            />

            <NavItem
              to="/productos"
              label="Productos"
              active={isActive("/productos")}
            />

            <NavItem
              to="/cliente"
              label="Mis Compras"
              active={isActive("/cliente")}
            />

          </ul>
        </nav>

        {/* ───── USER ACTIONS ───── */}
        <div style={actionsStyle}>

          <div style={userCardStyle}>
            <div style={avatarStyle}>
              {user?.nombre?.charAt(0)?.toUpperCase() || "C"}
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={userNameStyle}>
                {user?.nombre || "Cliente"}
              </span>

              <span style={userRoleStyle}>
                Cliente
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={logoutButtonStyle}
          >
            Cerrar sesión
          </button>

        </div>

      </div>
    </header>
  );
}

/* ───────────────────────────────────────────── */
/* COMPONENTE LINK */
/* ───────────────────────────────────────────── */

function NavItem({ to, label, active }) {
  return (
    <li>
      <Link
        to={to}
        style={{
          ...linkStyle,
          ...(active ? activeLinkStyle : {}),
        }}
      >
        {label}
      </Link>
    </li>
  );
}

/* ───────────────────────────────────────────── */
/* ESTILOS */
/* ───────────────────────────────────────────── */

const headerStyle = {
  width: "100%",
  position: "sticky",
  top: 0,
  zIndex: 1000,
  background: "rgba(13, 17, 23, 0.95)",
  backdropFilter: "blur(12px)",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
};

const containerStyle = {
  width: "100%",
  height: "78px",
  padding: "0 36px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "25px",
  boxSizing: "border-box",
};

const logoContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  cursor: "pointer",
  userSelect: "none",
};

const logoIconStyle = {
  width: "46px",
  height: "46px",
  borderRadius: "14px",
  background: "linear-gradient(135deg, #facc15, #f59e0b)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.3rem",
  boxShadow: "0 4px 14px rgba(250, 204, 21, 0.35)",
};

const logoTextStyle = {
  margin: 0,
  color: "#fff",
  fontSize: "1.35rem",
  fontWeight: 800,
  lineHeight: 1,
  letterSpacing: "0.5px",
};

const logoSubTextStyle = {
  color: "#9ca3af",
  fontSize: "0.78rem",
  fontWeight: 500,
};

const navStyle = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
};

const menuStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  listStyle: "none",
  margin: 0,
  padding: 0,
};

const linkStyle = {
  textDecoration: "none",
  color: "#9ca3af",
  fontWeight: 600,
  fontSize: "0.95rem",
  padding: "11px 18px",
  borderRadius: "12px",
  transition: "all 0.25s ease",
};

const activeLinkStyle = {
  color: "#fff",
  background: "rgba(250, 204, 21, 0.14)",
  border: "1px solid rgba(250, 204, 21, 0.25)",
  boxShadow: "0 4px 12px rgba(250, 204, 21, 0.12)",
};

const actionsStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const userCardStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.06)",
  padding: "8px 14px",
  borderRadius: "14px",
};

const avatarStyle = {
  width: "38px",
  height: "38px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  fontSize: "0.95rem",
};

const userNameStyle = {
  color: "#fff",
  fontWeight: 700,
  fontSize: "0.9rem",
};

const userRoleStyle = {
  color: "#9ca3af",
  fontSize: "0.72rem",
};

const logoutButtonStyle = {
  border: "none",
  background: "linear-gradient(135deg, #ef4444, #dc2626)",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: "0.9rem",
  transition: "all 0.25s ease",
  boxShadow: "0 4px 12px rgba(239,68,68,0.25)",
};