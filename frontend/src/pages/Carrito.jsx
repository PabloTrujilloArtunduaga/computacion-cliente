import React, {
  useContext,
  useState
} from "react";

import { useNavigate } from "react-router-dom";
import M from "materialize-css";

import { CarritoContext } from "../context/CarritoContext";
import { API } from "../constants/api";

import "../styles/Carrito.css";

export default function Carrito() {

  const {
    carrito,
    total,
    actualizarCantidad,
    eliminarProducto,
    vaciarCarrito
  } = useContext(CarritoContext);

  const navigate = useNavigate();

  // =========================================
  // ESTADOS
  // =========================================
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
  // DEBUG GENERAL
  // =========================================
      
    
  // =========================================
  // ABRIR MODAL
  // =========================================
  const handlePagarClick = () => {

        
    const token =
      localStorage.getItem("token");

    const user =
      JSON.parse(
        localStorage.getItem("user")
      );

        
        
    if (!token) {

      
      M.toast({
        html: "⚠️ Debes iniciar sesión",
        classes: "orange darken-2"
      });

      navigate("/login");

      return;
    }

    if (!user) {

      
      M.toast({
        html: "⚠️ Usuario inválido",
        classes: "orange darken-2"
      });

      return;
    }

    if (carrito.length === 0) {

      
      M.toast({
        html: "⚠️ El carrito está vacío",
        classes: "orange darken-2"
      });

      return;
    }

    setMostrarModal(true);
  };

  // =========================================
  // CERRAR MODAL
  // =========================================
  const cerrarModal = () => {

    if (cargando) {

      
      return;
    }

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

    return `${limpio.slice(0, 2)}/${limpio.slice(2, 4)}`;
  };

  // =========================================
  // PAGAR
  // =========================================
  const pagarTarjeta = async (e) => {

    e.preventDefault();

        
    setCargando(true);

    try {

      // =====================================
      // TOKEN + USER
      // =====================================
      const token =
        localStorage.getItem("token");

      const user =
        JSON.parse(
          localStorage.getItem("user")
        );

            
            
      if (!token || !user || !user._id) {

        
        M.toast({
          html: "⚠️ Sesión inválida",
          classes: "orange darken-2"
        });

        navigate("/login");

        return;
      }

      // =====================================
      // VALIDAR CARRITO
      // =====================================
      if (!carrito || carrito.length === 0) {

        
        M.toast({
          html: "⚠️ No hay productos",
          classes: "orange darken-2"
        });

        return;
      }

      // =====================================
      // PAYLOAD PRODUCTOS
      // =====================================
      const productosPayload =
        carrito.map((item) => ({
          producto_id:
            item._id ||
            item.id ||
            item.producto_id,
          cantidad: Number(item.cantidad),
          // El backend recalcula el precio desde la base de datos.
          precio_unitario: Number(item.precio),
        }));

      // =====================================
      // BODY
      // =====================================
      const bodyData = {

        cliente_id: user._id,

        productos: productosPayload,

        // ✅ IMPORTANTE
        metodo_pago: "Tarjeta"
      };

                  
      // =====================================
      // FETCH
      // =====================================
      const res = await fetch(
        `${API}/facturas/cliente`,
        {
          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify(bodyData)
        }
      );

                  
      const data = await res.json();

                  
      // =====================================
      // ERROR BACKEND
      // =====================================
      if (!res.ok) {

        
        
        let mensaje =
          data.message ||
          "Error creando factura";

        if (data.error) {

                    
          // ZOD
          if (Array.isArray(data.error)) {

            mensaje =
              data.error
                .map(
                  (e) =>
                    `${e.field}: ${e.message}`
                )
                .join(" | ");
          }

          // MONGOOSE
          else if (
            typeof data.error === "string"
          ) {

            mensaje = data.error;
          }
        }

        M.toast({
          html: `❌ ${mensaje}`,
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

      // =====================================
      // LIMPIAR FORM
      // =====================================
      setNombreTitular("");

      setNumeroTarjeta("");

      setFecha("");

      setCvv("");

      // =====================================
      // LIMPIAR CARRITO
      // =====================================
      vaciarCarrito();

      
      // =====================================
      // CERRAR MODAL
      // =====================================
      setMostrarModal(false);

      // =====================================
      // REDIRIGIR
      // =====================================
      navigate("/productos");

    } catch (error) {

            
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

      {
        carrito.length === 0
          ? (

            <p className="center vacio">
              Tu carrito está vacío.
            </p>

          )
          : (

            <>

              <ul className="carrito-lista">

                {
                  carrito.map((item) => (

                    <li
                      key={item._id}
                      className="carrito-item"
                    >

                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="carrito-img"
                      />

                      <div className="carrito-info">

                        <h6>
                          {item.nombre}
                        </h6>

                        <p className="precio-text">

                          $
                          {
                            Number(
                              item.precio
                            ).toLocaleString()
                          }

                        </p>

                        <div className="cantidad-controles">

                          {/* RESTAR */}
                          <button
                            className="btn-floating btn-small btn-cantidad"
                            onClick={() =>
                              actualizarCantidad(
                                item._id,
                                -1
                              )
                            }
                          >

                            <i className="material-icons">
                              remove
                            </i>

                          </button>

                          <span className="cantidad">

                            {item.cantidad}

                          </span>

                          {/* SUMAR */}
                          <button
                            className="btn-floating btn-small btn-cantidad"
                            onClick={() =>
                              actualizarCantidad(
                                item._id,
                                1
                              )
                            }
                          >

                            <i className="material-icons">
                              add
                            </i>

                          </button>

                        </div>

                      </div>

                      {/* ELIMINAR */}
                      <button
                        className="btn-floating red lighten-1 btn-eliminar"
                        onClick={() =>
                          eliminarProducto(
                            item._id
                          )
                        }
                      >

                        <i className="material-icons">
                          delete
                        </i>

                      </button>

                    </li>

                  ))
                }

              </ul>

              <h5 className="total center">

                Total:

                <b>
                  $
                  {
                    Number(total)
                      .toLocaleString()
                  }
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

          )
      }

      {/* =====================================
          MODAL
      ===================================== */}
      {
        mostrarModal && (

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

        )
      }

    </div>
  );
}