
import React, { useEffect } from "react";
import M from "materialize-css";

export default function ParallaxHero() {
  useEffect(() => {
    M.Parallax.init(document.querySelectorAll(".parallax"));
    M.Sidenav.init(document.querySelectorAll(".sidenav"));
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <nav className="nav-wrapper" style={{ backgroundColor: "#6b4f4f" }}>
        <div className="container">
          <a href="#!" className="brand-logo" style={{ fontFamily: "serif", fontWeight: "600" }}>
            Estanco MalaCopa
          </a>

          <a href="#!" data-target="mobile-menu" className="sidenav-trigger">
            <i className="material-icons">menu</i>
          </a>

          {/* Desktop Menu */}
          <ul className="right hide-on-med-and-down" style={{ fontWeight: "600" }}>
            <li><a href="#productos">Productos</a></li>
            <li><a href="#nosotros">Nosotros</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      <ul className="sidenav" id="mobile-menu">
        <li><a href="#productos">Productos</a></li>
        <li><a href="#nosotros">Nosotros</a></li>
        <li><a href="#contacto">Contacto</a></li>
      </ul>

      {/* HERO PARALLAX */}
      <div className="parallax-container">
        <div className="parallax">
          <img src="/images/BeerStore.jpg" alt="Beer Store" />
        </div>

        {/* Text Overlay */}
        <div className="center" style={{ marginTop: "160px" }}>
          <h2
            className="white-text"
            style={{
              fontFamily: "serif",
              fontWeight: "700",
              textShadow: "0px 3px 15px rgba(0,0,0,0.7)"
            }}
          >
            Estanco MalaCopa
          </h2>

          <p
            className="white-text flow-text"
            style={{
              maxWidth: "650px",
              margin: "0 auto",
              marginTop: "10px",
              textShadow: "0px 2px 8px rgba(0,0,0,0.6)",
              fontSize: "1.4rem"
            }}
          >
            El lugar perfecto para relajarte, disfrutar y compartir buenos momentos.
          </p>

          <a
            href="#productos"
            className="btn waves-effect"
            style={{
              backgroundColor: "#d4af37",
              fontWeight: "700",
              borderRadius: "8px",
              marginTop: "30px"
            }}
          >
            Ver Productos
          </a>
        </div>
      </div>
    </>
  );
}