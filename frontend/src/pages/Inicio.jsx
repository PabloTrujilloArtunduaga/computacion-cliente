import React, {
  useEffect,
  useState,
} from "react";

import Carrusel from "../components/Carrusel";
import Categorias from "../components/Categorias";

import "../styles/Inicio.css";

export default function Inicio() {
  /*
    =========================
    STATES
    =========================
  */

  const [promos, setPromos] =
    useState([]);

  const [cargando, setCargando] =
    useState(true);

  /*
    =========================
    FETCH
    =========================
  */

  useEffect(() => {
    let mounted = true;

    const cargarPromos =
      async () => {
        try {
          const response =
            await fetch(
              "/promocion.json"
            );

          if (!response.ok) {
            throw new Error(
              "Error cargando promociones"
            );
          }

          const data =
            await response.json();

          if (mounted) {
            setPromos(
              Array.isArray(
                data?.promociones
              )
                ? data.promociones
                : []
            );
          }
        } catch (error) {
          console.error(
            "ERROR FETCH:",
            error
          );

          if (mounted) {
            setPromos([]);
          }
        } finally {
          if (mounted) {
            setCargando(false);
          }
        }
      };

    cargarPromos();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      {/* CARRUSEL */}
      <Carrusel />

      {/* CATEGORÍAS */}
      <Categorias />

      {/* PROMOS */}
      <section className="inicio-section">
        {/* TITLE */}
        <h2 className="titulo-section">
          Promociones del
          Estanco MalaCopa
        </h2>

        {/* LINE */}
        <div className="linea-promos" />

        {/* LOADING */}
        {cargando ? (
          <div
            className="center-align"
            style={{
              padding:
                "3rem 0",
            }}
          >
            <p className="grey-text">
              Cargando
              promociones...
            </p>
          </div>
        ) : (
          /* GRID */
          <div className="promos-grid">
            {promos.map(
              (promo) => (
                <div
                  key={
                    promo.id ||
                    promo.titulo
                  }
                  className="
                    promo-card
                    hoverable
                  "
                >
                  {/* DESCUENTO */}
                  <span className="descuento">
                    -
                    {
                      promo.descuento
                    }
                    %
                  </span>

                  {/* IMAGE */}
                  <div className="promo-img">
                    <img
                      src={
                        promo.imagen
                      }
                      alt={
                        promo.titulo
                      }
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  {/* TITLE */}
                  <h3 className="promo-nombre">
                    {promo.titulo}
                  </h3>

                  {/* PRICES */}
                  <div className="promo-precios">
                    <span className="promo-precio-actual">
                      $
                      {Number(
                        promo.precioPromo ||
                          0
                      ).toLocaleString()}
                    </span>

                    <span
                      className="
                        promo-precio-ant
                        grey-text
                      "
                    >
                      $
                      {Number(
                        promo.precioAnterior ||
                          0
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}