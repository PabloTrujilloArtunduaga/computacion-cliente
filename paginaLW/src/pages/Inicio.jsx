import React, { useEffect, useState } from "react";
import Carrusel from "../components/Carrusel";
import Categorias from "../components/Categorias";
import "../styles/Inicio.css";

export default function Inicio() {
  const [promos, setPromos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarPromos = async () => {
      try {
        const res = await fetch("promocion.json");
        const data = await res.json();

        setPromos(data.promociones);
      } catch (error) {
        console.error("Error cargando promociones:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarPromos();
  }, []);

  return (
    <div>
      <Carrusel />
      <Categorias />

      {/* SECCIÓN PROMOCIONES */}
      <section className="inicio-section">
        <h2 className="titulo-section">Promociones del Estanco MalaCopa</h2>

        {cargando ? (
          <p className="cargando">Cargando promociones</p>
        ) : (
          <div className="promos-grid">
            {promos.map((p) => (
              <div key={p.id} className="promo-card">
                <span className="descuento">-{p.descuento}%</span>

                <div className="promo-img">
                  <img src={p.imagen} alt={p.titulo} />
                </div>

                <h3 className="promo-nombre">{p.titulo}</h3>

                <div className="promo-precios">
                  <span className="promo-precio-actual">
                    ${p.precioPromo.toLocaleString()}
                  </span>
                  <span className="promo-precio-ant">
                    ${p.precioAnterior.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
