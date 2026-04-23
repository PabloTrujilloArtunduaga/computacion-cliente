import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>404</h1>
      <h2>Página no encontrada</h2>
      <p>La ruta que intentas acceder no existe.</p>

      <Link to="/" className="btn blue">
        Volver al inicio
      </Link>
    </div>
  );
}