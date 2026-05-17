import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

export default function ClienteNavbar() {

  const navigate = useNavigate();
  const location = useLocation();

  let user = null;

  try {

    const storedUser =
      localStorage.getItem("user");

    if (
      storedUser &&
      storedUser !== "undefined"
    ) {
      user = JSON.parse(storedUser);
    }

  } catch (error) {

    console.error(
      "Error parsing user:",
      error
    );

  }

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("rol");

    navigate("/login");

  };

  const isActive = (path) =>
    location.pathname === path;

  return (

    <header style={headerStyle}>

      <div style={containerStyle}>

        {/* =========================================
            LOGO
        ========================================= */}

        <div
          onClick={() => navigate("/")}
          style={logoContainerStyle}
        >

          <div style={logoIconStyle}>
            🍷
          </div>

          <div>

            <h1 style={logoTextStyle}>
              MalaCopa
            </h1>

            <span style={logoSubTextStyle}>
              Cliente
            </span>

          </div>

        </div>

        {/* =========================================
            MENU
        ========================================= */}

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

        {/* =========================================
            USER
        ========================================= */}

        <div style={actionsStyle}>

          <div style={userCardStyle}>

            <div style={avatarStyle}>
              {
                user?.nombre
                  ?.charAt(0)
                  ?.toUpperCase() || "C"
              }
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >

              <span style={userNameStyle}>
                {user?.nombre || "Cliente"}
              </span>

              <span style={userRoleStyle}>
                Cliente Premium
              </span>

            </div>

          </div>

          <button
            onClick={handleLogout}
            style={logoutButtonStyle}
          >

            Salir

          </button>

        </div>

      </div>

    </header>

  );

}

/* =========================================
   NAV ITEM
========================================= */

function NavItem({
  to,
  label,
  active,
}) {

  return (

    <li>

      <Link
        to={to}
        style={{
          ...linkStyle,
          ...(active
            ? activeLinkStyle
            : {}),
        }}
      >

        {label}

      </Link>

    </li>

  );

}

/* =========================================
   STYLES
========================================= */

const headerStyle = {

  width: "100%",

  position: "sticky",
  top: 0,

  zIndex: 999,

  background:
    "linear-gradient(90deg,#000,#111,#1a1a1a)",

  borderBottom:
    "1px solid rgba(212,175,55,0.12)",

  boxShadow:
    "0 4px 18px rgba(0,0,0,0.28)",

};

const containerStyle = {

  width: "100%",
  maxWidth: "1400px",

  margin: "0 auto",

  minHeight: "76px",

  padding: "0 30px",

  display: "flex",

  alignItems: "center",
  justifyContent: "space-between",

  gap: "24px",

  boxSizing: "border-box",

};

const logoContainerStyle = {

  display: "flex",

  alignItems: "center",

  gap: "14px",

  cursor: "pointer",

};

const logoIconStyle = {

  width: "48px",
  height: "48px",

  borderRadius: "14px",

  background:
    "linear-gradient(135deg,#d4af37,#f4d76a)",

  display: "flex",

  alignItems: "center",
  justifyContent: "center",

  fontSize: "1.2rem",

  boxShadow:
    "0 4px 14px rgba(212,175,55,0.28)",

};

const logoTextStyle = {

  margin: 0,

  color: "#d4af37",

  fontSize: "1.7rem",

  fontWeight: 800,

  fontFamily:
    "'Playfair Display', serif",

  lineHeight: 1,

};

const logoSubTextStyle = {

  color:
    "rgba(255,255,255,0.65)",

  fontSize: "0.75rem",

  letterSpacing: "1px",

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

  color:
    "rgba(255,255,255,0.78)",

  fontWeight: 700,

  fontSize: "0.95rem",

  padding: "10px 18px",

  borderRadius: "12px",

  transition:
    "all 0.25s ease",

};

const activeLinkStyle = {

  color: "#111",

  background:
    "linear-gradient(135deg,#d4af37,#f4d76a)",

  boxShadow:
    "0 6px 16px rgba(212,175,55,0.24)",

};

const actionsStyle = {

  display: "flex",

  alignItems: "center",

  gap: "14px",

};

const userCardStyle = {

  display: "flex",

  alignItems: "center",

  gap: "10px",

  padding: "8px 14px",

  borderRadius: "14px",

  background:
    "rgba(255,255,255,0.04)",

  border:
    "1px solid rgba(255,255,255,0.06)",

};

const avatarStyle = {

  width: "40px",
  height: "40px",

  borderRadius: "50%",

  background:
    "linear-gradient(135deg,#d4af37,#f4d76a)",

  color: "#111",

  display: "flex",

  alignItems: "center",
  justifyContent: "center",

  fontWeight: 800,

};

const userNameStyle = {

  color: "#fff",

  fontWeight: 700,

  fontSize: "0.9rem",

};

const userRoleStyle = {

  color:
    "rgba(255,255,255,0.6)",

  fontSize: "0.72rem",

};

const logoutButtonStyle = {

  border: "none",

  background:
    "rgba(212,175,55,0.12)",

  color: "#f4d76a",

  padding: "10px 16px",

  borderRadius: "12px",

  cursor: "pointer",

  fontWeight: 700,

  fontSize: "0.9rem",

  border:
    "1px solid rgba(212,175,55,0.18)",

  transition:
    "all 0.25s ease",

};