import React, {
  useEffect,
  useRef,
} from "react";

import M from "materialize-css";

export default function ParallaxHero() {
  /*
    =========================
    REFS
    =========================
  */

  const heroRef =
    useRef(null);

  /*
    =========================
    MATERIALIZE
    =========================
  */

  useEffect(() => {
    if (!heroRef.current) {
      return;
    }

    /*
      ELEMENTOS
    */

    const parallaxElems =
      heroRef.current.querySelectorAll(
        ".parallax"
      );

    const sidenavElems =
      heroRef.current.querySelectorAll(
        ".sidenav"
      );

    const waveElems =
      heroRef.current.querySelectorAll(
        ".waves-effect"
      );

    /*
      INSTANCIAS
    */

    let parallaxInstances =
      [];

    let sidenavInstances =
      [];

    /*
      PARALLAX SAFE
    */

    if (
      M?.Parallax &&
      typeof M.Parallax.init ===
        "function" &&
      parallaxElems.length > 0
    ) {
      const result =
        M.Parallax.init(
          parallaxElems
        );

      parallaxInstances =
        Array.isArray(result)
          ? result
          : [result];
    }

    /*
      SIDENAV SAFE
    */

    if (
      M?.Sidenav &&
      typeof M.Sidenav.init ===
        "function" &&
      sidenavElems.length > 0
    ) {
      const result =
        M.Sidenav.init(
          sidenavElems
        );

      sidenavInstances =
        Array.isArray(result)
          ? result
          : [result];
    }

    /*
      WAVES SAFE
    */

    if (
      M?.Waves &&
      typeof M.Waves.init ===
        "function" &&
      waveElems.length > 0
    ) {
      M.Waves.init(
        waveElems
      );
    }

    /*
      CLEANUP
    */

    return () => {
      parallaxInstances.forEach(
        (instance) => {
          if (
            instance &&
            typeof instance.destroy ===
              "function"
          ) {
            instance.destroy();
          }
        }
      );

      sidenavInstances.forEach(
        (instance) => {
          if (
            instance &&
            typeof instance.destroy ===
              "function"
          ) {
            instance.destroy();
          }
        }
      );
    };
  }, []);

  return (
    <div ref={heroRef}>
      {/* NAVBAR */}
      <nav
        className="nav-wrapper"
        style={{
          backgroundColor:
            "#6b4f4f",
        }}
      >
        <div className="container">
          {/* LOGO */}
          <a
            href="#!"
            className="brand-logo"
            style={{
              fontFamily:
                "serif",

              fontWeight: 600,
            }}
          >
            Estanco MalaCopa
          </a>

          {/* MOBILE BUTTON */}
          <a
            href="#!"
            data-target="mobile-menu"
            className="
              sidenav-trigger
              waves-effect
            "
          >
            <i className="material-icons">
              menu
            </i>
          </a>

          {/* DESKTOP MENU */}
          <ul
            className="
              right
              hide-on-med-and-down
            "
            style={{
              fontWeight: 600,
            }}
          >
            <li>
              <a href="#productos">
                Productos
              </a>
            </li>

            <li>
              <a href="#nosotros">
                Nosotros
              </a>
            </li>

            <li>
              <a href="#contacto">
                Contacto
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* SIDENAV */}
      <ul
        id="mobile-menu"
        className="sidenav"
      >
        <li>
          <a href="#productos">
            Productos
          </a>
        </li>

        <li>
          <a href="#nosotros">
            Nosotros
          </a>
        </li>

        <li>
          <a href="#contacto">
            Contacto
          </a>
        </li>
      </ul>

      {/* HERO */}
      <div className="parallax-container">
        {/* IMAGE */}
        <div className="parallax">
          <img
            src="/images/BeerStore.jpg"
            alt="Beer Store"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* CONTENT */}
        <div
          className="center"
          style={{
            marginTop:
              "160px",
          }}
        >
          {/* TITLE */}
          <h2
            className="
              white-text
              hero-title
            "
            style={{
              fontFamily:
                "serif",

              fontWeight: 700,

              textShadow:
                "0px 3px 15px rgba(0,0,0,0.7)",
            }}
          >
            Estanco MalaCopa
          </h2>

          {/* DESCRIPTION */}
          <p
            className="
              white-text
              flow-text
              hero-desc
            "
            style={{
              maxWidth:
                "650px",

              margin:
                "0 auto",

              marginTop:
                "10px",

              textShadow:
                "0px 2px 8px rgba(0,0,0,0.6)",

              fontSize:
                "1.4rem",
            }}
          >
            El lugar perfecto
            para relajarte,
            disfrutar y
            compartir buenos
            momentos.
          </p>

          {/* BUTTON */}
          <a
            href="#productos"
            className="
              btn
              waves-effect
              hero-btn
            "
            style={{
              backgroundColor:
                "#d4af37",

              fontWeight: 700,

              borderRadius:
                "8px",

              marginTop:
                "30px",
            }}
          >
            Ver Productos
          </a>
        </div>
      </div>
    </div>
  );
}