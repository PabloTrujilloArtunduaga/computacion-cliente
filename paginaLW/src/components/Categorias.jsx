import React from "react";
import "../styles/Categorias.css";
import { useNavigate } from "react-router-dom";

import cervezas from "../assets/categorias/cervezas.png";
import licores from "../assets/categorias/liquors.png";
import snacks from "../assets/categorias/snacks.png"; 

export default function Categorias() {
  const navigate = useNavigate();

  const categorias = [
    { titulo: "CERVEZAS", img: cervezas },
    { titulo: "LICORES", img: licores },
    { titulo: "SNACKS Y MÁS", img: snacks },
  ];

  return (
    <section className="categorias-section">
      <h2 className="titulo-categorias">CATEGORÍAS</h2>
      <div className="linea"></div>

      <div className="categorias-grid">
        {categorias.map((cat, i) => (
          <div
            key={i}
            className="categoria-card"
            onClick={() => navigate("/productos")}
          >
            <img src={cat.img} alt={cat.titulo} />
            <div className="categoria-titulo">{cat.titulo}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
