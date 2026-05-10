import React from "react";

import "../styles/Categorias.css";

import { useNavigate } from "react-router-dom";

import cervezas from "../assets/categorias/cervezas.png";
import licores from "../assets/categorias/liquors.png";
import snacks from "../assets/categorias/snacks.png";

export default function Categorias() {
  /*
    =========================
    NAVIGATE
    =========================
  */

  const navigate =
    useNavigate();

  /*
    =========================
    CATEGORÍAS
    =========================
  */

  const categorias = [
    {
      titulo: "CERVEZAS",
      img: cervezas,
    },

    {
      titulo: "LICORES",
      img: licores,
    },

    {
      titulo:
        "SNACKS Y MÁS",
      img: snacks,
    },
  ];

  return (
    <section
      className="
        categorias-section
      "
    >
      {/* TITLE */}
      <h2 className="titulo-categorias">
        CATEGORÍAS
      </h2>

      {/* LINE */}
      <div className="linea"></div>

      {/* GRID */}
      <div className="categorias-grid">
        {categorias.map(
          (cat, i) => (
            <div
              key={i}
              className="
                categoria-card
                hoverable
              "
              onClick={() =>
                navigate(
                  "/productos"
                )
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (
                  e.key ===
                    "Enter" ||
                  e.key === " "
                ) {
                  navigate(
                    "/productos"
                  );
                }
              }}
            >
              {/* IMAGE */}
              <img
                src={cat.img}
                alt={cat.titulo}
                loading="lazy"
                decoding="async"
              />

              {/* TITLE */}
              <div className="categoria-titulo">
                {cat.titulo}
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}