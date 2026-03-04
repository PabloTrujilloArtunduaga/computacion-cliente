import React, { useContext, useState, useEffect } from "react";
import { CarritoContext } from "../context/CarritoContext";
import "../styles/Carrito.css";

export default function Carrito() {
  const { carrito, setCarrito, total, setTotal } = useContext(CarritoContext);
  const [modalPago, setModalPago] = useState(null);

  useEffect(() => {
    const elems = document.querySelectorAll(".modal");
    const instances = M.Modal.init(elems);
    setModalPago(instances[0]);
  }, []);

  const actualizarCantidad = (index, delta) => {
    const newCarrito = [...carrito];
    newCarrito[index].cantidad += delta;
    if (newCarrito[index].cantidad < 1) newCarrito[index].cantidad = 1;

    setCarrito(newCarrito);
    setTotal(newCarrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0));
  };

  const eliminarProducto = (index) => {
    const nuevoCarrito = carrito.filter((_, i) => i !== index);
    setCarrito(nuevoCarrito);
    setTotal(nuevoCarrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0));
    M.toast({ html: "🗑️ Producto eliminado", classes: "red darken-1" });
  };

  const pagarTarjeta = (e) => {
    e.preventDefault();
    modalPago.close();
    M.toast({ html: "✅ Pago aprobado. ¡Gracias por tu compra!", classes: "green darken-2" });

    setTimeout(() => {
      setCarrito([]);
      setTotal(0);
    }, 1200);
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

                <img src={item.imagen} alt={item.nombre} className="carrito-img" />

                <div className="carrito-info">
                  <h6>{item.nombre}</h6>
                  <p className="precio-text">${item.precio.toLocaleString()}</p>

                  <div className="cantidad-controles">
                    <button className="btn-floating btn-small waves-effect btn-cantidad"
                      onClick={() => actualizarCantidad(index, -1)}>
                      <i className="material-icons">-</i>
                    </button>

                    <span className="cantidad">{item.cantidad}</span>

                    <button className="btn-floating btn-small waves-effect btn-cantidad"
                      onClick={() => actualizarCantidad(index, 1)}>
                      <i className="material-icons">+</i>
                    </button>
                  </div>
                </div>

                <button className="btn-floating waves-effect red lighten-1 btn-eliminar"
                  onClick={() => eliminarProducto(index)}>
                  <i className="material-icons">X</i>
                </button>

              </li>
            ))}
          </ul>

          <h5 className="total center">Total: <b>${total.toLocaleString()}</b></h5>

          <div className="center">
            <button className="btn-large waves-effect waves-light btn-pagar" onClick={() => modalPago.open()}>
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
              <label htmlFor="nombre">Nombre del titular: </label>
            </div>

            <div className="input-field">
              <input id="tarjeta" type="text" maxLength="16" required />
              <label htmlFor="tarjeta">Número de tarjeta: </label>
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

            <button type="submit" className="btn btn-confirmar waves-effect">
              Confirmar Pago
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
