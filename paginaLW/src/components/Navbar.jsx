import React, { useEffect, useState } from "react";
import M from "materialize-css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const sidenavElems = document.querySelectorAll(".sidenav");
    M.Sidenav.init(sidenavElems);

    const usuarioGuardado = localStorage.getItem("usuario");

    if (usuarioGuardado) {
      try {
        setUsuarioLogueado(JSON.parse(usuarioGuardado));
      } catch (error) {
        console.error("Error leyendo usuario desde localStorage:", error);
        localStorage.removeItem("usuario");
      }
    }
  }, []);

  const cerrarMenuMobile = () => {
    const sidenavElem = document.querySelector("#mobile-demo");

    if (sidenavElem) {
      const instancia = M.Sidenav.getInstance(sidenavElem);

      if (instancia) {
        instancia.close();
      }
    }
  };

  const irPerfil = () => {
    setMenuAbierto(false);
    cerrarMenuMobile();

    if (usuarioLogueado?.rol === "admin") {
      navigate("/admin");
    } else if (usuarioLogueado?.rol === "empleado") {
      navigate("/empleado");
    } else {
      navigate("/cliente");
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    localStorage.removeItem("usuario_id");

    setUsuarioLogueado(null);
    setMenuAbierto(false);
    cerrarMenuMobile();

    navigate("/");
  };

  const nombreUsuario =
    usuarioLogueado?.nombre || usuarioLogueado?.usuario || "Usuario";

  return (
    <>
      <nav className="black nav-elegante">
        <div className="nav-wrapper nav-contenido">
          {/* LOGO */}
          <Link to="/" className="brand-logo logo-premium">
            <span className="logo-estanco">Estanco</span>
            <span className="logo-malacopa">MalaCopa</span>
          </Link>

          {/* BOTÓN MOBILE */}
          <a href="#!" data-target="mobile-demo" className="sidenav-trigger right">
            <i className="material-icons white-text">menu</i>
          </a>

          {/* LINKS DESKTOP */}
          <ul className="nav-menu-desktop right hide-on-med-and-down">
            <li>
              <Link to="/" className="nav-link">
                Inicio
              </Link>
            </li>

            <li>
              <Link to="/productos" className="nav-link">
                Productos
              </Link>
            </li>

            <li>
              <Link to="/nosotros" className="nav-link">
                Nosotros
              </Link>
            </li>

            <li>
              <Link to="/contacto" className="nav-link">
                Contacto
              </Link>
            </li>

            {(location.pathname === "/productos" ||
              location.pathname === "/carrito") && (
              <li>
                <Link to="/carrito" className="nav-link">
                  Carrito 🛒
                </Link>
              </li>
            )}

            {!usuarioLogueado ? (
              <>
                <li>
                  <Link to="/login" className="btn-navbar btn-login-navbar">
                    Iniciar Sesión
                  </Link>
                </li>

                <li>
                  <Link to="/register" className="btn-navbar btn-register-navbar">
                    Registrarse
                  </Link>
                </li>
              </>
            ) : (
              <li className="usuario-menu-navbar">
                <button
                  type="button"
                  className="usuario-boton-navbar"
                  onClick={() => setMenuAbierto(!menuAbierto)}
                >
                  Hola, {nombreUsuario} ▼
                </button>

                {menuAbierto && (
                  <div className="usuario-dropdown-navbar">
                    <button type="button" onClick={irPerfil}>
                      Mi Perfil
                    </button>

                    <button type="button" onClick={cerrarSesion}>
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </li>
            )}
          </ul>
        </div>
      </nav>

      {/* SIDENAV MOBILE */}
      <ul className="sidenav sidenav-elegante" id="mobile-demo">
        <li className="mobile-logo">
          <span className="logo-estanco">Estanco</span>
          <span className="logo-malacopa"> MalaCopa</span>
        </li>

        <li>
          <Link to="/" className="nav-link-mobile" onClick={cerrarMenuMobile}>
            <i className="material-icons left">home</i>
            Inicio
          </Link>
        </li>

        <li>
          <Link
            to="/productos"
            className="nav-link-mobile"
            onClick={cerrarMenuMobile}
          >
            <i className="material-icons left">local_bar</i>
            Productos
          </Link>
        </li>

        <li>
          <Link
            to="/nosotros"
            className="nav-link-mobile"
            onClick={cerrarMenuMobile}
          >
            <i className="material-icons left">groups</i>
            Nosotros
          </Link>
        </li>

        <li>
          <Link
            to="/contacto"
            className="nav-link-mobile"
            onClick={cerrarMenuMobile}
          >
            <i className="material-icons left">mail</i>
            Contacto
          </Link>
        </li>

        {(location.pathname === "/productos" ||
          location.pathname === "/carrito") && (
          <li>
            <Link
              to="/carrito"
              className="nav-link-mobile"
              onClick={cerrarMenuMobile}
            >
              <i className="material-icons left">shopping_cart</i>
              Carrito
            </Link>
          </li>
        )}

        <li className="divider"></li>

        {!usuarioLogueado ? (
          <>
            <li>
              <Link
                to="/login"
                className="nav-link-mobile"
                onClick={cerrarMenuMobile}
              >
                <i className="material-icons left">login</i>
                Iniciar Sesión
              </Link>
            </li>

            <li>
              <Link
                to="/register"
                className="nav-link-mobile"
                onClick={cerrarMenuMobile}
              >
                <i className="material-icons left">person_add</i>
                Registrarse
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <a href="#!" className="nav-link-mobile usuario-mobile">
                <i className="material-icons left">person</i>
                Hola, {nombreUsuario}
              </a>
            </li>

            <li>
              <a
                href="#!"
                className="nav-link-mobile"
                onClick={(e) => {
                  e.preventDefault();
                  irPerfil();
                }}
              >
                <i className="material-icons left">dashboard</i>
                Mi Perfil
              </a>
            </li>

            <li>
              <a
                href="#!"
                className="nav-link-mobile"
                onClick={(e) => {
                  e.preventDefault();
                  cerrarSesion();
                }}
              >
                <i className="material-icons left">logout</i>
                Cerrar sesión
              </a>
            </li>
          </>
        )}
      </ul>
    </>
  );
}