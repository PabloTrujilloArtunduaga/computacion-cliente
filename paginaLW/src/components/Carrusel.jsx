import React, { useEffect, useState, useRef } from "react";
import "../styles/Carrusel.css";

import gifInicio from "../assets/slider/inicio.gif";
import barra from "../assets/slider/barra.png";
import barrita from "../assets/slider/barrita.png";
import bebidas from "../assets/slider/bebidas.png";
import estanco from "../assets/slider/estanco.png";

// GSAP
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Carrusel() {
  const slides = [
    {
      imagen: gifInicio,
      overline: "Bienvenido a",
      subtitulo: "Estanco MalaCopa",
      alt: "Bienvenida Estanco MalaCopa",
    },
    {
      imagen: barra,
      titulo: "Cervezas",
      descripcion:
        "Desde las cervezas más suaves y refrescantes hasta las más intensas y artesanales.",
      boton: { texto: "Ver Más", enlace: "/productos" },
      alt: "Botellas de cerveza",
    },
    {
      imagen: barrita,
      titulo: "Licores",
      descripcion:
        "Explora nuestra selección de licores nacionales e importados, ideales para cualquier ocasión.",
      boton: { texto: "Ver Más", enlace: "/productos" },
      alt: "Botellas de licores en barra",
    },
    {
      imagen: bebidas,
      titulo: "Contáctanos",
      descripcion:
        "Si tienes dudas, quejas o sugerencias, no dudes en comunicarte con nosotros.",
      boton: { texto: "Ir a Contacto", enlace: "/contacto" },
      alt: "Imagen de contacto",
    },
    {
      imagen: estanco,
      alt: "Fachada del estanco de noche",
    },
  ];

  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);
  

  const carruselRef = useRef(null); 
  const slideContentRef = useRef(null); 

  // Cambio de forma automatica
  useEffect(() => {
    const interval = setInterval(() => nextSlide(), 8000);
    return () => clearInterval(interval);
  }, []);


  const nextSlide = () => {
    setIndex((i) => (i + 1) % slides.length);
  };

  const prevSlide = () => {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  };

  // Navegación tactil
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;

    if (diff > 50) prevSlide();
    else if (diff < -50) nextSlide();

    touchStartX.current = null;
  };

  const slide = slides[index];


  useGSAP(() => {

    const tl = gsap.timeline();


    gsap.set(slideContentRef.current, { opacity: 0 });
    gsap.set(".texto-principal *", { y: 20, opacity: 0 });


    tl.to(slideContentRef.current, {
      opacity: 1,
      duration: 0.8,
      ease: "power2.inOut"
    })

    .to(".texto-principal > *", {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.15, // Cada línea de texto (overline, h1, p, btn) entra con diferencia de 0.15s
      ease: "power3.out"
    }, "-=0.4"); // Empieza un poco antes de que termine el fade de la imagen

  }, { 
    dependencies: [index], // Le decimos a useGSAP que se vuelva a ejecutar CADA VEZ que cambia el índice
    scope: carruselRef 
  });

  return (
    <div
      ref={carruselRef} // Asignamos el scope
      className="carrusel-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >

      <div ref={slideContentRef} className="slide">
        <img src={slide.imagen} alt={slide.alt || "slide"} />

        <div className="capa" />

        <div className="texto-principal">
          {slide.overline && <p className="overline">{slide.overline}</p>}
          {(slide.titulo || slide.subtitulo) && (
            <h1>{slide.titulo || slide.subtitulo}</h1>
          )}
          {slide.descripcion && (
            <p className="descripcion">{slide.descripcion}</p>
          )}
          {slide.boton && (
            <a className="btn-cta" href={slide.boton.enlace}>
              {slide.boton.texto}
            </a>
          )}
        </div>
      </div>

      <button className="carrusel-btn izquierda" onClick={prevSlide}>
        ‹
      </button>
      <button className="carrusel-btn derecha" onClick={nextSlide}>
        ›
      </button>

      <div className="dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={i === index ? "active" : ""}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}