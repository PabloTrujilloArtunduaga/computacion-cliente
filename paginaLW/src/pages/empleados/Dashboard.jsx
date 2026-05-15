// =====================================================
// EMPLEADO DASHBOARD COMPLETO Y CORREGIDO
// CRUD FACTURAS + VER FACTURA
// DISEÑO COMPATIBLE CON Dashboard.css
// =====================================================

import React, {
  useState,
  useEffect
} from "react";

import M from "materialize-css";

import "../../styles/Dashboard.css";

export default function EmpleadoDashboard() {

  // =====================================================
  // DEBUG
  // =====================================================

  const DEBUG = true;

  const debug = (titulo, data = null) => {
    if (!DEBUG) return;
    console.log(`%c${titulo}`, "color:#d4af37;font-weight:bold;");
    if (data) console.log(data);
  };

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

  const [metodoPago,
    setMetodoPago] =
    useState("Efectivo");

  const [estado,
    setEstado] =
    useState("pagada");

  const [cargando,
    setCargando] =
    useState(false);

  const [editando,
    setEditando] =
    useState(false);

  const [facturaEditandoId,
    setFacturaEditandoId] =
    useState(null);

  const [facturaVista,
    setFacturaVista] =
    useState(null);

  // =====================================================
  // STORAGE
  // =====================================================

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

    debug("INIT DASHBOARD");

    // MODALS SOLAMENTE
    const elems =
      document.querySelectorAll(".modal");

    M.Modal.init(elems, {
      onOpenStart: () => {
        // Destruir Select de Materialize al abrir modal
        // para que React controle los browser-default
        document
          .querySelectorAll(
            "select:not(.browser-default)"
          )
          .forEach(el => {
            const inst =
              M.FormSelect.getInstance(el);
            if (inst) inst.destroy();
          });
      }
    });

    // Destruir selects globales al montar
    document
      .querySelectorAll(
        "select:not(.browser-default)"
      )
      .forEach(el => {
        const inst =
          M.FormSelect.getInstance(el);
        if (inst) inst.destroy();
      });

    if (!user) {

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

        debug("CARGANDO FACTURAS...");

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

        debug("FACTURAS RESPONSE", data);

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

        console.error(error);

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

        debug("CARGANDO PRODUCTOS...");

        const res =
          await fetch(
            "http://localhost:3000/api/products"
          );

        const data =
          await res.json();

        debug("PRODUCTOS RESPONSE", data);

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

        console.error(error);

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

        debug("CARGANDO CLIENTES...");

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

        debug("CLIENTES RESPONSE", data);

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

        console.error(error);

        M.toast({
          html:
            "Error cargando clientes"
        });
      }
    };

  // =====================================================
  // AGREGAR AL CARRITO
  // =====================================================

  const agregarAlCarrito =
    () => {

      debug("AGREGAR PRODUCTO", { productoSeleccionado, cantidad });

      if (!productoSeleccionado) {

        M.toast({
          html:
            "Selecciona un producto"
        });

        return;
      }

      const producto =
        productos.find(
          p =>
            p._id ===
            productoSeleccionado
        );

      debug("PRODUCTO ENCONTRADO", producto);

      if (!producto) {

        M.toast({
          html:
            "Producto no encontrado"
        });

        return;
      }

      const cantidadNumero =
        Number(cantidad);

      if (cantidadNumero <= 0) {

        M.toast({
          html:
            "Cantidad inválida"
        });

        return;
      }

      if (cantidadNumero > producto.stock) {

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

        const actualizado =
          carrito.map(item => {

            if (item._id === producto._id) {

              const nuevaCantidad =
                item.cantidad +
                cantidadNumero;

              return {

                ...item,

                cantidad:
                  nuevaCantidad,

                subtotal:
                  nuevaCantidad *
                  item.precio
              };
            }

            return item;
          });

        setCarrito(actualizado);

      } else {

        setCarrito([
          ...carrito,
          {
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
          }
        ]);
      }

      setProductoSeleccionado("");

      setCantidad(1);

      M.toast({
        html:
          "Producto agregado"
      });
    };

  // =====================================================
  // ELIMINAR CARRITO
  // =====================================================

  const eliminarDelCarrito =
    id => {

      const nuevo =
        carrito.filter(
          item =>
            item._id !== id
        );

      setCarrito(nuevo);
    };

  // =====================================================
  // TOTAL
  // =====================================================

  const calcularTotal =
    () => {

      return carrito.reduce(
        (acc, item) =>
          acc +
          Number(item.subtotal),
        0
      );
    };

  // =====================================================
  // RESET
  // =====================================================

  const resetFormulario =
    () => {

      debug("RESET FORMULARIO");

      setCarrito([]);

      setClienteId("");

      setCantidad(1);

      setMetodoPago(
        "Efectivo"
      );

      setEstado(
        "pagada"
      );

      setProductoSeleccionado("");

      setEditando(false);

      setFacturaEditandoId(null);
    };

  // =====================================================
  // GUARDAR
  // =====================================================

  const guardarFactura =
    async () => {

      try {

        if (carrito.length === 0) {

          M.toast({
            html:
              "Agrega productos"
          });

          return;
        }

        if (!clienteId) {

          M.toast({
            html:
              "Selecciona cliente"
          });

          return;
        }

        setCargando(true);

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

        const payload = {

          cliente_id:
            clienteId,

          empleado_id:
            user._id,

          productos:
            productosPayload,

          total:
            calcularTotal(),

          metodo_pago:
            metodoPago,

          estado
        };

        debug("PAYLOAD FACTURA", payload);

        let res;

        if (editando) {

          res =
            await fetch(
              `http://localhost:3000/api/facturas/${facturaEditandoId}`,
              {
                method: "PUT",

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

        } else {

          res =
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
        }

        const data =
          await res.json();

        debug("RESPUESTA FACTURA", data);

        if (!res.ok) {

          M.toast({
            html:
              data.message ||
              "Error guardando factura"
          });

          return;
        }

        M.toast({
          html:
            editando
              ? "Factura actualizada"
              : "Factura creada"
        });

        resetFormulario();

        const modal =
          M.Modal.getInstance(
            document.getElementById(
              "modalFactura"
            )
          );

        modal?.close();

        cargarFacturas();

      } catch (error) {

        console.error(error);

        M.toast({
          html:
            "Error guardando factura"
        });

      } finally {

        setCargando(false);
      }
    };

  // =====================================================
  // EDITAR
  // =====================================================

  const editarFactura =
    factura => {

      debug("EDITAR FACTURA", factura);

      setEditando(true);

      setFacturaEditandoId(
        factura._id
      );

      setClienteId(
        factura?.cliente_id?._id || ""
      );

      setMetodoPago(
        factura.metodo_pago || "Efectivo"
      );

      setEstado(
        factura.estado || "pagada"
      );

      const carritoEditado =
        factura.productos.map(
          item => ({

            _id:
              item.producto_id?._id ||
              item.producto_id,

            nombre:
              item.nombre,

            precio:
              item.precio_unitario,

            cantidad:
              item.cantidad,

            subtotal:
              item.subtotal
          })
        );

      setCarrito(carritoEditado);

      const modal =
        M.Modal.getInstance(
          document.getElementById(
            "modalFactura"
          )
        );

      modal?.open();
    };

  // =====================================================
  // VER FACTURA
  // =====================================================

  const verFactura =
    factura => {

      setFacturaVista(factura);

      setTimeout(() => {

        const modal =
          M.Modal.getInstance(
            document.getElementById(
              "modalVerFactura"
            )
          );

        modal?.open();

      }, 100);
    };

  // =====================================================
  // ELIMINAR
  // =====================================================

  const eliminarFactura =
    async id => {

      try {

        const confirmar =
          window.confirm(
            "¿Eliminar factura?"
          );

        if (!confirmar) {
          return;
        }

        const res =
          await fetch(
            `http://localhost:3000/api/facturas/${id}`,
            {
              method: "DELETE",

              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        const data =
          await res.json();

        debug("DELETE RESPONSE", data);

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

        console.error(error);

        M.toast({
          html:
            "Error eliminando factura"
        });
      }
    };

  // =====================================================
  // BADGE
  // =====================================================

  const obtenerClaseEstado =
    estado => {

      switch (estado) {

        case "pagada":
          return "badge-pagada";

        case "pendiente":
          return "badge-pendiente";

        case "cancelada":
          return "badge-cancelada";

        default:
          return "badge-default";
      }
    };

  // =====================================================
  // JSX
  // =====================================================

  return (

    <div className="emp-root">

      {/* SIDEBAR */}

      <aside className="emp-sidebar">

        <div className="emp-sidebar__logo">

          <span className="material-icons">
            point_of_sale
          </span>

          EMPLEADO

        </div>

        <div className="emp-sidebar__nav">

          <a
            href="#!"
            className="
              emp-sidebar__link
              active
            "
          >

            <span className="material-icons">
              receipt_long
            </span>

            Facturas

          </a>

        </div>

        <div className="emp-sidebar__user">

          <div className="emp-avatar">

            {
              empleado?.nombre?.charAt(0)
            }

          </div>

          <div className="emp-sidebar__user-info">

            <span className="emp-sidebar__user-name">
              {empleado?.nombre}
            </span>

            <span className="emp-sidebar__user-role">
              Empleado
            </span>

          </div>

        </div>

      </aside>

      {/* MAIN */}

      <main className="emp-main">

        {/* TOPBAR */}

        <div className="emp-topbar">

          <div>

            <h1 className="emp-page-title">
              Dashboard de Facturas
            </h1>

            <p className="emp-page-sub">
              Gestión completa de ventas
            </p>

          </div>

          {/* FIX: onClick puro, sin modal-trigger para evitar conflictos */}

          <button
            type="button"
            className="
              emp-btn
              emp-btn--primary
            "
            onClick={() => {

              resetFormulario();

              const modal =
                M.Modal.getInstance(
                  document.getElementById(
                    "modalFactura"
                  )
                );

              modal?.open();
            }}
          >

            <span className="material-icons">
              add
            </span>

            Nueva Factura

          </button>

        </div>

        <br />

        {/* KPIS */}

        <div className="emp-kpis">

          <div className="
            emp-kpi
            emp-kpi--blue
          ">

            <div className="emp-kpi__icon">

              <span className="material-icons">
                receipt
              </span>

            </div>

            <div className="emp-kpi__body">

              <span className="emp-kpi__label">
                Facturas
              </span>

              <span className="emp-kpi__value">
                {facturas.length}
              </span>

            </div>

          </div>

          <div className="
            emp-kpi
            emp-kpi--green
          ">

            <div className="emp-kpi__icon">

              <span className="material-icons">
                inventory_2
              </span>

            </div>

            <div className="emp-kpi__body">

              <span className="emp-kpi__label">
                Productos
              </span>

              <span className="emp-kpi__value">
                {productos.length}
              </span>

            </div>

          </div>

        </div>

        <br />

        {/* TABLA */}

        <div className="emp-card">

          <div className="emp-card__header">

            <h3 className="emp-card__title">
              Facturas Registradas
            </h3>

          </div>

          <div className="emp-table-wrap">

            <table className="emp-table">

              <thead>

                <tr>

                  <th>ID</th>

                  <th>Cliente</th>

                  <th>Total</th>

                  <th>Método</th>

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
                        className="emp-table__row"
                      >

                        <td>

                          <span className="emp-id">

                            #
                            {
                              factura._id.slice(-6)
                            }

                          </span>

                        </td>

                        <td>

                          <div className="emp-cliente-cell">

                            <div className="
                              emp-avatar
                              emp-avatar--sm
                            ">

                              {
                                factura
                                ?.cliente_id
                                ?.nombre
                                ?.charAt(0)
                              }

                            </div>

                            {
                              factura
                              ?.cliente_id
                              ?.nombre
                            }

                          </div>

                        </td>

                        <td className="emp-total-cell">

                          $
                          {factura.total}

                        </td>

                        <td>

                          <span className="emp-metodo">

                            {
                              factura.metodo_pago
                            }

                          </span>

                        </td>

                        <td>

                          <span className={`
                            emp-badge
                            ${obtenerClaseEstado(
                              factura.estado
                            )}
                          `}>

                            {
                              factura.estado
                            }

                          </span>

                        </td>

                        <td>

                          <div className="emp-actions">

                            <button
                              className="
                                emp-icon-btn
                                emp-icon-btn--view
                              "
                              onClick={() =>
                                verFactura(
                                  factura
                                )
                              }
                            >

                              <span className="material-icons">
                                visibility
                              </span>

                            </button>

                            <button
                              className="
                                emp-icon-btn
                                emp-icon-btn--edit
                              "
                              onClick={() =>
                                editarFactura(
                                  factura
                                )
                              }
                            >

                              <span className="material-icons">
                                edit
                              </span>

                            </button>

                            <button
                              className="
                                emp-icon-btn
                                emp-icon-btn--delete
                              "
                              onClick={() =>
                                eliminarFactura(
                                  factura._id
                                )
                              }
                            >

                              <span className="material-icons">
                                delete
                              </span>

                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )
                }

              </tbody>

            </table>

          </div>

        </div>

      </main>

      {/* ================================================= */}
      {/* MODAL CREAR / EDITAR */}
      {/* ================================================= */}

      <div
        id="modalFactura"
        className="
          modal
          emp-modal
          modal-fixed-footer
        "
      >

        <div className="
          modal-content
          emp-modal__content
        ">

          <div className="emp-modal__header">

            <div className="emp-modal__header-icon">

              <span className="material-icons">
                receipt_long
              </span>

            </div>

            <div>

              <h3>

                {
                  editando
                    ? "Editar Factura"
                    : "Nueva Factura"
                }

              </h3>

              <p>
                Gestión de productos y pagos
              </p>

            </div>

          </div>

          {/* CLIENTE */}

          <div className="emp-form-section">

            <label className="emp-label">

              <span className="material-icons">
                person
              </span>

              Cliente

            </label>

            {/* FIX: browser-default para que React controle el select */}

            <select
              className="
                browser-default
                emp-select
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

          <div className="emp-form-section">

            <label className="emp-label">

              <span className="material-icons">
                inventory_2
              </span>

              Productos

            </label>

            <div className="emp-producto-row">

              {/* FIX: browser-default para que React controle el select */}

              <select
                className="
                  browser-default
                  emp-select
                  emp-select--grow
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

                      </option>
                    )
                  )
                }

              </select>

              <input
                type="number"
                min="1"
                className="
                  emp-input
                  emp-input--qty
                "
                value={cantidad}
                onChange={e =>
                  setCantidad(
                    e.target.value
                  )
                }
              />

              <button
                type="button"
                className="
                  emp-btn
                  emp-btn--add
                "
                onClick={
                  agregarAlCarrito
                }
              >

                <span className="material-icons">
                  add
                </span>

              </button>

            </div>

          </div>

          {/* TABLA CARRITO */}

          <div className="emp-carrito-table-wrap">

            <table className="emp-carrito-table">

              <thead>

                <tr>

                  <th>Producto</th>

                  <th>Cantidad</th>

                  <th>Precio</th>

                  <th>Subtotal</th>

                  <th></th>

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
                          {item.nombre}
                        </td>

                        <td>
                          {item.cantidad}
                        </td>

                        <td>
                          ${item.precio}
                        </td>

                        <td>
                          ${item.subtotal}
                        </td>

                        <td>

                          <button
                            type="button"
                            className="
                              emp-icon-btn
                              emp-icon-btn--delete
                            "
                            onClick={() =>
                              eliminarDelCarrito(
                                item._id
                              )
                            }
                          >

                            <span className="material-icons">
                              close
                            </span>

                          </button>

                        </td>

                      </tr>
                    )
                  )
                }

              </tbody>

            </table>

          </div>

          {/* TOTAL */}

          <div className="emp-total-banner">

            <h5>
              TOTAL
            </h5>

            <strong>
              $
              {
                calcularTotal()
              }
            </strong>

          </div>

          {/* METODO + ESTADO */}

          <div className="emp-form-row">

            <div className="
              emp-form-section
              emp-form-section--half
            ">

              <label className="emp-label">
                Método de pago
              </label>

              {/* FIX: browser-default */}

              <select
                className="
                  browser-default
                  emp-select
                "
                value={metodoPago}
                onChange={e =>
                  setMetodoPago(
                    e.target.value
                  )
                }
              >

                <option value="Efectivo">
                  Efectivo
                </option>

                <option value="Tarjeta">
                  Tarjeta
                </option>

                <option value="Transferencia">
                  Transferencia
                </option>

              </select>

            </div>

            <div className="
              emp-form-section
              emp-form-section--half
            ">

              <label className="emp-label">
                Estado
              </label>

              {/* FIX: browser-default */}

              <select
                className="
                  browser-default
                  emp-select
                "
                value={estado}
                onChange={e =>
                  setEstado(
                    e.target.value
                  )
                }
              >

                <option value="pagada">
                  Pagada
                </option>

                <option value="pendiente">
                  Pendiente
                </option>

                <option value="cancelada">
                  Cancelada
                </option>

              </select>

            </div>

          </div>

        </div>

        {/* FOOTER */}

        <div className="
          modal-footer
          emp-modal__footer
        ">

          <button
            type="button"
            className="
              modal-close
              emp-btn
              emp-btn--ghost
            "
          >
            Cancelar
          </button>

          <button
            type="button"
            className="
              emp-btn
              emp-btn--primary
            "
            onClick={
              guardarFactura
            }
            disabled={cargando}
          >

            {
              cargando
                ? "Guardando..."
                : editando
                ? "Actualizar"
                : "Crear Factura"
            }

          </button>

        </div>

      </div>

      {/* ================================================= */}
      {/* MODAL VER FACTURA */}
      {/* ================================================= */}

      <div
        id="modalVerFactura"
        className="
          modal
          emp-modal
          emp-modal--view
        "
      >

        <div className="
          modal-content
          emp-modal__content
        ">

          {
            facturaVista && (
              <>

                <div className="emp-factura-header">

                  <div>

                    <div className="emp-factura-logo">

                      <span className="material-icons">
                        receipt_long
                      </span>

                      FACTURA

                    </div>

                    <p className="emp-factura-sub">
                      Sistema de ventas
                    </p>

                  </div>

                  <div className="emp-factura-header__right">

                    <span className="emp-factura-id">

                      #
                      {
                        facturaVista
                        ._id
                        .slice(-6)
                      }

                    </span>

                    <span className={`
                      emp-badge
                      ${obtenerClaseEstado(
                        facturaVista.estado
                      )}
                    `}>

                      {
                        facturaVista.estado
                      }

                    </span>

                  </div>

                </div>

                <div className="emp-factura-grid">

                  <div className="emp-factura-info-block">

                    <span className="emp-factura-info-label">
                      Cliente
                    </span>

                    <span className="emp-factura-info-value">

                      {
                        facturaVista
                        ?.cliente_id
                        ?.nombre
                      }

                    </span>

                  </div>

                  <div className="emp-factura-info-block">

                    <span className="emp-factura-info-label">
                      Método Pago
                    </span>

                    <span className="emp-factura-info-value">

                      {
                        facturaVista
                        .metodo_pago
                      }

                    </span>

                  </div>

                </div>

                <div className="emp-factura-section-title">

                  <span className="material-icons">
                    shopping_cart
                  </span>

                  Productos

                </div>

                <div className="emp-carrito-table-wrap">

                  <table className="emp-carrito-table">

                    <thead>

                      <tr>

                        <th>#</th>

                        <th>Producto</th>

                        <th>Cantidad</th>

                        <th>Precio</th>

                        <th>Subtotal</th>

                      </tr>

                    </thead>

                    <tbody>

                      {
                        facturaVista
                        .productos
                        .map(
                          (item, index) => (

                            <tr
                              key={index}
                            >

                              <td>
                                {
                                  index + 1
                                }
                              </td>

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
                                  item.precio_unitario
                                }
                              </td>

                              <td>
                                $
                                {
                                  item.subtotal
                                }
                              </td>

                            </tr>
                          )
                        )
                      }

                    </tbody>

                  </table>

                </div>

                <div className="
                  emp-total-banner
                  emp-total-banner--view
                ">

                  <div>

                    <span className="emp-total-banner__label">
                      Total Factura
                    </span>

                    <span className="emp-total-banner__total">

                      $
                      {
                        facturaVista.total
                      }

                    </span>

                  </div>

                </div>

              </>
            )
          }

        </div>

        {/* FIX: Botón de cierre para el modal Ver Factura */}

        <div className="
          modal-footer
          emp-modal__footer
        ">

          <button
            type="button"
            className="
              modal-close
              emp-btn
              emp-btn--ghost
            "
          >
            Cerrar
          </button>

        </div>

      </div>

    </div>
  );
}