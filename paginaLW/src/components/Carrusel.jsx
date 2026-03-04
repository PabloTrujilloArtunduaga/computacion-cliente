import React, { useEffect, useState, useRef } from "react";
import "../styles/Carrusel.css";

import gifInicio from "../assets/slider/inicio.gif";
import barra from "../assets/slider/barra.png";
import barrita from "../assets/slider/barrita.png";
import bebidas from "../assets/slider/bebidas.png";
import estanco from "../assets/slider/estanco.png";

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
  const [fade, setFade] = useState(true);
  const touchStartX = useRef(null);

  // Cambio de forma automatica
  useEffect(() => {
    const interval = setInterval(() => nextSlide(), 8000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setFade(false);
    setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length);
      setFade(true);
    }, 300);
  };

  const prevSlide = () => {
    setFade(false);
    setTimeout(() => {
      setIndex((i) => (i - 1 + slides.length) % slides.length);
      setFade(true);
    }, 300);
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

  return (
    <div
      className="carrusel-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className={`slide fade ${fade ? "fade-in" : "fade-out"}`}>
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
