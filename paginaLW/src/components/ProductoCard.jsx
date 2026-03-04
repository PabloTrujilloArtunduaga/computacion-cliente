import React, { useEffect, useContext } from "react";
import M from "materialize-css";
import { CarritoContext } from "../context/CarritoContext";

export default function ProductoCard({ producto }) {
  const { agregarAlCarrito } = useContext(CarritoContext);

  useEffect(() => {
    M.AutoInit();
  }, []);

  const agregarSimulado = () => {
    agregarAlCarrito(producto);
    M.toast({
      html: `<strong> ${producto.titulo} </strong> agregado al carrito`,
      classes: "green darken-2",
    });
  };

  return (
    <div className="col s12 m6 l4">
      <div className="card hoverable producto-card">
        <div className="card-image producto-img-wrapper">
          <img
            src={producto.imagen}
            alt={producto.titulo}
            className="producto-img"
          />
        </div>
        <div className="card-content producto-content">
          <h5 className="producto-titulo">{producto.titulo}</h5>
          <p className="producto-descripcion">{producto.descripcion}</p>
          {producto.precio && <p><b>Precio:</b> ${producto.precio.toLocaleString()}</p>}
        </div>
        <div className="card-action center-align">
          <button
            className="btn amber darken-2 waves-effect waves-light producto-btn"
            onClick={agregarSimulado}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
