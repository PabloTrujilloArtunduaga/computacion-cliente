import React from "react";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer-elegante">

      <div className="container center-align">

        {/* Marca */}
        <h5 className="footer-brand">
          <span className="footer-estanco">Estanco</span>
          <span className="footer-malacopa">MalaCopa</span>
        </h5>

        {/* Línea divisoria dorada */}
        <div className="footer-divider"></div>

        {/* Enlaces legales */}
        <p className="footer-links">
          © 2025 Estanco MalaCopa •
          <a href="#" className="footer-link"> Aviso Legal </a>•
          <a href="#" className="footer-link"> Política de Privacidad </a>
        </p>

        {/* Redes sociales */}
        <div className="footer-social">
          <a href="/" className="footer-icon tooltip" data-tooltip="Facebook">
            <i className="material-icons">f</i>
          </a>
          <a href="/" className="footer-icon tooltip" data-tooltip="Correo">
            <i className="material-icons">✉️</i>
          </a>
          <a href="/" className="footer-icon tooltip" data-tooltip="Teléfono">
            <i className="material-icons">✆</i>
          </a>
        </div>

      </div>

    </footer>
  );
}
