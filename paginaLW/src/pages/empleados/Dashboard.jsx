// =====================================================
// DASHBOARD EMPLEADO CORREGIDO
// =====================================================

import React, {
  useState,
  useEffect
} from "react";

import M from "materialize-css";

import "../../styles/EmpleadoDashboard.css";

export default function EmpleadoDashboard() {

  // =====================================================
  // STATES
  // =====================================================

  const [facturas, setFacturas] =
    useState([]);

  const [productos, setProductos] =
    useState([]);

  const [clientes, setClientes] =
    useState([]);

  const [carrito, setCarrito] =
    useState([]);

  const [empleado, setEmpleado] =
    useState(null);

  const [productoSeleccionado,
    setProductoSeleccionado] =
    useState("");

  const [clienteId,
    setClienteId] =
    useState("");

  const [cantidad,
    setCantidad] =
    useState(1);

  // ✅ ENUM EXACTO DEL BACKEND/ZOD
  const [metodoPago,
    setMetodoPago] =
    useState("efectivo");

  const [cargando,
    setCargando] =
    useState(false);

  const token =
    localStorage.getItem("token");

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  // =====================================================
  // LOAD
  // =====================================================

  useEffect(() => {

    M.AutoInit();

    console.log(
      "🚀 DASHBOARD INICIADO"
    );

    console.log(
      "👤 USER STORAGE:",
      user
    );

    console.log(
      "🔑 TOKEN:",
      token
    );

    if (!user) {

      console.error(
        "❌ USER NO EXISTE EN LOCALSTORAGE"
      );

      M.toast({
        html:
          "Sesión inválida"
      });

      return;
    }

    setEmpleado(user);

    cargarFacturas();

    cargarProductos();

    cargarClientes();

  }, []);

  // =====================================================
  // FACTURAS
  // =====================================================

  const cargarFacturas =
    async () => {

      try {

        const res =
          await fetch(
            "http://localhost:3000/api/facturas",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        const data =
          await res.json();

        console.log(
          "✅ FACTURAS:",
          data
        );

        if (!Array.isArray(data)) {

          setFacturas([]);

          return;
        }

        const activas =
          data.filter(
            factura =>
              !factura.eliminado
          );

        setFacturas(activas);

      } catch (error) {

        console.error(
          "❌ ERROR FACTURAS:",
          error
        );

        M.toast({
          html:
            "Error cargando facturas"
        });
      }
    };

  // =====================================================
  // PRODUCTOS
  // =====================================================

  const cargarProductos =
    async () => {

      try {

        const res =
          await fetch(
            "http://localhost:3000/api/products"
          );

        const data =
          await res.json();

        console.log(
          "✅ PRODUCTOS:",
          data
        );

        if (!Array.isArray(data)) {
          return;
        }

        const activos =
          data.filter(
            producto =>
              producto.estado === true
          );

        setProductos(activos);

      } catch (error) {

        console.error(
          "❌ ERROR PRODUCTOS:",
          error
        );

        M.toast({
          html:
            "Error cargando productos"
        });
      }
    };

  // =====================================================
  // CLIENTES
  // =====================================================

  const cargarClientes =
    async () => {

      try {

        const res =
          await fetch(
            "http://localhost:3000/api/usuarios",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        const data =
          await res.json();

        console.log(
          "✅ CLIENTES:",
          data
        );

        if (!Array.isArray(data)) {
          return;
        }

        const filtrados =
          data.filter(
            usuario =>
              usuario.rol === "cliente"
          );

        setClientes(filtrados);

      } catch (error) {

        console.error(
          "❌ ERROR CLIENTES:",
          error
        );

        M.toast({
          html:
            "Error cargando clientes"
        });
      }
    };

  // =====================================================
  // AGREGAR CARRITO
  // =====================================================

  const agregarAlCarrito =
    () => {

      if (!productoSeleccionado) {

        M.toast({
          html:
            "Selecciona un producto"
        });

        return;
      }

      const producto =
        productos.find(
          producto =>
            producto._id ===
            productoSeleccionado
        );

      if (!producto) {

        M.toast({
          html:
            "Producto no encontrado"
        });

        return;
      }

      const cantidadNumero =
        Number(cantidad);

      if (
        isNaN(cantidadNumero)
      ) {

        M.toast({
          html:
            "Cantidad inválida"
        });

        return;
      }

      if (
        cantidadNumero <= 0
      ) {

        M.toast({
          html:
            "Cantidad inválida"
        });

        return;
      }

      if (
        cantidadNumero >
        producto.stock
      ) {

        M.toast({
          html:
            "Stock insuficiente"
        });

        return;
      }

      const existe =
        carrito.find(
          item =>
            item._id === producto._id
        );

      if (existe) {

        const nuevoCarrito =
          carrito.map(item => {

            if (
              item._id === producto._id
            ) {

              const nuevaCantidad =
                item.cantidad +
                cantidadNumero;

              return {

                ...item,

                cantidad:
                  nuevaCantidad,

                subtotal:
                  nuevaCantidad *
                  Number(producto.precio)
              };
            }

            return item;
          });

        setCarrito(nuevoCarrito);

      } else {

        const nuevoItem = {

          _id:
            producto._id,

          nombre:
            producto.nombre,

          precio:
            Number(producto.precio),

          cantidad:
            cantidadNumero,

          subtotal:
            cantidadNumero *
            Number(producto.precio)
        };

        setCarrito([
          ...carrito,
          nuevoItem
        ]);
      }

      M.toast({
        html:
          "Producto agregado"
      });

      setProductoSeleccionado("");

      setCantidad(1);
    };

  // =====================================================
  // ELIMINAR DEL CARRITO
  // =====================================================

  const eliminarDelCarrito =
    id => {

      const nuevo =
        carrito.filter(
          item =>
            item._id !== id
        );

      setCarrito(nuevo);

      M.toast({
        html:
          "Producto eliminado"
      });
    };

  // =====================================================
  // TOTAL
  // =====================================================

  const calcularTotal =
    () => {

      return carrito.reduce(
        (
          acumulador,
          item
        ) =>
          acumulador +
          Number(item.subtotal),
        0
      );
    };

  // =====================================================
  // CREAR FACTURA
  // =====================================================

  const guardarFactura =
    async () => {

      try {

        if (
          carrito.length === 0
        ) {

          M.toast({
            html:
              "Agrega productos"
          });

          return;
        }

        if (!clienteId) {

          M.toast({
            html:
              "Selecciona un cliente"
          });

          return;
        }

        if (!user?._id) {

          M.toast({
            html:
              "Empleado inválido"
          });

          return;
        }

        setCargando(true);

        // =================================================
        // PRODUCTOS PAYLOAD
        // =================================================

        const productosPayload =
          carrito.map(item => ({

            producto_id:
              item._id,

            nombre:
              item.nombre,

            cantidad:
              Number(item.cantidad),

            precio_unitario:
              Number(item.precio),

            subtotal:
              Number(item.subtotal)
          }));

        // =================================================
        // PAYLOAD FINAL
        // =================================================

        const payload = {

          cliente_id:
            clienteId,

          // ✅ EL BACKEND VALIDA CONTRA USUARIO
          empleado_id:
            user._id,

          productos:
            productosPayload,

          total:
            calcularTotal(),

          // ✅ DEBE SER MINUSCULA
          metodo_pago:
            metodoPago,

          estado:
            "pagada"
        };

        console.log(
          "📦 PAYLOAD:",
          payload
        );

        const res =
          await fetch(
            "http://localhost:3000/api/facturas",
            {
              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`
              },

              body:
                JSON.stringify(payload)
            }
          );

        console.log(
          "📡 STATUS:",
          res.status
        );

        const data =
          await res.json();

        console.log(
          "✅ RESPUESTA:",
          data
        );

        if (!res.ok) {

          console.error(
            "❌ ERROR BACKEND:",
            data
          );

          // ZOD ERRORS
          if (
            Array.isArray(data.error)
          ) {

            data.error.forEach(err => {

              console.error(err);

              M.toast({
                html:
                  `${err.field || ""} ${err.message || ""}`
              });
            });

          } else {

            M.toast({
              html:
                data.message ||
                "Error creando factura"
            });
          }

          return;
        }

        M.toast({
          html:
            "Factura creada correctamente"
        });

        // =================================================
        // RESET
        // =================================================

        setCarrito([]);

        setClienteId("");

        setCantidad(1);

        setMetodoPago(
          "efectivo"
        );

        setProductoSeleccionado("");

        // =================================================
        // CERRAR MODAL
        // =================================================

        const modal =
          M.Modal.getInstance(
            document.getElementById(
              "modalFactura"
            )
          );

        if (modal) {
          modal.close();
        }

        // =================================================
        // RECARGAR
        // =================================================

        cargarFacturas();

      } catch (error) {

        console.error(
          "❌ ERROR CREAR:",
          error
        );

        M.toast({
          html:
            "Error creando factura"
        });

      } finally {

        setCargando(false);
      }
    };

  // =====================================================
  // DELETE
  // =====================================================

  const eliminarFactura =
    async id => {

      try {

        const res =
          await fetch(
            `http://localhost:3000/api/facturas/${id}`,
            {
              method:
                "DELETE",

              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        const data =
          await res.json();

        if (!res.ok) {

          throw new Error(
            data.message
          );
        }

        M.toast({
          html:
            "Factura eliminada"
        });

        cargarFacturas();

      } catch (error) {

        console.error(
          "❌ ERROR DELETE:",
          error
        );

        M.toast({
          html:
            "Error eliminando factura"
        });
      }
    };

  // =====================================================
  // JSX
  // =====================================================

  return (

    <div className="dashboard-container">

      {/* HEADER */}

      <div className="header-dashboard">

        <div>

          <h4>
            Bienvenido,
            {" "}
            {empleado?.nombre}
          </h4>

          <p>
            Panel de empleado
          </p>

        </div>

        <a
          href="#modalFactura"
          className="
            btn
            amber
            darken-2
            modal-trigger
          "
        >
          Nueva Factura
        </a>

      </div>

      {/* KPIS */}

      <div className="row">

        <div className="col s12 m6">

          <div
            className="
              card-panel
              blue
              white-text
            "
          >

            <h5>
              Facturas
            </h5>

            <h3>
              {facturas.length}
            </h3>

          </div>

        </div>

        <div className="col s12 m6">

          <div
            className="
              card-panel
              green
              white-text
            "
          >

            <h5>
              Productos
            </h5>

            <h3>
              {productos.length}
            </h3>

          </div>

        </div>

      </div>

      {/* TABLA */}

      <div className="card">

        <div className="card-content">

          <span className="card-title">
            Facturas Registradas
          </span>

          <table
            className="
              striped
              responsive-table
            "
          >

            <thead>

              <tr>

                <th>ID</th>

                <th>Cliente</th>

                <th>Total</th>

                <th>Estado</th>

                <th>Acciones</th>

              </tr>

            </thead>

            <tbody>

              {
                facturas.map(
                  factura => (

                    <tr
                      key={
                        factura._id
                      }
                    >

                      <td>
                        {
                          factura._id.slice(-6)
                        }
                      </td>

                      <td>
                        {
                          factura
                          ?.cliente_id
                          ?.nombre
                        }
                      </td>

                      <td>
                        $
                        {
                          factura.total
                        }
                      </td>

                      <td>
                        {
                          factura.estado
                        }
                      </td>

                      <td>

                        <button
                          className="
                            btn
                            red
                          "
                          onClick={() =>
                            eliminarFactura(
                              factura._id
                            )
                          }
                        >

                          <i
                            className="
                              material-icons
                            "
                          >
                            delete
                          </i>

                        </button>

                      </td>

                    </tr>
                  )
                )
              }

            </tbody>

          </table>

        </div>

      </div>

      {/* MODAL */}

      <div
        id="modalFactura"
        className="
          modal
          modal-fixed-footer
        "
      >

        <div className="modal-content">

          <h4>
            Nueva Factura
          </h4>

          {/* CLIENTE */}

          <div className="input-field">

            <select
              className="
                browser-default
              "
              value={clienteId}
              onChange={e =>
                setClienteId(
                  e.target.value
                )
              }
            >

              <option value="">
                Selecciona cliente
              </option>

              {
                clientes.map(
                  cliente => (

                    <option
                      key={
                        cliente._id
                      }
                      value={
                        cliente._id
                      }
                    >

                      {
                        cliente.nombre
                      }

                    </option>
                  )
                )
              }

            </select>

          </div>

          {/* PRODUCTOS */}

          <div className="producto-box">

            <select
              className="
                browser-default
              "
              value={
                productoSeleccionado
              }
              onChange={e =>
                setProductoSeleccionado(
                  e.target.value
                )
              }
            >

              <option value="">
                Selecciona producto
              </option>

              {
                productos.map(
                  producto => (

                    <option
                      key={
                        producto._id
                      }
                      value={
                        producto._id
                      }
                    >

                      {
                        producto.nombre
                      }

                      {" | $"}

                      {
                        producto.precio
                      }

                      {" | Stock: "}

                      {
                        producto.stock
                      }

                    </option>
                  )
                )
              }

            </select>

            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={e =>
                setCantidad(
                  e.target.value
                )
              }
            />

            <button
              className="
                btn
                green
              "
              onClick={
                agregarAlCarrito
              }
            >
              Agregar
            </button>

          </div>

          {/* CARRITO */}

          <table className="striped">

            <thead>

              <tr>

                <th>
                  Producto
                </th>

                <th>
                  Cantidad
                </th>

                <th>
                  Precio
                </th>

                <th>
                  Subtotal
                </th>

                <th>
                  Acción
                </th>

              </tr>

            </thead>

            <tbody>

              {
                carrito.map(
                  item => (

                    <tr
                      key={
                        item._id
                      }
                    >

                      <td>
                        {
                          item.nombre
                        }
                      </td>

                      <td>
                        {
                          item.cantidad
                        }
                      </td>

                      <td>
                        $
                        {
                          item.precio
                        }
                      </td>

                      <td>
                        $
                        {
                          item.subtotal
                        }
                      </td>

                      <td>

                        <button
                          className="
                            btn
                            red
                          "
                          onClick={() =>
                            eliminarDelCarrito(
                              item._id
                            )
                          }
                        >
                          X
                        </button>

                      </td>

                    </tr>
                  )
                )
              }

            </tbody>

          </table>

          {/* TOTAL */}

          <div className="total-box">

            <h5>

              TOTAL:
              {" "}

              $
              {
                calcularTotal()
              }

            </h5>

          </div>

          {/* METODO PAGO */}

          <div className="input-field">

            <select
              className="
                browser-default
              "
              value={metodoPago}
              onChange={e =>
                setMetodoPago(
                  e.target.value
                )
              }
            >

              {/* VALORES EXACTOS DEL BACKEND */}

              <option value="Efectivo">
                Efectivo
              </option>

              <option value="Tarjeta">
                Tarjeta
              </option>

            </select>

          </div>

        </div>

        {/* FOOTER */}

        <div className="modal-footer">

          <button
            className="
              modal-close
              btn
              grey
            "
          >
            Cancelar
          </button>

          <button
            className="
              btn
              green
            "
            onClick={
              guardarFactura
            }
            disabled={cargando}
          >

            {
              cargando
                ? "Guardando..."
                : "Crear Factura"
            }

          </button>

        </div>

      </div>

    </div>
  );
}