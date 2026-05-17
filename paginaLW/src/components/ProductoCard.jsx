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
  // ESTADOS PROFESIONALES
  // =========================================

  /*
    =======================================
    CASOS:

    1. stock = 0
       => AGOTADO

    2. estado = false
       => NO DISPONIBLE

    3. estado = true && stock > 0
       => DISPONIBLE
    =======================================
  */

  const agotado =
    Number(stockDisponible) <= 0;

  const noDisponible =
    !Boolean(estado) &&
    !agotado;

  const disponible =
    Boolean(estado) &&
    Number(stockDisponible) > 0;

  // =========================================
  // TEXTO ESTADO
  // =========================================

  const estadoTexto =
    useMemo(() => {

      if (agotado) {
        return "Agotado";
      }

      if (noDisponible) {
        return "No disponible";
      }

      return "Disponible";

    }, [
      agotado,
      noDisponible
    ]);

  // =========================================
  // CLASE ESTADO
  // =========================================

  const estadoClase =
    useMemo(() => {

      if (agotado) {
        return "stock-agotado";
      }

      if (noDisponible) {
        return "stock-no-disponible";
      }

      return "stock-disponible";

    }, [
      agotado,
      noDisponible
    ]);

  // =========================================
  // BADGE
  // =========================================

  const badgeTexto =
    useMemo(() => {

      if (agotado) {
        return "Agotado";
      }

      if (noDisponible) {
        return "No disponible";
      }

      return null;

    }, [
      agotado,
      noDisponible
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

  console.log("🚫 ESTADO:", estado);

  console.log("📌 DISPONIBLE:", disponible);

  console.log("📌 AGOTADO:", agotado);

  console.log("📌 NO DISPONIBLE:", noDisponible);

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

      /*
        =====================================
        AGOTADO
        =====================================
      */

      if (agotado) {

        M.toast({

          html:
            "⚠️ Producto agotado",

          classes:
            "red darken-3 rounded"

        });

        return;
      }

      /*
        =====================================
        NO DISPONIBLE
        =====================================
      */

      if (noDisponible) {

        M.toast({

          html:
            "⚠️ Producto no disponible",

          classes:
            "grey darken-3 rounded"

        });

        return;
      }

      /*
        =====================================
        AGREGAR
        =====================================
      */

      agregarAlCarrito(producto);

      /*
        =====================================
        TOAST
        =====================================
      */

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
              disponible
                ? "producto-hover"
                : "producto-disabled"
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

          {/* =====================================
              BADGE
          ===================================== */}

          {
            badgeTexto && (

              <div
                className={`
                  producto-badge
                  ${
                    agotado
                      ? "badge-agotado"
                      : "badge-no-disponible"
                  }
                `}
              >

                {badgeTexto}

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

            {/* PRECIO */}
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

            {/* STOCK */}
            <div className="producto-stock-wrapper">

              <span
                className={
                  estadoClase
                }
              >

                {estadoTexto}

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
                : estadoTexto
            }

          </button>

        </div>

      </article>

    </div>

  );

}