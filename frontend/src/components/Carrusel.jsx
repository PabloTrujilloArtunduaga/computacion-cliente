import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "../styles/Carrusel.css";

import gifInicio from "../assets/slider/inicio.gif";
import barra from "../assets/slider/barra.png";
import barrita from "../assets/slider/barrita.png";
import bebidas from "../assets/slider/bebidas.png";
import estanco from "../assets/slider/estanco.png";

export default function Carrusel() {
  /*
    =========================
    SLIDES
    =========================
  */

  const slides = useMemo(
    () => [
      {
        imagen: gifInicio,
        overline: "Bienvenido a",
        subtitulo:
          "Estanco MalaCopa",
        alt: "Bienvenida",
      },

      {
        imagen: barra,
        titulo: "Cervezas",
        descripcion:
          "Variedad de cervezas.",
        boton: {
          texto: "Ver Más",
          enlace: "/productos",
        },
        alt: "Cervezas",
      },

      {
        imagen: barrita,
        titulo: "Licores",
        descripcion:
          "Selección especial de licores.",
        boton: {
          texto: "Ver Más",
          enlace: "/productos",
        },
        alt: "Licores",
      },

      {
        imagen: bebidas,
        titulo: "Contáctanos",
        descripcion:
          "Escríbenos cuando quieras.",
        boton: {
          texto: "Ir a Contacto",
          enlace: "/contacto",
        },
        alt: "Contacto",
      },

      {
        imagen: estanco,
        titulo: "Nuestro Estanco",
        descripcion:
          "Visítanos y disfruta.",
        alt: "Fachada",
      },
    ],
    []
  );

  /*
    =========================
    STATES
    =========================
  */

  const [index, setIndex] =
    useState(0);

  /*
    =========================
    REFS
    =========================
  */

  const touchStartX =
    useRef(0);

  const intervalRef =
    useRef(null);

  /*
    =========================
    AUTO SLIDE
    =========================
  */

  useEffect(() => {
    intervalRef.current =
      setInterval(() => {
        setIndex((prev) => {
          return (
            (prev + 1) %
            slides.length
          );
        });
      }, 8000);

    return () => {
      if (intervalRef.current) {
        clearInterval(
          intervalRef.current
        );
      }
    };
  }, [slides.length]);

  /*
    =========================
    CONTROLS
    =========================
  */

  const nextSlide = () => {
    setIndex((prev) => {
      return (
        (prev + 1) %
        slides.length
      );
    });
  };

  const prevSlide = () => {
    setIndex((prev) => {
      return (
        (prev - 1 +
          slides.length) %
        slides.length
      );
    });
  };

  /*
    =========================
    TOUCH EVENTS
    =========================
  */

  const handleTouchStart = (
    event
  ) => {
    touchStartX.current =
      event.touches[0].clientX;
  };

  const handleTouchEnd = (
    event
  ) => {
    const endX =
      event.changedTouches[0]
        .clientX;

    const distance =
      endX -
      touchStartX.current;

    /*
      RIGHT
    */

    if (distance > 50) {
      prevSlide();
    }

    /*
      LEFT
    */

    if (distance < -50) {
      nextSlide();
    }
  };

  /*
    =========================
    CURRENT SLIDE
    =========================
  */

  const currentSlide =
    slides[index];

  return (
    <section
      className="carrusel-container"
      onTouchStart={
        handleTouchStart
      }
      onTouchEnd={
        handleTouchEnd
      }
    >
      {/* SLIDE */}
      <div
        key={index}
        className="slide"
      >
        {/* IMAGE */}
        <img
          src={
            currentSlide.imagen
          }
          alt={
            currentSlide.alt
          }
          className="slide-image"
          loading="eager"
          decoding="async"
        />

        {/* OVERLAY */}
        <div className="capa" />

        {/* CONTENT */}
        <div className="texto-principal">
          {currentSlide.overline && (
            <p className="overline">
              {
                currentSlide.overline
              }
            </p>
          )}

          {(currentSlide.titulo ||
            currentSlide.subtitulo) && (
            <h1>
              {currentSlide.titulo ||
                currentSlide.subtitulo}
            </h1>
          )}

          {currentSlide.descripcion && (
            <p className="descripcion">
              {
                currentSlide.descripcion
              }
            </p>
          )}

          {currentSlide.boton && (
            <a
              href={
                currentSlide
                  .boton.enlace
              }
              className="btn-cta"
            >
              {
                currentSlide
                  .boton.texto
              }
            </a>
          )}
        </div>
      </div>

      {/* LEFT BUTTON */}
      <button
        type="button"
        className="
          carrusel-btn
          izquierda
        "
        onClick={prevSlide}
        aria-label="Anterior"
      >
        ‹
      </button>

      {/* RIGHT BUTTON */}
      <button
        type="button"
        className="
          carrusel-btn
          derecha
        "
        onClick={nextSlide}
        aria-label="Siguiente"
      >
        ›
      </button>

      {/* DOTS */}
      <div className="dots">
        {slides.map(
          (_, slideIndex) => (
            <button
              key={slideIndex}
              type="button"
              className={
                slideIndex ===
                index
                  ? "active"
                  : ""
              }
              onClick={() =>
                setIndex(
                  slideIndex
                )
              }
              aria-label={`Slide ${
                slideIndex + 1
              }`}
            />
          )
        )}
      </div>
    </section>
  );
}