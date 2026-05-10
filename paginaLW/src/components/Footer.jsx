import React from "react";

import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer
      className="
        footer-elegante
      "
    >
      <div
        className="
          container
          center-align
        "
      >
        <h5 className="footer-brand">
          <span className="footer-estanco">
            Estanco
          </span>

          <span className="footer-malacopa">
            MalaCopa
          </span>
        </h5>

        <div className="footer-divider"></div>

        <p className="footer-links">
          © 2026 Estanco
          MalaCopa •

          <a
            href="#"
            className="
              footer-link
            "
          >
            Aviso Legal
          </a>

          •

          <a
            href="#"
            className="
              footer-link
            "
          >
            Política de
            Privacidad
          </a>
        </p>

        <div className="footer-social">
          <a
            href="/"
            className="
              footer-icon
            "
          >
            <i className="material-icons">
              facebook
            </i>
          </a>

          <a
            href="/"
            className="
              footer-icon
            "
          >
            <i className="material-icons">
              email
            </i>
          </a>

          <a
            href="/"
            className="
              footer-icon
            "
          >
            <i className="material-icons">
              phone
            </i>
          </a>
        </div>
      </div>
    </footer>
  );
}