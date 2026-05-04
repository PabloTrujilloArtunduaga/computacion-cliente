import React, { useEffect, useRef } from "react"; 
import M from "materialize-css";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";


import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Navbar() {
  const location = useLocation();
  

  const navRef = useRef(null);


  useEffect(() => {
    M.Sidenav.init(document.querySelectorAll(".sidenav"));
  }, []);


  useGSAP(() => {

    const tl = gsap.timeline();


    tl.from(".brand-logo", {
      y: -20,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    })

    .from(".hide-on-med-and-down li", {
      y: -20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1, // 0.1 segundos de retraso entre cada link
      ease: "power2.out"
    }, "-=0.3"); // El -=0.3 hace que esta animación empiece un poco antes de que termine la del logo
    
  }, { scope: navRef }); // Limit la búsqueda de clases a este contenedor

  return (
    <>

      <nav ref={navRef} className="black nav-elegante">
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