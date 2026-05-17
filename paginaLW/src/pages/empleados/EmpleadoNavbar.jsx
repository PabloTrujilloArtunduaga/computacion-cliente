  // =====================================================
  // EMPLEADO NAVBAR ELEGANTE
  // src/components/empleado/EmpleadoNavbar.jsx
  // =====================================================

  import {
    Link,
    useNavigate,
    useLocation
  } from "react-router-dom";

  import "../../styles/navbarEmpleado.css";

  export default function EmpleadoNavbar() {

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

    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

      localStorage.removeItem("token");

      localStorage.removeItem("user");

      navigate("/login");
    };

    // =====================================================
    // ACTIVE LINK
    // =====================================================

    const isActive = path =>
      location.pathname === path;

    // =====================================================
    // JSX
    // =====================================================

    return (

      <header className="emp-navbar">

        <div className="emp-navbar-container">

          {/* ========================================= */}
          {/* LOGO */}
          {/* ========================================= */}

          <div
            className="emp-logo"
            onClick={() => navigate("/")}
          >

            <div className="emp-logo-icon">

              <i className="material-icons">
                storefront
              </i>

            </div>

            <div>

              <h4 className="emp-logo-title">

                <span className="logo-estanco">
                  Estanco
                </span>

                {" "}

                <span className="logo-malacopa">
                  MalaCopa
                </span>

              </h4>

            </div>

          </div>

          {/* ========================================= */}
          {/* MENU */}
          {/* ========================================= */}


          {/* ========================================= */}
          {/* USER */}
          {/* ========================================= */}

          <div className="emp-right-section">

            {/* USER CARD */}

            <div className="emp-user-card">

              <div className="emp-avatar">

                {
                  (
                    user?.nombre ||
                    "E"
                  )
                    .charAt(0)
                    .toUpperCase()
                }

              </div>

              <div>

                <div className="emp-user-name">

                  {
                    user?.nombre ||
                    "Empleado"
                  }

                </div>

                <div className="emp-user-role">
                  Empleado activo
                </div>

              </div>

            </div>

            {/* LOGOUT */}

            <button
              onClick={handleLogout}
              className="emp-logout-btn"
            >

              <i className="material-icons">
                logout
              </i>

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

  function NavItem({
    to,
    label,
    icon,
    active
  }) {

    return (

      <li>

        <Link
          to={to}
          className={`
            emp-nav-link
            ${active ? "active" : ""}
          `}
        >

          <i className="material-icons">
            {icon}
          </i>

          {label}

        </Link>

      </li>
    );
  }