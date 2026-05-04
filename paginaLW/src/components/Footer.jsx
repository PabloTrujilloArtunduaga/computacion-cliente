import React, { useRef } from "react";
import "../styles/Footer.css";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { GSAP_CONFIG } from "../utils/animaciones";

export default function Footer() {
  const footerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 95%",
        toggleActions: "play none none reverse"
      }
    });

    tl.from(".footer-brand", {
      y: 20, opacity: 0, duration: GSAP_CONFIG.duracionMedia, ease: GSAP_CONFIG.easePrincipal, clearProps: "all"
    })
    .from(".footer-divider", {
      scaleX: 0, transformOrigin: "center", duration: GSAP_CONFIG.duracionMedia, ease: "power3.out", clearProps: "all"
    }, "-=0.3")
    .from(".footer-links", {
      y: 10, opacity: 0, duration: GSAP_CONFIG.duracionCorta, ease: GSAP_CONFIG.easePrincipal, clearProps: "all"
    }, "-=0.3")
    .from(".footer-icon", {
      scale: 0, opacity: 0, duration: 0.5, stagger: 0.1, ease: GSAP_CONFIG.easeRebote, clearProps: "all"
    }, "-=0.2");

  }, { scope: footerRef });

  return (
    <footer ref={footerRef} className="footer-elegante">
      <div className="container center-align">

        <h5 className="footer-brand">
          <span className="footer-estanco">Estanco</span>
          <span className="footer-malacopa">MalaCopa</span>
        </h5>

        <div className="footer-divider"></div>

        <p className="footer-links">
          © 2026 Estanco MalaCopa •
          <a href="#" className="footer-link"> Aviso Legal </a>•
          <a href="#" className="footer-link"> Política de Privacidad </a>
        </p>

        <div className="footer-social">

          <a href="/" className="footer-icon tooltip" data-tooltip="Facebook" aria-label="Visitar nuestro Facebook">
            <i className="material-icons" aria-hidden="true">f</i>
          </a>
          <a href="/" className="footer-icon tooltip" data-tooltip="Correo" aria-label="Enviar un correo electrónico">
            <i className="material-icons" aria-hidden="true">✉️</i>
          </a>
          <a href="/" className="footer-icon tooltip" data-tooltip="Teléfono" aria-label="Llamar por teléfono">
            <i className="material-icons" aria-hidden="true">✆</i>
          </a>
        </div>

      </div>
    </footer>
  );
}