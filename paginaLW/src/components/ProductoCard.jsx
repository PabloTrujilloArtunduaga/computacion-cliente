import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";

import M from "materialize-css";

import { CarritoContext } from "../context/CarritoContext";

import "../styles/Productos.css";

export default function ProductoCard({
  producto = {},
}) {
  /*
    =========================
    CONTEXT
    =========================
  */

  const { agregarAlCarrito } =
    useContext(CarritoContext);

  /*
    =========================
    REF
    =========================
  */

  const cardRef = useRef(null);

  /*
    =========================
    DATA SAFE
    =========================
  */

  const {
    nombre = "Producto",
    descripcion =
      "Sin descripción",
    precio = 0,
    stock = 0,
    imagen =
      "https://via.placeholder.com/400x300?text=Producto",
    estado = false,
  } = producto;

  /*
    =========================
    DISPONIBILIDAD
    =========================
  */

  const disponible = useMemo(() => {
    return (
      Boolean(estado) &&
      Number(stock) > 0
    );
  }, [estado, stock]);

  /*
    =========================
    PRECIO FORMAT
    =========================
  */

  const precioFormateado =
    useMemo(() => {
      return Number(
        precio || 0
      ).toLocaleString("es-CO");
    }, [precio]);

  /*
    =========================
    MATERIALIZE
    =========================
  */

  useEffect(() => {
    if (!cardRef.current) {
      return;
    }

    const waves =
      cardRef.current.querySelectorAll(
        ".waves-effect"
      );

    /*
      INIT WAVES SAFE
    */

    if (
      M?.Waves?.init &&
      waves.length > 0
    ) {
      M.Waves.init(waves);
    }
  }, []);

  /*
    =========================
    AGREGAR CARRITO
    =========================
  */

  const handleAgregar =
    () => {
      if (!disponible) {
        return;
      }

      /*
        ADD
      */

      agregarAlCarrito(producto);

      /*
        TOAST SAFE
      */

      if (
        typeof M?.toast ===
        "function"
      ) {
        M.toast({
          html: `
            <span>
              <strong>${nombre}</strong>
              agregado al carrito
            </span>
          `,
          classes:
            "green darken-2 rounded",
          displayLength: 2000,
        });
      }
    };

  return (
    <div
      ref={cardRef}
      className="col s12 m6 l4"
    >
      <article
        className={`
          card
          hoverable
          producto-card
          ${
            !disponible
              ? "producto-disabled"
              : ""
          }
        `}
      >
        {/* IMAGE */}
        <div className="card-image producto-img-wrapper">
          <img
            src={imagen}
            alt={nombre}
            className="producto-img"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/400x300?text=Sin+Imagen";
            }}
          />

          {!disponible && (
            <span className="card-title producto-badge">
              Agotado
            </span>
          )}
        </div>

        {/* CONTENT */}
        <div className="card-content producto-content">
          <h5 className="producto-titulo">
            {nombre}
          </h5>

          <p className="producto-descripcion">
            {descripcion}
          </p>

          <div className="producto-info">
            <p className="producto-precio">
              $
              {
                precioFormateado
              }
            </p>

            <p
              className={
                disponible
                  ? "green-text text-darken-2"
                  : "red-text text-darken-2"
              }
            >
              <strong>
                {disponible
                  ? "Disponible"
                  : "No disponible"}
              </strong>
            </p>

            <p className="grey-text text-darken-1">
              Stock:
              {" "}
              {stock}
            </p>
          </div>
        </div>

        {/* ACTION */}
        <div className="card-action center-align">
          <button
            type="button"
            onClick={
              handleAgregar
            }
            disabled={
              !disponible
            }
            className={`
              btn
              waves-effect
              waves-light
              producto-btn
              ${
                disponible
                  ? "amber darken-2"
                  : "grey"
              }
            `}
            aria-label={`Agregar ${nombre} al carrito`}
          >
            {disponible
              ? "Agregar"
              : "Agotado"}
          </button>
        </div>
      </article>
    </div>
  );
}