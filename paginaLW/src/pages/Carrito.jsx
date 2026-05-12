import React, {
  useContext,
  useState
} from "react";

import { useNavigate } from "react-router-dom";

import { CarritoContext } from "../context/CarritoContext";

import "../styles/Carrito.css";

export default function Carrito() {

  const {
    carrito,
    setCarrito,
    total,
    setTotal
  } = useContext(CarritoContext);

  const navigate = useNavigate();

  const [mostrarModal, setMostrarModal] =
    useState(false);

  const [cargando, setCargando] =
    useState(false);

  // =========================================
  // FORMULARIO
  // =========================================
  const [nombreTitular, setNombreTitular] =
    useState("");

  const [numeroTarjeta, setNumeroTarjeta] =
    useState("");

  const [fecha, setFecha] =
    useState("");

  const [cvv, setCvv] =
    useState("");

  // =========================================
  // ACTUALIZAR CANTIDAD
  // =========================================
  const actualizarCantidad = (index, delta) => {

    const nuevoCarrito = [...carrito];

    nuevoCarrito[index].cantidad += delta;

    if (nuevoCarrito[index].cantidad < 1) {
      nuevoCarrito[index].cantidad = 1;
    }

    setCarrito(nuevoCarrito);

    setTotal(
      nuevoCarrito.reduce(
        (acc, item) =>
          acc + item.precio * item.cantidad,
        0
      )
    );
  };

  // =========================================
  // ELIMINAR PRODUCTO
  // =========================================
  const eliminarProducto = (index) => {

    const nuevoCarrito =
      carrito.filter((_, i) => i !== index);

    setCarrito(nuevoCarrito);

    setTotal(
      nuevoCarrito.reduce(
        (acc, item) =>
          acc + item.precio * item.cantidad,
        0
      )
    );

    M.toast({
      html: "🗑️ Producto eliminado",
      classes: "red darken-1"
    });
  };

  // =========================================
  // ABRIR MODAL
  // =========================================
  const handlePagarClick = () => {

    const token =
      localStorage.getItem("token");

    if (!token) {

      M.toast({
        html: "⚠️ Debes iniciar sesión",
        classes: "orange darken-2"
      });

      navigate("/login");

      return;
    }

    setMostrarModal(true);
  };

  // =========================================
  // CERRAR MODAL
  // =========================================
  const cerrarModal = () => {

    if (cargando) return;

    setMostrarModal(false);
  };

  // =========================================
  // FORMATEAR TARJETA
  // =========================================
  const formatearTarjeta = (valor) => {

    const limpio =
      valor.replace(/\D/g, "");

    const dividido =
      limpio.match(/.{1,4}/g);

    return dividido
      ? dividido.join(" ")
      : "";
  };

  // =========================================
  // FORMATEAR FECHA
  // =========================================
  const formatearFecha = (valor) => {

    const limpio =
      valor.replace(/\D/g, "");

    if (limpio.length <= 2) {
      return limpio;
    }

    return `${limpio.slice(0,2)}/${limpio.slice(2,4)}`;
  };

  // =========================================
  // PAGAR
  // =========================================
  const pagarTarjeta = async (e) => {

    e.preventDefault();

    setCargando(true);

    try {

      const token =
        localStorage.getItem("token");

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      // =====================================
      // DEBUG USER
      // =====================================
      console.log("=================================");
      console.log("USER:");
      console.log(user);

      if (!token || !user || !user._id) {

        console.log("❌ TOKEN O USER INVALIDO");

        M.toast({
          html: "⚠️ Sesión inválida",
          classes: "orange darken-2"
        });

        navigate("/login");

        return;
      }

      // =====================================
      // DEBUG CARRITO
      // =====================================
      console.log("=================================");
      console.log("CARRITO:");
      console.log(carrito);

      // =====================================
      // PAYLOAD
      // =====================================
      const productosPayload =
        carrito.map((item) => {

          const productoId =
            item._id ||
            item.id ||
            item.producto_id;

          // DEBUG ITEM
          console.log("ITEM:");
          console.log(item);

          console.log("PRODUCTO ID:");
          console.log(productoId);

          return {

            producto_id: productoId,

            cantidad: item.cantidad,

            precio_unitario: item.precio,
          };
        });

      // DEBUG PAYLOAD
      console.log("=================================");
      console.log("PAYLOAD:");
      console.log(productosPayload);

      const bodyData = {

        cliente_id: user._id,

        productos: productosPayload,

        metodo_pago: "tarjeta",
      };

      console.log("=================================");
      console.log("BODY:");
      console.log(bodyData);

      // =====================================
      // FETCH
      // =====================================
      const res = await fetch(
        "http://localhost:3000/api/facturas/cliente",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(bodyData),
        }
      );

      // DEBUG STATUS
      console.log("=================================");
      console.log("STATUS:");
      console.log(res.status);

      const data = await res.json();

      console.log("=================================");
      console.log("RESPUESTA BACKEND:");
      console.log(data);

      if (!res.ok) {

        M.toast({
          html:
            `❌ ${
              data.message ||
              "Error creando factura"
            }`,
          classes: "red darken-1"
        });

        return;
      }

      // =====================================
      // SUCCESS
      // =====================================
      M.toast({
        html: "✅ Compra realizada",
        classes: "green darken-2"
      });

      // LIMPIAR
      setNombreTitular("");
      setNumeroTarjeta("");
      setFecha("");
      setCvv("");

      setCarrito([]);

      setTotal(0);

      cerrarModal();

    } catch (error) {

      console.log("=================================");
      console.log("ERROR:");
      console.error(error);

      M.toast({
        html:
          "❌ Error del servidor o backend apagado",
        classes: "red darken-1"
      });

    } finally {

      setCargando(false);
    }
  };

  return (

    <div className="container carrito-section">

      <h4 className="titulo-carrito">
        🛒 Tu Carrito
      </h4>

      <div className="divider"></div>

      {carrito.length === 0 ? (

        <p className="center vacio">
          Tu carrito está vacío.
        </p>

      ) : (

        <>

          <ul className="carrito-lista">

            {carrito.map((item, index) => (

              <li
                key={index}
                className="carrito-item"
              >

                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="carrito-img"
                />

                <div className="carrito-info">

                  <h6>{item.nombre}</h6>

                  <p className="precio-text">
                    $
                    {item.precio.toLocaleString()}
                  </p>

                  <div className="cantidad-controles">

                    <button
                      className="btn-floating btn-small btn-cantidad"
                      onClick={() =>
                        actualizarCantidad(index, -1)
                      }
                    >
                      <i className="material-icons">
                        remove
                      </i>
                    </button>

                    <span className="cantidad">
                      {item.cantidad}
                    </span>

                    <button
                      className="btn-floating btn-small btn-cantidad"
                      onClick={() =>
                        actualizarCantidad(index, 1)
                      }
                    >
                      <i className="material-icons">
                        add
                      </i>
                    </button>

                  </div>

                </div>

                <button
                  className="btn-floating red lighten-1 btn-eliminar"
                  onClick={() =>
                    eliminarProducto(index)
                  }
                >
                  <i className="material-icons">
                    delete
                  </i>
                </button>

              </li>

            ))}

          </ul>

          <h5 className="total center">

            Total:
            <b>
              ${total.toLocaleString()}
            </b>

          </h5>

          <div className="center">

            <button
              className="btn-large btn-pagar"
              onClick={handlePagarClick}
            >
              💳 Pagar con Tarjeta
            </button>

          </div>

        </>

      )}

      {/* =====================================
          MODAL
      ===================================== */}
      {mostrarModal && (

        <div className="custom-modal-overlay">

          <div className="custom-modal">

            <button
              className="cerrar-modal"
              onClick={cerrarModal}
            >
              ✕
            </button>

            {/* TARJETA */}
            <div className="tarjeta-preview">

              <div className="chip"></div>

              <div className="numero-preview">

                {
                  numeroTarjeta ||
                  "•••• •••• •••• ••••"
                }

              </div>

              <div className="tarjeta-footer">

                <div>

                  <small>
                    Titular
                  </small>

                  <p>
                    {
                      nombreTitular ||
                      "NOMBRE"
                    }
                  </p>

                </div>

                <div>

                  <small>
                    Expira
                  </small>

                  <p>
                    {fecha || "MM/AA"}
                  </p>

                </div>

              </div>

            </div>

            <h5 className="modal-title">
              Información de Pago
            </h5>

            <form onSubmit={pagarTarjeta}>

              {/* NOMBRE */}
              <div className="input-field-custom">

                <label>
                  Nombre del titular
                </label>

                <input
                  type="text"
                  autoComplete="cc-name"
                  value={nombreTitular}
                  onChange={(e) =>
                    setNombreTitular(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

              {/* TARJETA */}
              <div className="input-field-custom">

                <label>
                  Número de tarjeta
                </label>

                <input
                  type="text"
                  autoComplete="cc-number"
                  maxLength="19"
                  value={numeroTarjeta}
                  onChange={(e) =>
                    setNumeroTarjeta(
                      formatearTarjeta(
                        e.target.value
                      )
                    )
                  }
                  required
                />

              </div>

              {/* FECHA + CVV */}
              <div className="row-custom">

                <div className="input-field-custom">

                  <label>
                    Fecha
                  </label>

                  <input
                    type="text"
                    autoComplete="cc-exp"
                    placeholder="MM/AA"
                    maxLength="5"
                    value={fecha}
                    onChange={(e) =>
                      setFecha(
                        formatearFecha(
                          e.target.value
                        )
                      )
                    }
                    required
                  />

                </div>

                <div className="input-field-custom">

                  <label>
                    CVV
                  </label>

                  <input
                    type="password"
                    autoComplete="cc-csc"
                    maxLength="3"
                    value={cvv}
                    onChange={(e) =>
                      setCvv(
                        e.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                    required
                  />

                </div>

              </div>

              <button
                type="submit"
                className="btn-confirmar"
                disabled={cargando}
              >
                {
                  cargando
                    ? "Procesando Pago..."
                    : "Confirmar Pago"
                }
              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}