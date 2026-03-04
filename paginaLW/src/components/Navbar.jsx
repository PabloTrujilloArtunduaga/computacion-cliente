import React, { useEffect } from "react";
import M from "materialize-css";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const location = useLocation();

  useEffect(() => {
    M.Sidenav.init(document.querySelectorAll(".sidenav"));
  }, []);

  return (
    <>
      <nav className="black nav-elegante">
        <div className="nav-wrapper container">

          {/* LOGO */}
          <Link to="/" className="brand-logo logo-premium">
            <span className="logo-estanco">Estanco</span>
            <span className="logo-malacopa">MalaCopa</span>
          </Link>

          {/* BOTON MOBILE */}
          <a href="#" data-target="mobile-demo" className="sidenav-trigger right">
            <i className="material-icons white-text">menu</i>
          </a>

          {/* LINKS DESKTOP */}
          <ul className="right hide-on-med-and-down">
            <li><Link to="/" className="nav-link">Inicio</Link></li>
            <li><Link to="/productos" className="nav-link">Productos</Link></li>
            <li><Link to="/nosotros" className="nav-link">Nosotros</Link></li>
            <li><Link to="/contacto" className="nav-link">Contacto</Link></li>

            {location.pathname === "/productos" && (
              <li><Link to="/carrito" className="nav-link">Carrito 🛒</Link></li>
            )}
          </ul>
        </div>
      </nav>

      {/* SIDENAV MOBILE */}
      <ul className="sidenav sidenav-elegante" id="mobile-demo">
        <li><Link to="/" className="nav-link-mobile">Inicio</Link></li>
        <li><Link to="/productos" className="nav-link-mobile">Productos</Link></li>
        <li><Link to="/nosotros" className="nav-link-mobile">Nosotros</Link></li>
        <li><Link to="/contacto" className="nav-link-mobile">Contacto</Link></li>

        {location.pathname === "/productos" && (
          <li><Link to="/carrito" className="nav-link-mobile">Carrito 🛒</Link></li>
        )}
      </ul>
    </>
  );
}
