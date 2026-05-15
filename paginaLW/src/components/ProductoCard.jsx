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

  // =========================================
  // CONTEXT
  // =========================================

  const {
    carrito,
    agregarAlCarrito
  } = useContext(CarritoContext);

  // =========================================
  // REF
  // =========================================

  const cardRef = useRef(null);

  // =========================================
  // DATA SAFE
  // =========================================

  const {
    _id,
    nombre = "Producto",
    descripcion =
      "Sin descripción",
    precio = 0,
    stock = 0,
    imagen =
      "https://via.placeholder.com/400x300?text=Producto",
    estado = true,
  } = producto;

  // =========================================
  // CANTIDAD EN CARRITO
  // =========================================

  const cantidadEnCarrito =
    useMemo(() => {

      const productoCarrito =
        carrito.find(
          (item) =>
            item._id === _id
        );

      return productoCarrito
        ? Number(
            productoCarrito.cantidad
          )
        : 0;

    }, [carrito, _id]);

  // =========================================
  // STOCK DISPONIBLE
  // =========================================

  const stockDisponible =
    useMemo(() => {

      const disponible =
        Number(stock) -
        Number(cantidadEnCarrito);

      return Math.max(
        disponible,
        0
      );

    }, [
      stock,
      cantidadEnCarrito
    ]);

  // =========================================
  // DISPONIBILIDAD
  // =========================================

  const disponible =
    useMemo(() => {

      return (
        Boolean(estado) &&
        Number(stockDisponible) > 0
      );

    }, [
      estado,
      stockDisponible
    ]);

  // =========================================
  // PRECIO FORMAT
  // =========================================

  const precioFormateado =
    useMemo(() => {

      return Number(
        precio || 0
      ).toLocaleString("es-CO");

    }, [precio]);

  // =========================================
  // DEBUGS
  // =========================================

  console.log("=================================");
  console.log("📦 PRODUCTO:", nombre);

  console.log("🆔 ID:", _id);

  console.log("📦 STOCK DB:", stock);

  console.log("🛒 EN CARRITO:", cantidadEnCarrito);

  console.log("✅ STOCK DISPONIBLE:", stockDisponible);

  console.log("🚫 DISPONIBLE:", disponible);

  if (!disponible) {

    console.warn("⚠️ PRODUCTO AGOTADO");

  }

  // =========================================
  // MATERIALIZE
  // =========================================

  useEffect(() => {

    if (!cardRef.current) {
      return;
    }

    const waves =
      cardRef.current.querySelectorAll(
        ".waves-effect"
      );

    if (
      M?.Waves?.init &&
      waves.length > 0
    ) {

      M.Waves.init(waves);

    }

  }, []);

  // =========================================
  // AGREGAR CARRITO
  // =========================================

  const handleAgregar =
    () => {

      // =====================================
      // PRODUCTO AGOTADO
      // =====================================

      if (!disponible) {

        console.log("❌ NO SE PUEDE AGREGAR");

        M.toast({

          html:
            "⚠️ Producto agotado",

          classes:
            "red darken-3 rounded"

        });

        return;
      }

      // =====================================
      // DEBUG
      // =====================================

      console.log("=================================");
      console.log("➕ AGREGAR PRODUCTO");

      console.log(producto);

      console.log("📦 STOCK ACTUAL:");
      console.log(stockDisponible);

      // =====================================
      // AGREGAR
      // =====================================

      agregarAlCarrito(producto);

      // =====================================
      // TOAST
      // =====================================

      M.toast({

        html: `
          <span>
            <strong>${nombre}</strong>
            agregado al carrito
          </span>
        `,

        classes:
          "green darken-2 rounded",

        displayLength: 1800,

      });

    };

  return (

    <div
      ref={cardRef}
      className="col s12 m6 l4"
    >

      <article

        className={`
          producto-card
          ${
            !disponible
              ? "producto-disabled"
              : ""
          }
        `}

      >

        {/* =====================================
            IMAGE
        ===================================== */}

        <div className="producto-img-wrapper">

          <img
            src={imagen}
            alt={nombre}
            className="producto-img"
            loading="lazy"
            decoding="async"
            onError={(e) => {

              console.log(
                "❌ ERROR IMAGEN"
              );

              e.target.src =
                "https://via.placeholder.com/400x300?text=Sin+Imagen";

            }}
          />

          {/* BADGE */}

          {
            !disponible && (

              <div className="producto-badge">

                Agotado

              </div>

            )
          }

        </div>

        {/* =====================================
            CONTENT
        ===================================== */}

        <div className="producto-content">

          <h5 className="producto-titulo">
            {nombre}
          </h5>

          <p className="producto-descripcion">
            {descripcion}
          </p>

          <div className="producto-info">

            <div className="producto-precio-box">

              <span className="precio-label">
                Precio
              </span>

              <p className="producto-precio">

                $
                {
                  precioFormateado
                }

              </p>

            </div>

            <div className="producto-stock-wrapper">

              <span
                className={
                  disponible
                    ? "stock-disponible"
                    : "stock-agotado"
                }
              >

                {
                  disponible
                    ? "Disponible"
                    : "Agotado"
                }

              </span>

              <span className="producto-stock">

                Stock:
                {" "}

                <strong>
                  {stockDisponible}
                </strong>

              </span>

            </div>

          </div>

        </div>

        {/* =====================================
            ACTION
        ===================================== */}

        <div className="producto-action">

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
                  ? ""
                  : "producto-btn-disabled"
              }
            `}

            aria-label={`Agregar ${nombre} al carrito`}

          >

            <i className="material-icons left">

              {
                disponible
                  ? "shopping_cart"
                  : "block"
              }

            </i>

            {
              disponible
                ? "Agregar"
                : "Agotado"
            }

          </button>

        </div>

      </article>

    </div>

  );

}