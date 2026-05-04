import React, { useRef } from "react";
import "../styles/Categorias.css";
import { useNavigate } from "react-router-dom";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { GSAP_CONFIG } from "../utils/animaciones";

import cervezas from "../assets/categorias/cervezas.png";
import licores from "../assets/categorias/liquors.png";
import snacks from "../assets/categorias/snacks.png"; 

export default function Categorias() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  const categorias = [
    { titulo: "CERVEZAS", img: cervezas },
    { titulo: "LICORES", img: licores },
    { titulo: "SNACKS Y MÁS", img: snacks },
  ];

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    tl.from([".titulo-categorias", ".linea"], {
      y: 20,
      opacity: 0,
      duration: GSAP_CONFIG.duracionMedia,
      stagger: 0.2,
      ease: GSAP_CONFIG.easePrincipal,
      clearProps: "all"
    })
    .from(".categoria-card", {
      y: 50,
      opacity: 0,
      scale: 0.9,
      duration: GSAP_CONFIG.duracionMedia,
      stagger: GSAP_CONFIG.staggerEstandar,
      ease: GSAP_CONFIG.easeRebote,
      clearProps: "all"
    }, "-=0.3");

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="categorias-section">
      <h2 className="titulo-categorias">CATEGORÍAS</h2>
      <div className="linea"></div>

      <div className="categorias-grid">
        {categorias.map((cat, i) => (
          <div
            key={i}
            className="categoria-card hoverable"
            onClick={() => navigate("/productos")}
          >
            {/* 🔹 PERFORMANCE */}
            <img src={cat.img} alt={cat.titulo} loading="lazy" decoding="async" />
            <div className="categoria-titulo">{cat.titulo}</div>
          </div>
        ))}
      </div>
    </section>
  );
}