import React, { useEffect, useContext } from "react";
import M from "materialize-css";
import { CarritoContext } from "../context/CarritoContext";

export default function ProductoCard({ producto }) {
  const { agregarAlCarrito } = useContext(CarritoContext);

  useEffect(() => {
    M.AutoInit();
  }, []);

  // 🔹 VALIDAR DISPONIBILIDAD
  const disponible = producto.estado && producto.stock > 0;

  // 🔹 AGREGAR AL CARRITO
  const agregarSimulado = () => {
    if (!disponible) return;

    agregarAlCarrito(producto);

    M.toast({
      html: `<strong>${producto.nombre}</strong> agregado al carrito`,
      classes: "green darken-2",
    });
  };

  return (
    <div className="col s12 m6 l4">
      <div className={`card hoverable producto-card ${!disponible ? "grey lighten-3" : ""}`}>

        {/* 🖼️ IMAGEN */}
        <div className="card-image producto-img-wrapper">
          <img
            src={producto.imagen || "https://via.placeholder.com/300"}
            alt={producto.nombre}
            className="producto-img"
          />
        </div>

        {/* 📦 CONTENIDO */}
        <div className="card-content producto-content">
          <h5 className="producto-titulo">{producto.nombre}</h5>

          <p className="producto-descripcion">
            {producto.descripcion || "Sin descripción"}
          </p>

          <p>
            <b>Precio:</b> $
            {producto.precio ? producto.precio.toLocaleString() : "0"}
          </p>

          {/* 🔥 ESTADO */}
          {disponible ? (
            <p className="green-text"><b>Disponible</b></p>
          ) : (
            <p className="red-text"><b>No disponible</b></p>
          )}

          {/* 🔥 STOCK (extra útil) */}
          <p className="grey-text">
            Stock: {producto.stock ?? 0}
          </p>
        </div>

        {/* 🛒 BOTÓN */}
        <div className="card-action center-align">
          <button
            disabled={!disponible}
            className={`btn waves-effect waves-light producto-btn ${
              disponible ? "amber darken-2" : "grey"
            }`}
            onClick={agregarSimulado}
          >
            {disponible ? "Agregar" : "No disponible"}
          </button>
        </div>

      </div>
    </div>
  );
}