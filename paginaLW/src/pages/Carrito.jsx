import React, { useContext, useState, useEffect } from "react";
import { CarritoContext } from "../context/CarritoContext";
import "../styles/Carrito.css";

export default function Carrito() {
  const { carrito, setCarrito, total, setTotal } = useContext(CarritoContext);
  const [modalPago, setModalPago] = useState(null);
  const [procesandoPago, setProcesandoPago] = useState(false);

  useEffect(() => {
    const elems = document.querySelectorAll(".modal");
    const instances = M.Modal.init(elems);

    if (instances.length > 0) {
      setModalPago(instances[0]);
    }
  }, []);

  const actualizarCantidad = (index, delta) => {
    const newCarrito = [...carrito];

    newCarrito[index].cantidad += delta;

    if (newCarrito[index].cantidad < 1) {
      newCarrito[index].cantidad = 1;
    }

    setCarrito(newCarrito);

    setTotal(
      newCarrito.reduce(
        (acc, item) => acc + item.precio * item.cantidad,
        0
      )
    );
  };

  const eliminarProducto = (index) => {
    const nuevoCarrito = carrito.filter((_, i) => i !== index);

    setCarrito(nuevoCarrito);

    setTotal(
      nuevoCarrito.reduce(
        (acc, item) => acc + item.precio * item.cantidad,
        0
      )
    );

    M.toast({
      html: "Producto eliminado",
      classes: "red darken-1"
    });
  };

  const abrirModalPago = () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const token = localStorage.getItem("token");

    if (!usuario || !token) {
      M.toast({
        html: "Debe estar registrado para comprar.",
        classes: "red darken-2"
      });
      return;
    }

    if (carrito.length === 0) {
      M.toast({
        html: "El carrito está vacío.",
        classes: "red darken-1"
      });
      return;
    }

    if (modalPago) {
      modalPago.open();
    }
  };

  const pagarTarjeta = async (e) => {
    e.preventDefault();

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const token = localStorage.getItem("token");

    if (!usuario || !token) {
      M.toast({
        html: "Debe estar registrado para comprar.",
        classes: "red darken-2"
      });
      return;
    }

    if (carrito.length === 0) {
      M.toast({
        html: "El carrito está vacío.",
        classes: "red darken-1"
      });
      return;
    }

    try {
      setProcesandoPago(true);

      const productosFactura = carrito.map((item) => ({
        producto_id: item._id || item.id || item.producto_id,
        cantidad: item.cantidad
      }));

      const res = await fetch("http://localhost:3000/api/facturas/virtual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          metodo_pago: "TARJETA",
          productos: productosFactura
        })
      });

      const data = await res.json();

      if (res.ok) {
        if (modalPago) {
          modalPago.close();
        }

        M.toast({
          html: "Pago procesado. Pedido creado y pendiente de validación.",
          classes: "green darken-2"
        });

        setCarrito([]);
        setTotal(0);

        setTimeout(() => {
          window.location.href = "/cliente";
        }, 1200);
      } else {
        M.toast({
          html: data.mensaje || "No se pudo generar la factura.",
          classes: "red darken-2"
        });
      }
    } catch (error) {
      console.error(error);

      M.toast({
        html: "Error al conectar con el servidor.",
        classes: "red darken-2"
      });
    } finally {
      setProcesandoPago(false);
    }
  };

  return (
    <div className="container carrito-section">
      <h4 className="titulo-carrito">🛒 Tu Carrito</h4>
      <div className="divider"></div>

      {carrito.length === 0 ? (
        <p className="center vacio">Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="carrito-lista">
            {carrito.map((item, index) => (
              <li key={index} className="carrito-item z-depth-1">
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="carrito-img"
                />

                <div className="carrito-info">
                  <h6>{item.nombre}</h6>

                  <p className="precio-text">
                    ${Number(item.precio).toLocaleString()}
                  </p>

                  <div className="cantidad-controles">
                    <button
                      className="btn-floating btn-small waves-effect btn-cantidad"
                      onClick={() => actualizarCantidad(index, -1)}
                    >
                      <i className="material-icons">remove</i>
                    </button>

                    <span className="cantidad">{item.cantidad}</span>

                    <button
                      className="btn-floating btn-small waves-effect btn-cantidad"
                      onClick={() => actualizarCantidad(index, 1)}
                    >
                      <i className="material-icons">add</i>
                    </button>
                  </div>
                </div>

                <button
                  className="btn-floating waves-effect red lighten-1 btn-eliminar"
                  onClick={() => eliminarProducto(index)}
                >
                  <i className="material-icons">close</i>
                </button>
              </li>
            ))}
          </ul>

          <h5 className="total center">
            Total: <b>${Number(total).toLocaleString()}</b>
          </h5>

          <div className="center">
            <button
              className="btn-large waves-effect waves-light btn-pagar"
              onClick={abrirModalPago}
              disabled={procesandoPago}
            >
              Pagar con Tarjeta
            </button>
          </div>
        </>
      )}

      {/* MODAL DE PAGO */}
      <div id="modalPago" className="modal">
        <div className="modal-content">
          <h5 className="modal-title">Pagar con tarjeta</h5>

          <form onSubmit={pagarTarjeta}>
            <div className="input-field">
              <input id="nombre" type="text" required />
              <label htmlFor="nombre">Nombre del titular:</label>
            </div>

            <div className="input-field">
              <input id="tarjeta" type="text" maxLength="16" required />
              <label htmlFor="tarjeta">Número de tarjeta:</label>
            </div>

            <div className="row">
              <div className="input-field col s6">
                <input id="fecha" type="text" placeholder="MM/AA" required />
              </div>

              <div className="input-field col s6">
                <input id="cvv" type="password" maxLength="3" required />
                <label htmlFor="cvv">CVV</label>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-confirmar waves-effect"
              disabled={procesandoPago}
            >
              {procesandoPago ? "Procesando..." : "Confirmar Pago"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}