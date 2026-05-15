// ======================================================
// ADMIN NAVBAR CORREGIDO
// ======================================================

import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import "../../styles/AdminNavbar.css";

export default function AdminNavbar() {

  const navigate = useNavigate();
  const location = useLocation();

  let user = null;

  try {

    const storedUser = localStorage.getItem("user");

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

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

  };

  // ======================================================
  // ACTIVE LINK
  // ======================================================

  const isActive = (path) => {

    return (
      location.pathname === path ||
      location.pathname.startsWith(path + "/")
    );

  };

  // ======================================================
  // RENDER
  // ======================================================

  return (

    <header className="admin-navbar-wrapper">

      <nav className="admin-navbar">

        <div className="admin-nav-container">

          {/* =========================================
              LOGO
          ========================================= */}

          <div
            className="admin-logo"
            onClick={() => navigate("/")}
          >
            <span className="admin-logo-main">
              MalaCopa
            </span>

            <span className="admin-logo-badge">
              ADMIN
            </span>
          </div>

          {/* =========================================
              MENU
          ========================================= */}

          <ul className="admin-menu">

            <NavItem
              to="/admin"
              label="Panel"
              icon="dashboard"
              active={
                location.pathname === "/admin"
              }
            />

            <NavItem
              to="/admin/usuarios"
              label="Usuarios y empleados"
              icon="groups"
              active={isActive("/admin/usuarios")}
            />

            <NavItem
              to="/admin/productos"
              label="Productos y categorias"
              icon="inventory_2"
              active={isActive("/admin/productos")}
            />

            <NavItem
              to="/admin/facturas"
              label="Facturas"
              icon="receipt_long"
              active={isActive("/admin/facturas")}
            />

          </ul>

          {/* =========================================
              USER + LOGOUT
          ========================================= */}

          <div className="admin-right-section">

            {/* USER */}

            <div className="admin-user-box">

              <div className="admin-avatar">

                {
                  user?.nombre
                    ? user.nombre.charAt(0).toUpperCase()
                    : "A"
                }

              </div>

              <div className="admin-user-info">

                <span className="admin-user-name">

                  {user?.nombre || "Admin"}

                </span>

              </div>

            </div>

            {/* LOGOUT */}

            <button
              type="button"
              className="admin-logout-btn"
              onClick={handleLogout}
            >

              <i className="material-icons">
                logout
              </i>

            </button>

          </div>

        </div>

      </nav>

    </header>

  );

}

// ======================================================
// NAV ITEM
// ======================================================

function NavItem({
  to,
  label,
  icon,
  active,
}) {

  return (

    <li>

      <Link
        to={to}
        className={
          active
            ? "admin-link active-link"
            : "admin-link"
        }
      >

        <i className="material-icons">
          {icon}
        </i>

        <span>
          {label}
        </span>

      </Link>

    </li>

  );

}