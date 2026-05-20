// =====================================================
// CLIENTE NAVBAR PREMIUM
// RESPONSIVE • MODERNO • CONSISTENTE
// =====================================================

import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import "../../styles/ClienteNavbar.css";

export default function ClienteNavbar() {

  const navigate  = useNavigate();
  const location  = useLocation();

  /* =========================================
     USUARIO
  ========================================= */

  let user = null;

  try {

    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);

    }

  } catch (error) {
    console.error("Error parsing user:", error);
  }

  /* =========================================
     HANDLERS
  ========================================= */

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    localStorage.removeItem("rol");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  /* =========================================
     RENDER
  ========================================= */
  // =====================================================
  // ACTIVE LINK
  // =====================================================

  const isActive = (path) =>
    location.pathname === path;

  // =====================================================
  // JSX
  // =====================================================

  return (

    <header className="cn-header">

      <div className="cn-container">

        {/* =========================================
            LOGO
        ========================================= */}

        <div
          className="cn-logo"
          onClick={() => navigate("/")}
          style={logoContainerStyle}
          onMouseEnter={(e) => {

            e.currentTarget.style.transform =
              "scale(1.02)";

          }}
          onMouseLeave={(e) => {

            e.currentTarget.style.transform =
              "scale(1)";

          }}
        >

          <div className="cn-logo-icon">
            🍷
          </div>

          <div>
            <h1 className="cn-logo-text">
              MalaCopa
            </h1>
            <span className="cn-logo-sub">
              Cliente

            <h1 style={logoTextStyle}>

              <span style={logoWhiteStyle}>
                Estanco
              </span>

              {" "}

              <span style={logoGoldStyle}>
                MalaCopa
              </span>

            </h1>

            <span style={logoSubTextStyle}>
              Panel del Cliente
            </span>
          </div>

        </div>

        {/* =========================================
            MENÚ
        ========================================= */}

        <nav className="cn-nav">

          <ul className="cn-menu">

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
            USUARIO + LOGOUT
            USER SECTION
        ========================================= */}

        <div className="cn-actions">

          <div className="cn-user-card">

            <div className="cn-avatar">
              {user?.nombre?.charAt(0)?.toUpperCase() || "C"}
            </div>

            <div className="cn-user-info">
              <span className="cn-user-name">
                {user?.nombre || "Cliente"}
              </span>
              <span className="cn-user-role">
                Cliente Premium
          {/* USER CARD */}

          <div style={userCardStyle}>

            <div style={avatarStyle}>

              {
                (
                  user?.nombre ||
                  "C"
                )
                  .charAt(0)
                  .toUpperCase()
              }

            </div>

            <div style={userInfoStyle}>

              <span style={userNameStyle}>

                {
                  user?.nombre ||
                  "Cliente"
                }

              </span>

              <span style={userRoleStyle}>
                Cliente activo
              </span>
            </div>

          </div>

          {/* LOGOUT */}

          <button
            onClick={handleLogout}
            className="cn-logout-btn"
          >
            style={logoutButtonStyle}
            onMouseEnter={(e) => {

              e.currentTarget.style.transform =
                "translateY(-2px)";

              e.currentTarget.style.boxShadow =
                "0 12px 28px rgba(212,175,55,0.35)";

            }}
            onMouseLeave={(e) => {

              e.currentTarget.style.transform =
                "translateY(0px)";

              e.currentTarget.style.boxShadow =
                "0 8px 22px rgba(212,175,55,0.24)";

            }}
          >

            <span style={logoutIconStyle}>
              ↩
            </span>

            Salir
          </button>

        </div>

      </div>

    </header>

  );

}

// =====================================================
// NAV ITEM
// =====================================================

function NavItem({ to, label, active }) {

  return (
    <li>
      <Link
        to={to}
        className={
          active
            ? "cn-link cn-link--active"
            : "cn-link"
        }

    <li style={navItemStyle}>

      <Link
        to={to}
        style={{
          ...linkStyle,
          ...(active
            ? activeLinkStyle
            : {}),
        }}
        onMouseEnter={(e) => {

          if (!active) {

            e.currentTarget.style.color =
              "#d4af37";

            e.currentTarget.style.background =
              "rgba(212,175,55,0.08)";

          }

        }}
        onMouseLeave={(e) => {

          if (!active) {

            e.currentTarget.style.color =
              "rgba(255,255,255,0.82)";

            e.currentTarget.style.background =
              "transparent";

          }

        }}
      >
        {label}

        {
          active && (

            <span
              style={activeLineStyle}
            />

          )
        }

      </Link>
    </li>
  );

}

/* =====================================================
   HEADER

const headerStyle = {

  position: "sticky",

  top: 0,

  zIndex: 9999,

  width: "100%",

  backdropFilter: "blur(14px)",

  background:
    "linear-gradient(135deg, rgba(5,5,5,0.98), rgba(16,16,16,0.98), rgba(20,20,20,0.98))",

  borderBottom:
    "1px solid rgba(212,175,55,0.14)",

  boxShadow:
    "0 4px 24px rgba(0,0,0,0.45)",

};

/* =====================================================
   CONTAINER

const containerStyle = {

  width: "100%",

  maxWidth: "1450px",

  margin: "0 auto",

  minHeight: "84px",

  padding: "14px 28px",

  display: "flex",

  alignItems: "center",

  justifyContent: "space-between",

  gap: "24px",

  flexWrap: "wrap",

  boxSizing: "border-box",

};

/* =====================================================
   LOGO

const logoContainerStyle = {

  display: "flex",

  alignItems: "center",

  gap: "14px",

  cursor: "pointer",

  flexShrink: 0,

  userSelect: "none",

  transition: "0.25s ease",

};

const logoIconStyle = {

  width: "56px",

  height: "56px",

  minWidth: "56px",

  borderRadius: "18px",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  background:
    "linear-gradient(135deg,#d4af37,#b8860b)",

  boxShadow:
    "0 10px 28px rgba(212,175,55,0.28)",

  fontSize: "1.35rem",

};

const logoTextStyle = {

  margin: 0,

  lineHeight: 1.1,

  fontSize: "1.3rem",

  fontWeight: 800,

  letterSpacing: "1.2px",

  textTransform: "uppercase",

  fontFamily:
    "'Playfair Display', serif",

};

const logoWhiteStyle = {

  color: "#ffffff",

};

const logoGoldStyle = {

  color: "#d4af37",

};

const logoSubTextStyle = {

  marginTop: "4px",

  display: "block",

  color:
    "rgba(255,255,255,0.65)",

  fontSize: "0.76rem",

  letterSpacing: "1px",

};

/* =====================================================
   NAV

const navStyle = {

  flex: 1,

  display: "flex",

  justifyContent: "center",

  minWidth: 0,

};

const menuStyle = {

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  flexWrap: "wrap",

  gap: "12px",

  listStyle: "none",

  margin: 0,

  padding: 0,

};

const navItemStyle = {

  listStyle: "none",

};

const linkStyle = {

  position: "relative",

  textDecoration: "none",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  whiteSpace: "nowrap",

  padding: "12px 20px",

  borderRadius: "14px",

  color:
    "rgba(255,255,255,0.82)",

  fontWeight: 700,

  fontSize: "0.96rem",

  letterSpacing: "0.4px",

  transition:
    "all 0.25s ease",

  background: "transparent",

};

const activeLinkStyle = {

  color: "#d4af37",

  background: "transparent",

  border: "none",

  boxShadow: "none",

};

const activeLineStyle = {

  position: "absolute",

  bottom: "4px",

  left: "50%",

  transform: "translateX(-50%)",

  width: "60%",

  height: "2px",

  borderRadius: "999px",

  background: "#d4af37",

};

/* =====================================================
   ACTIONS

const actionsStyle = {

  display: "flex",

  alignItems: "center",

  gap: "14px",

  flexShrink: 0,

  flexWrap: "wrap",

  justifyContent: "center",

};

/* =====================================================
   USER CARD

const userCardStyle = {

  display: "flex",

  alignItems: "center",

  gap: "12px",

  padding: "10px 14px",

  borderRadius: "18px",

  background:
    "rgba(255,255,255,0.04)",

  border:
    "1px solid rgba(212,175,55,0.12)",

  backdropFilter: "blur(10px)",

};

const avatarStyle = {

  width: "46px",

  height: "46px",

  minWidth: "46px",

  borderRadius: "50%",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  background:
    "linear-gradient(135deg,#d4af37,#b8860b)",

  color: "#ffffff",

  fontWeight: 800,

  fontSize: "1rem",

  boxShadow:
    "0 8px 18px rgba(212,175,55,0.24)",

};

const userInfoStyle = {

  display: "flex",

  flexDirection: "column",

};

const userNameStyle = {

  color: "#ffffff",

  fontWeight: 700,

  fontSize: "0.95rem",

  lineHeight: 1.2,

};

const userRoleStyle = {

  marginTop: "2px",

  color:
    "rgba(255,255,255,0.62)",

  fontSize: "0.76rem",

  lineHeight: 1.2,

};

/* =====================================================
   LOGOUT

const logoutButtonStyle = {

  height: "50px",

  padding: "0 20px",

  border: "none",

  borderRadius: "14px",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  gap: "8px",

  cursor: "pointer",

  background:
    "linear-gradient(135deg,#d4af37,#b8860b)",

  color: "#ffffff",

  fontWeight: 700,

  fontSize: "0.92rem",

  letterSpacing: "0.3px",

  transition: "0.25s ease",

  boxShadow:
    "0 8px 22px rgba(212,175,55,0.24)",

};

const logoutIconStyle = {

  fontSize: "1rem",

};
