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

  return (

    <header className="cn-header">

      <div className="cn-container">

        {/* =========================================
            LOGO
        ========================================= */}

        <div
          className="cn-logo"
          onClick={() => navigate("/")}
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
              </span>
            </div>

          </div>

          <button
            onClick={handleLogout}
            className="cn-logout-btn"
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
      >
        {label}
      </Link>
    </li>
  );

}
