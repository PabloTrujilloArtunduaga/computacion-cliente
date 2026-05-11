import React, { useEffect, useState, useRef } from "react";
import Carrusel from "../components/Carrusel";
import Categorias from "../components/Categorias";
import "../styles/Inicio.css";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { GSAP_CONFIG } from "../utils/animaciones";

export default function Inicio() {
  const [promos, setPromos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const inicioRef = useRef(null);

  useEffect(() => {
    const cargarPromos = async () => {
      try {
        const res = await fetch("promocion.json");
        const data = await res.json();
        setPromos(data.promociones);
      } catch (error) {
        console.error("Error cargando promociones:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarPromos();
  }, []);

  useGSAP(() => {
    // Animación del Título
    gsap.from(".titulo-section", {
      scrollTrigger: {
        trigger: ".inicio-section",
        start: "top 95%", 
        toggleActions: "play none none reverse"
      },
      y: 30,
      opacity: 0,
      duration: GSAP_CONFIG.duracionLarga,
      ease: GSAP_CONFIG.easePrincipal,
      clearProps: "all"
    });

    // Animación de las tarjetas asíncronas
    if (!cargando && promos.length > 0) {
      gsap.from(".promo-card", {
        scrollTrigger: {
          trigger: ".promos-grid",
          start: "top 85%",
          toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        scale: 0.9,
        duration: GSAP_CONFIG.duracionMedia,
        stagger: GSAP_CONFIG.staggerEstandar,
        ease: GSAP_CONFIG.easeRebote,
        clearProps: "all"
      });
    }
  }, { scope: inicioRef, dependencies: [cargando, promos] });

  return (
    <div ref={inicioRef}>
      <Carrusel />
      <Categorias />

      <section className="inicio-section">
        <h2 className="titulo-section">Promociones del Estanco MalaCopa</h2>
        <div className="linea-promos"></div>

        {cargando ? (
          <div className="center-align" style={{ padding: "3rem 0" }}>
            <p className="cargando grey-text">Cargando promociones...</p>
          </div>
        ) : (
          <div className="promos-grid">
            {promos.map((p) => (
              <div key={p.id} className="promo-card hoverable">
                <span className="descuento">-{p.descuento}%</span>

                <div className="promo-img">
                  {/* 🔹 PERFORMANCE: lazy loading y decoding */}
                  <img src={p.imagen} alt={p.titulo} loading="lazy" decoding="async" />
                </div>

                <h3 className="promo-nombre">{p.titulo}</h3>

                <div className="promo-precios">
                  <span className="promo-precio-actual">
                    ${p.precioPromo.toLocaleString()}
                  </span>
                  <span className="promo-precio-ant grey-text" style={{ textDecoration: "line-through", fontSize: "0.9em", marginLeft: "8px" }}>
                    ${p.precioAnterior.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}