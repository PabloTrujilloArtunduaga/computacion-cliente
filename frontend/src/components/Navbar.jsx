import React, {
  useEffect,
  useState,
  useRef,
} from "react";

import M from "materialize-css";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "../styles/Navbar.css";

export default function Navbar() {

  /*
    ==========================================
    ROUTER
    ==========================================
  */

  const location =
    useLocation();

  const navigate =
    useNavigate();

  /*
    ==========================================
    REFS
    ==========================================
  */

  const sidenavRef =
    useRef(null);

  const dropdownRef =
    useRef(null);

  /*
    ==========================================
    ESTADO USUARIO
    ==========================================
  */

  const [usuario, setUsuario] =
    useState(null);

  /*
    ==========================================
    CARGAR USUARIO
    ==========================================
  */

  useEffect(() => {

    const cargarUsuario = () => {

      try {

        const userString =
          localStorage.getItem(
            "user"
          );

        if (!userString) {

          setUsuario(null);

          return;
        }

        const user =
          JSON.parse(userString);

        setUsuario(user);

      } catch (error) {

        console.error(
          "Error cargando usuario:",
          error
        );

        setUsuario(null);
      }
    };

    /*
      CARGA INICIAL
    */

    cargarUsuario();

    /*
      ACTUALIZAR NAVBAR
      AUTOMÁTICAMENTE
    */

    window.addEventListener(
      "storage",
      cargarUsuario
    );

    return () => {

      window.removeEventListener(
        "storage",
        cargarUsuario
      );
    };

  }, []);

  /*
    ==========================================
    INICIALIZAR MATERIALIZE
    ==========================================
  */

  useEffect(() => {

    /*
      ======================================
      SIDENAV
      ======================================
    */

    let sidenavInstance =
      null;

    if (
      sidenavRef.current &&
      M?.Sidenav
    ) {

      sidenavInstance =
        M.Sidenav.init(
          sidenavRef.current
        );
    }

    /*
      ======================================
      DROPDOWN
      ======================================
    */

    let dropdownInstance =
      null;

    if (
      dropdownRef.current &&
      M?.Dropdown
    ) {

      dropdownInstance =
        M.Dropdown.init(
          dropdownRef.current,
          {
            constrainWidth: false,
            coverTrigger: false,
            alignment: "right",
            closeOnClick: true,
          }
        );
    }

    /*
      ======================================
      CLEANUP
      ======================================
    */

    return () => {

      if (
        sidenavInstance
      ) {
        sidenavInstance.destroy();
      }

      if (
        dropdownInstance
      ) {
        dropdownInstance.destroy();
      }
    };

  }, [usuario]);

  /*
    ==========================================
    REDIRECCIÓN SEGÚN ROL
    ==========================================
  */

  const irPanel = () => {

    if (
      !usuario?.rol
    ) return;

    if (
      usuario.rol === "admin"
    ) {

      navigate("/admin");

    } else if (
      usuario.rol === "empleado"
    ) {

      navigate(
        "/dashboard-empleado"
      );

    } else {

      navigate("/cliente");
    }
  };

  /*
    ==========================================
    CERRAR SESIÓN
    ==========================================
  */

  const cerrarSesion = () => {

    /*
      LIMPIAR STORAGE
    */

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "rol"
    );

    localStorage.removeItem(
      "user"
    );

    /*
      LIMPIAR ESTADO
    */

    setUsuario(null);

    /*
      NAVEGACIÓN SPA
    */

    navigate("/");
  };

  return (
    <>

      {/* ==========================================
          NAVBAR
      ========================================== */}

      <nav className="black nav-elegante">

        <div className="nav-wrapper container">

          {/* ==========================================
              LOGO
          ========================================== */}

          <Link
            to="/"
            className="
              brand-logo
              logo-premium
            "
          >

            <span className="logo-estanco">
              Estanco
            </span>

            <span className="logo-malacopa">
              MalaCopa
            </span>

          </Link>

          {/* ==========================================
              BOTÓN MOBILE
          ========================================== */}

          <a
            href="#!"
            data-target="mobile-demo"
            className="
              sidenav-trigger
              right
            "
          >

            <i className="material-icons white-text">
              menu
            </i>

          </a>

          {/* ==========================================
              MENÚ DESKTOP
          ========================================== */}

          <ul className="right hide-on-med-and-down">

            <li>
              <Link
                to="/"
                className="nav-link"
              >
                Inicio
              </Link>
            </li>

            <li>
              <Link
                to="/productos"
                className="nav-link"
              >
                Productos
              </Link>
            </li>

            <li>
              <Link
                to="/nosotros"
                className="nav-link"
              >
                Nosotros
              </Link>
            </li>

            <li>
              <Link
                to="/contacto"
                className="nav-link"
              >
                Contacto
              </Link>
            </li>

            {/* ==========================================
                CARRITO
            ========================================== */}

            {
              location.pathname ===
                "/productos" && (

                <li>

                  <Link
                    to="/carrito"
                    className="nav-link"
                  >
                    Carrito 🛒
                  </Link>

                </li>
              )
            }

            {/* ==========================================
                USUARIO NO LOGEADO
            ========================================== */}

            {!usuario ? (

              <>

                <li
                  style={{
                    marginLeft:
                      "15px",
                  }}
                >

                  <Link
                    to="/login"
                    className="
                      btn
                      amber
                      darken-3
                      black-text
                    "
                  >
                    Iniciar Sesión
                  </Link>

                </li>

                <li
                  style={{
                    marginLeft:
                      "10px",
                  }}
                >

                  <Link
                    to="/register"
                    className="btn"
                  >
                    Registrarse
                  </Link>

                </li>

              </>

            ) : (

              /* ==========================================
                  USUARIO LOGEADO
              ========================================== */

              <li
                style={{
                  marginLeft:
                    "20px",
                }}
              >

                <a
                  href="#!"
                  ref={dropdownRef}
                  className="
                    dropdown-trigger
                    usuario-dropdown
                  "
                  data-target="dropdown-user"
                >

                  <span
                    style={{
                      fontWeight:
                        "700",
                    }}
                  >
                    {usuario.nombre}
                  </span>

                  <i
                    className="
                      material-icons
                      right
                    "
                  >
                    arrow_drop_down
                  </i>

                </a>

              </li>
            )}

          </ul>

        </div>

      </nav>

      {/* ==========================================
          DROPDOWN USUARIO
      ========================================== */}

      {
        usuario && (

          <ul
            id="dropdown-user"
            className="
              dropdown-content
              dropdown-usuario
            "
          >

            <li>

              <button
                type="button"
                onClick={irPanel}
                style={{
                  width: "100%",
                  border: "none",
                  background:
                    "transparent",
                  padding:
                    "14px 18px",
                  cursor: "pointer",
                  textAlign:
                    "left",
                  fontWeight:
                    "600",
                }}
              >

                {
                  usuario?.rol ===
                  "admin"
                    ? "Panel Admin"
                    : usuario?.rol ===
                      "empleado"
                    ? "Panel Empleado"
                    : "Mi Perfil"
                }

              </button>

            </li>

            <li className="divider"></li>

            <li>

              <button
                type="button"
                onClick={
                  cerrarSesion
                }
                style={{
                  width: "100%",
                  border: "none",
                  background:
                    "transparent",
                  padding:
                    "14px 18px",
                  cursor: "pointer",
                  textAlign:
                    "left",
                  fontWeight:
                    "600",
                  color:
                    "#d32f2f",
                }}
              >
                Cerrar Sesión
              </button>

            </li>

          </ul>
        )
      }

      {/* ==========================================
          SIDENAV MOBILE
      ========================================== */}

      <ul
        id="mobile-demo"
        ref={sidenavRef}
        className="
          sidenav
          sidenav-elegante
        "
      >

        <li>
          <Link to="/">
            Inicio
          </Link>
        </li>

        <li>
          <Link to="/productos">
            Productos
          </Link>
        </li>

        <li>
          <Link to="/nosotros">
            Nosotros
          </Link>
        </li>

        <li>
          <Link to="/contacto">
            Contacto
          </Link>
        </li>

        {
          location.pathname ===
            "/productos" && (

            <li>

              <Link to="/carrito">
                Carrito 🛒
              </Link>

            </li>
          )
        }

        <li className="divider"></li>

        {/* ==========================================
            MOBILE NO LOGEADO
        ========================================== */}

        {!usuario ? (

          <>

            <li>
              <Link to="/login">
                Iniciar Sesión
              </Link>
            </li>

            <li>
              <Link to="/register">
                Registrarse
              </Link>
            </li>

          </>

        ) : (

          /* ==========================================
              MOBILE LOGEADO
          ========================================== */

          <>

            <li
              style={{
                padding:
                  "18px 32px",
                fontWeight:
                  "700",
                color:
                  "#d4af37",
                fontSize:
                  "1.1rem",
              }}
            >
              {usuario.nombre}
            </li>

            <li className="divider"></li>

            <li>

              <button
                type="button"
                onClick={irPanel}
                style={{
                  width: "100%",
                  padding:
                    "15px 32px",
                  border: "none",
                  background:
                    "transparent",
                  textAlign:
                    "left",
                  cursor:
                    "pointer",
                  fontWeight:
                    "600",
                }}
              >

                {
                  usuario?.rol ===
                  "admin"
                    ? "Panel Admin"
                    : usuario?.rol ===
                      "empleado"
                    ? "Panel Empleado"
                    : "Mi Perfil"
                }

              </button>

            </li>

            <li>

              <button
                type="button"
                onClick={
                  cerrarSesion
                }
                style={{
                  width: "100%",
                  padding:
                    "15px 32px",
                  border: "none",
                  background:
                    "transparent",
                  textAlign:
                    "left",
                  cursor:
                    "pointer",
                  color: "#d32f2f",
                  fontWeight:
                    "600",
                }}
              >
                Cerrar Sesión
              </button>

            </li>

          </>
        )}

      </ul>

    </>
  );
}