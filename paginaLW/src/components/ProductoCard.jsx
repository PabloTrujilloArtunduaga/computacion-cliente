import React, { useEffect, useContext, useRef } from "react";
import M from "materialize-css";
import { CarritoContext } from "../context/CarritoContext";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { GSAP_CONFIG } from "../utils/animaciones";

export default function ProductoCard({ producto }) {
  const { agregarAlCarrito } = useContext(CarritoContext);
  const cardWrapperRef = useRef(null);

  useEffect(() => {
    M.AutoInit();
  }, []);

  useGSAP(() => {
    gsap.from(cardWrapperRef.current, {
      scrollTrigger: {
        trigger: cardWrapperRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      y: 40,
      opacity: 0,
      duration: GSAP_CONFIG.duracionMedia,
      ease: GSAP_CONFIG.easePrincipal,
      clearProps: "all"
    });
  }); 

  const disponible = producto.estado && producto.stock > 0;

  const agregarSimulado = () => {
    if (!disponible) return;
    agregarAlCarrito(producto);
    M.toast({ html: `<strong>${producto.nombre}</strong> agregado al carrito`, classes: "green darken-2" });
  };

  return (
    <div ref={cardWrapperRef} className="col s12 m6 l4">
      <div className={`card hoverable producto-card ${!disponible ? "grey lighten-3" : ""}`}>

        <div className="card-image producto-img-wrapper">

          <img
            src={producto.imagen || "https://via.placeholder.com/300"}
            alt={producto.nombre}
            className="producto-img"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="card-content producto-content">
          <h5 className="producto-titulo">{producto.nombre}</h5>
          <p className="producto-descripcion">{producto.descripcion || "Sin descripción"}</p>
          <p><b>Precio:</b> ${producto.precio ? producto.precio.toLocaleString() : "0"}</p>
          
          {disponible ? (
            <p className="green-text"><b>Disponible</b></p>
          ) : (
            <p className="red-text"><b>No disponible</b></p>
          )}
          <p className="grey-text">Stock: {producto.stock ?? 0}</p>
        </div>

        <div className="card-action center-align">
          <button
            disabled={!disponible}
            className={`btn waves-effect waves-light producto-btn ${ disponible ? "amber darken-2" : "grey" }`}
            onClick={agregarSimulado}
            aria-label={`Agregar ${producto.nombre} al carrito`}
          >
            {disponible ? "Agregar" : "No disponible"}
          </button>
        </div>

      </div>
    </div>
  );
}