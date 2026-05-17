// =====================================================
// EMPLEADO DASHBOARD COMPLETO Y REFACTORIZADO
// CRUD FACTURAS + VER FACTURA (LUXURY GOLD THEME)
// =====================================================
import React, { useState, useEffect } from "react";
import M from "materialize-css";
import "../../styles/Dashboard.css";

export default function EmpleadoDashboard() {
  // =====================================================
  // DEBUG SYSTEM
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
  const [facturas, setFacturas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [empleado, setEmpleado] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [estado, setEstado] = useState("pagada");
  const [cargando, setCargando] = useState(false);
  const [editando, setEditando] = useState(false);
  const [facturaEditandoId, setFacturaEditandoId] = useState(null);
  const [facturaVista, setFacturaVista] = useState(null);

  // =====================================================
  // STATES: BÚSQUEDA Y PAGINACIÓN
  // =====================================================
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const FACTURAS_POR_PAGINA = 5;

  // =====================================================
  // STORAGE
  // =====================================================
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // =====================================================
  // LIFECYCLE / INITIAL LOAD
  // =====================================================
  useEffect(() => {
    debug("INIT DASHBOARD");
    const elems = document.querySelectorAll(".modal");
    M.Modal.init(elems, {
      onOpenStart: () => {
        document.querySelectorAll("select:not(.browser-default)").forEach(el => {
          const inst = M.FormSelect.getInstance(el);
          if (inst) inst.destroy();
        });
      }
    });
    document.querySelectorAll("select:not(.browser-default)").forEach(el => {
      const inst = M.FormSelect.getInstance(el);
      if (inst) inst.destroy();
    });
    if (!user) {
      M.toast({ html: "Sesión inválida o expirada" });
      return;
    }
    setEmpleado(user);
    cargarFacturas();
    cargarProductos();
    cargarClientes();
  }, []);

  // =====================================================
  // LÓGICA DE FILTRADO Y PAGINACIÓN
  // =====================================================
  const facturasFiltradas = facturas.filter(factura =>
    (factura?.cliente_id?.nombre || "")
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(facturasFiltradas.length / FACTURAS_POR_PAGINA);

  const facturasPaginadas = facturasFiltradas.slice(
    (paginaActual - 1) * FACTURAS_POR_PAGINA,
    paginaActual * FACTURAS_POR_PAGINA
  );

  const handleBusqueda = e => {
    setBusqueda(e.target.value);
    setPaginaActual(1);
  };

  const limpiarBusqueda = () => {
    setBusqueda("");
    setPaginaActual(1);
  };

  // =====================================================
  // API OPERATIONS
  // =====================================================
  const cargarFacturas = async () => {
    try {
      debug("CARGANDO FACTURAS...");
      const res = await fetch("http://localhost:3000/api/facturas", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      debug("FACTURAS RESPONSE", data);
      if (!Array.isArray(data)) {
        setFacturas([]);
        return;
      }
      const activas = data.filter(factura => !factura.eliminado);
      setFacturas(activas);
    } catch (error) {
      console.error(error);
      M.toast({ html: "Error cargando facturas" });
    }
  };

  const cargarProductos = async () => {
    try {
      debug("CARGANDO PRODUCTOS...");
      const res = await fetch("http://localhost:3000/api/products");
      const data = await res.json();
      debug("PRODUCTOS RESPONSE", data);
      if (!Array.isArray(data)) return;
      const activos = data.filter(producto => producto.estado === true);
      setProductos(activos);
    } catch (error) {
      console.error(error);
      M.toast({ html: "Error cargando productos" });
    }
  };

  const cargarClientes = async () => {
    try {
      debug("CARGANDO CLIENTES...");
      const res = await fetch("http://localhost:3000/api/usuarios", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      debug("CLIENTES RESPONSE", data);
      if (!Array.isArray(data)) return;
      const filtrados = data.filter(usuario => usuario.rol === "cliente");
      setClientes(filtrados);
    } catch (error) {
      console.error(error);
      M.toast({ html: "Error cargando clientes" });
    }
  };

  // =====================================================
  // SHOPPING CART LOGIC
  // =====================================================
  const agregarAlCarrito = () => {
    debug("AGREGAR PRODUCTO", { productoSeleccionado, cantidad });
    if (!productoSeleccionado) {
      M.toast({ html: "Selecciona un producto válido" });
      return;
    }
    const producto = productos.find(p => p._id === productoSeleccionado);
    if (!producto) {
      M.toast({ html: "Producto no encontrado" });
      return;
    }
    const cantidadNumero = Number(cantidad);
    if (cantidadNumero <= 0) {
      M.toast({ html: "Cantidad inválida" });
      return;
    }
    if (cantidadNumero > producto.stock) {
      M.toast({ html: `Stock insuficiente (Disponible: ${producto.stock})` });
      return;
    }
    const existe = carrito.find(item => item._id === producto._id);
    if (existe) {
      const actualizado = carrito.map(item => {
        if (item._id === producto._id) {
          const nuevaCantidad = item.cantidad + cantidadNumero;
          return { ...item, cantidad: nuevaCantidad, subtotal: nuevaCantidad * item.precio };
        }
        return item;
      });
      setCarrito(actualizado);
    } else {
      setCarrito([
        ...carrito,
        {
          _id: producto._id,
          nombre: producto.nombre,
          precio: Number(producto.precio),
          cantidad: cantidadNumero,
          subtotal: cantidadNumero * Number(producto.precio)
        }
      ]);
    }
    setProductoSeleccionado("");
    setCantidad(1);
    M.toast({ html: "Producto añadido al carrito" });
  };

  const eliminarDelCarrito = id => {
    setCarrito(carrito.filter(item => item._id !== id));
  };

  const calcularTotal = () => {
    return carrito.reduce((acc, item) => acc + Number(item.subtotal), 0);
  };

  const resetFormulario = () => {
    setCarrito([]);
    setClienteId("");
    setCantidad(1);
    setMetodoPago("Efectivo");
    setEstado("pagada");
    setProductoSeleccionado("");
    setEditando(false);
    setFacturaEditandoId(null);
  };

  // =====================================================
  // ACTIONS (SAVE, EDIT, DELETE, VIEW)
  // =====================================================
  const guardarFactura = async () => {
    try {
      if (carrito.length === 0) {
        M.toast({ html: "El carrito no puede estar vacío" });
        return;
      }
      if (!clienteId) {
        M.toast({ html: "Por favor selecciona un cliente" });
        return;
      }
      setCargando(true);
      const productosPayload = carrito.map(item => ({
        producto_id: item._id,
        nombre: item.nombre,
        cantidad: Number(item.cantidad),
        precio_unitario: Number(item.precio),
        subtotal: Number(item.subtotal)
      }));
      const payload = {
        cliente_id: clienteId,
        empleado_id: user._id,
        productos: productosPayload,
        total: calcularTotal(),
        metodo_pago: metodoPago,
        estado
      };
      let res;
      if (editando) {
        res = await fetch(`http://localhost:3000/api/facturas/${facturaEditandoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch("http://localhost:3000/api/facturas", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
      }
      const data = await res.json();
      if (!res.ok) {
        M.toast({ html: data.message || "Ocurrió un error con la factura" });
        return;
      }
      M.toast({ html: editando ? "Factura actualizada con éxito" : "Factura generada con éxito" });
      resetFormulario();
      const modal = M.Modal.getInstance(document.getElementById("modalFactura"));
      modal?.close();
      cargarFacturas();
    } catch (error) {
      console.error(error);
      M.toast({ html: "Error de servidor al guardar la factura" });
    } finally {
      setCargando(false);
    }
  };

  const editarFactura = factura => {
    setEditando(true);
    setFacturaEditandoId(factura._id);
    setClienteId(factura?.cliente_id?._id || "");
    setMetodoPago(factura.metodo_pago || "Efectivo");
    setEstado(factura.estado || "pagada");
    const carritoEditado = factura.productos.map(item => ({
      _id: item.producto_id?._id || item.producto_id,
      nombre: item.nombre,
      precio: item.precio_unitario,
      cantidad: item.cantidad,
      subtotal: item.subtotal
    }));
    setCarrito(carritoEditado);
    const modal = M.Modal.getInstance(document.getElementById("modalFactura"));
    modal?.open();
  };

  const verFactura = factura => {
    setFacturaVista(factura);
    setTimeout(() => {
      const modal = M.Modal.getInstance(document.getElementById("modalVerFactura"));
      modal?.open();
    }, 50);
  };

  const eliminarFactura = async id => {
    try {
      const confirmar = window.confirm("¿Seguro que deseas eliminar esta factura de forma permanente?");
      if (!confirmar) return;
      const res = await fetch(`http://localhost:3000/api/facturas/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      M.toast({ html: "Factura eliminada correctamente" });
      cargarFacturas();
    } catch (error) {
      console.error(error);
      M.toast({ html: "No se pudo eliminar la factura" });
    }
  };

  const obtenerClaseEstado = estado => {
    switch (estado) {
      case "pagada":    return "badge-pagada";
      case "pendiente": return "badge-pendiente";
      case "cancelada": return "badge-cancelada";
      default:          return "badge-default";
    }
  };

  // =====================================================
  // RENDER JSX
  // =====================================================
  return (
    <div className="emp-root">

      {/* SIDEBAR */}
      <aside className="emp-sidebar">
        <div className="emp-sidebar__logo">
          <span className="material-icons">point_of_sale</span>
          EMPLEADO
        </div>
        <div className="emp-sidebar__nav">
          <a href="#!" className="emp-sidebar__link active">
            <span className="material-icons">receipt_long</span>
            Facturas
          </a>
        </div>
        <div className="emp-sidebar__user">
          <div className="emp-avatar">{empleado?.nombre?.charAt(0)}</div>
          <div className="emp-sidebar__user-info">
            <span className="emp-sidebar__user-name">{empleado?.nombre}</span>
            <span className="emp-sidebar__user-role">Empleado</span>
          </div>
        </div>
      </aside>

      {/* MAIN VIEW */}
      <main className="emp-main">

        {/* TOPBAR */}
        <div className="emp-topbar">
          <div>
            <h1 className="emp-page-title">Dashboard de Facturas</h1>
            <p className="emp-page-sub">Gestión completa de ventas de lujo</p>
          </div>
          <button
            type="button"
            className="emp-btn emp-btn--primary"
            onClick={() => {
              resetFormulario();
              const modal = M.Modal.getInstance(document.getElementById("modalFactura"));
              modal?.open();
            }}
          >
            <span className="material-icons">add</span>
            Nueva Factura
          </button>
        </div>

        {/* METRICS / KPIS */}
        <div className="emp-kpis">
          <div className="emp-kpi emp-kpi--blue">
            <div className="emp-kpi__icon">
              <span className="material-icons">receipt</span>
            </div>
            <div className="emp-kpi__body">
              <span className="emp-kpi__label">Facturas Emitidas</span>
              <span className="emp-kpi__value">{facturas.length}</span>
            </div>
          </div>
          <div className="emp-kpi emp-kpi--green">
            <div className="emp-kpi__icon">
              <span className="material-icons">inventory_2</span>
            </div>
            <div className="emp-kpi__body">
              <span className="emp-kpi__label">Productos Activos</span>
              <span className="emp-kpi__value">{productos.length}</span>
            </div>
          </div>
        </div>

        {/* MAIN DATA TABLE */}
        <div className="emp-card">

          {/* HEADER CON BUSCADOR */}
          <div
            className="emp-card__header"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px"
            }}
          >
            <h3 className="emp-card__title">Facturas Registradas</h3>

            {/* BUSCADOR POR NOMBRE DE CLIENTE */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "#f5f5f5",
                borderRadius: "8px",
                padding: "6px 14px",
                minWidth: "260px",
                border: "1px solid #e8e8e8"
              }}
            >
              <span className="material-icons" style={{ color: "#d4af37", fontSize: "20px" }}>
                search
              </span>
              <input
                type="text"
                placeholder="Buscar por cliente..."
                value={busqueda}
                onChange={handleBusqueda}
                style={{
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  fontSize: "14px",
                  width: "100%",
                  color: "#333"
                }}
              />
              {busqueda && (
                <button
                  onClick={limpiarBusqueda}
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <span className="material-icons" style={{ fontSize: "18px", color: "#999" }}>
                    close
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* TABLA */}
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
                {facturasPaginadas.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      style={{ textAlign: "center", padding: "40px 20px", color: "#999" }}
                    >
                      <span
                        className="material-icons"
                        style={{ fontSize: "40px", display: "block", marginBottom: "8px", color: "#d4af37", opacity: 0.5 }}
                      >
                        search_off
                      </span>
                      {busqueda
                        ? `No se encontraron facturas para "${busqueda}"`
                        : "No hay facturas registradas"}
                    </td>
                  </tr>
                ) : (
                  facturasPaginadas.map(factura => (
                    <tr key={factura._id} className="emp-table__row">
                      <td>
                        <span className="emp-id">#{factura._id.slice(-6)}</span>
                      </td>
                      <td>
                        <div className="emp-cliente-cell">
                          <div className="emp-avatar emp-avatar--sm">
                            {factura?.cliente_id?.nombre?.charAt(0) || "C"}
                          </div>
                          {factura?.cliente_id?.nombre || "Cliente Desconocido"}
                        </div>
                      </td>
                      <td className="emp-total-cell">${factura.total}</td>
                      <td>
                        <span className="emp-metodo">{factura.metodo_pago}</span>
                      </td>
                      <td>
                        <span className={`emp-badge ${obtenerClaseEstado(factura.estado)}`}>
                          {factura.estado}
                        </span>
                      </td>
                      <td>
                        <div className="emp-actions">
                          <button className="emp-icon-btn" onClick={() => verFactura(factura)}>
                            <span className="material-icons">visibility</span>
                          </button>
                          <button className="emp-icon-btn" onClick={() => editarFactura(factura)}>
                            <span className="material-icons">edit</span>
                          </button>
                          <button
                            className="emp-icon-btn emp-icon-btn--delete"
                            onClick={() => eliminarFactura(factura._id)}
                          >
                            <span className="material-icons">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* BARRA DE PAGINACIÓN — siempre visible */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 20px",
              borderTop: "1px solid #f0f0f0",
              flexWrap: "wrap",
              gap: "10px",
              background: "#fafafa",
              borderBottomLeftRadius: "12px",
              borderBottomRightRadius: "12px"
            }}
          >
            {/* CONTADOR */}
            <span style={{ fontSize: "13px", color: "#777" }}>
              {facturasFiltradas.length === 0 ? (
                "Sin resultados"
              ) : (
                <>
                  Mostrando{" "}
                  <strong style={{ color: "#333" }}>
                    {(paginaActual - 1) * FACTURAS_POR_PAGINA + 1}–
                    {Math.min(paginaActual * FACTURAS_POR_PAGINA, facturasFiltradas.length)}
                  </strong>{" "}
                  de <strong style={{ color: "#333" }}>{facturasFiltradas.length}</strong> facturas
                </>
              )}
            </span>

            {/* BOTONES DE PÁGINA */}
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>

              {/* ANTERIOR */}
              <button
                onClick={() => setPaginaActual(p => Math.max(p - 1, 1))}
                disabled={paginaActual === 1 || totalPaginas === 0}
                title="Página anterior"
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  padding: "6px 10px",
                  background: (paginaActual === 1 || totalPaginas === 0) ? "#f0f0f0" : "#fff",
                  cursor: (paginaActual === 1 || totalPaginas === 0) ? "not-allowed" : "pointer",
                  color: (paginaActual === 1 || totalPaginas === 0) ? "#bbb" : "#333",
                  display: "flex",
                  alignItems: "center",
                  transition: "all 0.15s ease"
                }}
              >
                <span className="material-icons" style={{ fontSize: "18px" }}>chevron_left</span>
              </button>

              {/* NÚMEROS DE PÁGINA — mínimo muestra página 1 aunque no haya datos */}
              {(totalPaginas === 0 ? [1] : Array.from({ length: totalPaginas }, (_, i) => i + 1)).map(num => (
                <button
                  key={num}
                  onClick={() => setPaginaActual(num)}
                  disabled={totalPaginas === 0}
                  style={{
                    border: "1px solid",
                    borderColor: paginaActual === num ? "#d4af37" : "#e0e0e0",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    background: paginaActual === num ? "#d4af37" : "#fff",
                    color: paginaActual === num ? "#fff" : "#555",
                    fontWeight: paginaActual === num ? "700" : "400",
                    cursor: totalPaginas === 0 ? "default" : "pointer",
                    minWidth: "36px",
                    fontSize: "13px",
                    transition: "all 0.15s ease",
                    boxShadow: paginaActual === num ? "0 2px 6px rgba(212,175,55,0.35)" : "none"
                  }}
                >
                  {num}
                </button>
              ))}

              {/* SIGUIENTE */}
              <button
                onClick={() => setPaginaActual(p => Math.min(p + 1, totalPaginas))}
                disabled={paginaActual === totalPaginas || totalPaginas === 0}
                title="Página siguiente"
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  padding: "6px 10px",
                  background: (paginaActual === totalPaginas || totalPaginas === 0) ? "#f0f0f0" : "#fff",
                  cursor: (paginaActual === totalPaginas || totalPaginas === 0) ? "not-allowed" : "pointer",
                  color: (paginaActual === totalPaginas || totalPaginas === 0) ? "#bbb" : "#333",
                  display: "flex",
                  alignItems: "center",
                  transition: "all 0.15s ease"
                }}
              >
                <span className="material-icons" style={{ fontSize: "18px" }}>chevron_right</span>
              </button>

            </div>
          </div>

        </div>
      </main>

      {/* ================================================= */}
      {/* MODAL: CREAR / EDITAR FACTURA                     */}
      {/* ================================================= */}
      <div id="modalFactura" className="modal emp-modal modal-fixed-footer">
        <div className="modal-content emp-modal__content">
          <div className="emp-modal__header">
            <div className="emp-modal__header-icon">
              <span className="material-icons">receipt_long</span>
            </div>
            <div>
              <h3>{editando ? "Editar Registro" : "Nueva Factura Real"}</h3>
              <p>Control riguroso de productos y pasarelas de pago</p>
            </div>
          </div>

          {/* Selección de Cliente */}
          <div className="emp-form-section">
            <label className="emp-label">
              <span className="material-icons">person</span> Cliente Asignado
            </label>
            <select
              className="browser-default emp-select"
              value={clienteId}
              onChange={e => setClienteId(e.target.value)}
            >
              <option value="">Selecciona un cliente de la lista</option>
              {clientes.map(cliente => (
                <option key={cliente._id} value={cliente._id}>{cliente.nombre}</option>
              ))}
            </select>
          </div>

          {/* Adición de Productos */}
          <div className="emp-form-section">
            <label className="emp-label">
              <span className="material-icons">inventory_2</span> Catálogo de Productos
            </label>
            <div className="emp-producto-row">
              <select
                className="browser-default emp-select emp-select--grow"
                value={productoSeleccionado}
                onChange={e => setProductoSeleccionado(e.target.value)}
              >
                <option value="">Escoge un producto premium...</option>
                {productos.map(producto => (
                  <option key={producto._id} value={producto._id}>
                    {producto.nombre} — (${producto.precio})
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                className="emp-input emp-input--qty"
                value={cantidad}
                onChange={e => setCantidad(e.target.value)}
              />
              <button type="button" className="emp-btn emp-btn--add" onClick={agregarAlCarrito}>
                <span className="material-icons">add</span>
              </button>
            </div>
          </div>

          {/* Preview del Carrito */}
          <div className="emp-form-section">
            <label className="emp-label">Productos en Orden Actual</label>
            <div className="emp-products-preview">
              {carrito.length === 0 ? (
                <div className="emp-empty-products">
                  <span className="material-icons">shopping_bag</span>
                  <p>No se han agregado productos a la orden todavía.</p>
                </div>
              ) : (
                carrito.map(item => (
                  <div className="emp-product-card" key={item._id}>
                    <div className="emp-product-card__left">
                      <div className="emp-product-card__image">
                        <span className="material-icons" style={{ color: "#d4af37" }}>diamond</span>
                      </div>
                      <div>
                        <h5>{item.nombre}</h5>
                        <p>Precio Unitario: ${item.precio}</p>
                      </div>
                    </div>
                    <div className="emp-product-card__right">
                      <span>x{item.cantidad}</span>
                      <strong>${item.subtotal}</strong>
                      <button
                        type="button"
                        className="emp-icon-btn emp-icon-btn--delete"
                        onClick={() => eliminarDelCarrito(item._id)}
                      >
                        <span className="material-icons">close</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Banner de Total */}
          <div className="emp-total-banner">
            <h5>TOTAL LIQUIDADO</h5>
            <strong>${calcularTotal()}</strong>
          </div>

          {/* Método de Pago y Estado */}
          <div className="emp-form-row" style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
            <div className="emp-form-section" style={{ flex: 1 }}>
              <label className="emp-label">Método de Pago</label>
              <select
                className="browser-default emp-select"
                value={metodoPago}
                onChange={e => setMetodoPago(e.target.value)}
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta de Crédito / Débito</option>
                <option value="Transferencia">Transferencia Bancaria</option>
              </select>
            </div>
            <div className="emp-form-section" style={{ flex: 1 }}>
              <label className="emp-label">Estado del Pago</label>
              <select
                className="browser-default emp-select"
                value={estado}
                onChange={e => setEstado(e.target.value)}
              >
                <option value="pagada">Pagada (Completado)</option>
                <option value="pendiente">Pendiente (Por cobrar)</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          </div>
        </div>

        <div className="modal-footer emp-modal__footer">
          <button
            type="button"
            className="modal-close emp-btn emp-btn--ghost"
            onClick={resetFormulario}
          >
            Cerrar Ventana
          </button>
          <button
            type="button"
            className="emp-btn emp-btn--primary"
            onClick={guardarFactura}
            disabled={cargando}
          >
            {cargando ? "Procesando..." : "Guardar Factura"}
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* MODAL: VER DETALLE DE FACTURA EXPEDIDA            */}
      {/* ================================================= */}
      <div id="modalVerFactura" className="modal emp-modal modal-fixed-footer">
        <div className="modal-content emp-modal__content">
          <div className="emp-modal__header">
            <div className="emp-modal__header-icon">
              <span className="material-icons">visibility</span>
            </div>
            <div>
              <h3>Resumen Analítico de Venta</h3>
              <p>Historial inalterable de la transacción comercial</p>
            </div>
          </div>

          {facturaVista && (
            <div className="emp-factura-detalle">
              <p style={{ marginBottom: "10px" }}>
                <strong>ID de Operación:</strong> #{facturaVista._id}
              </p>
              <p style={{ marginBottom: "10px" }}>
                <strong>Cliente Registrado:</strong> {facturaVista.cliente_id?.nombre || "N/A"}
              </p>
              <p style={{ marginBottom: "10px" }}>
                <strong>Pasarela/Método:</strong> {facturaVista.metodo_pago}
              </p>
              <p style={{ marginBottom: "20px" }}>
                <strong>Estado de Auditoría:</strong>{" "}
                <span className={`emp-badge ${obtenerClaseEstado(facturaVista.estado)}`}>
                  {facturaVista.estado}
                </span>
              </p>

              <h4
                className="emp-card__title"
                style={{
                  fontSize: "1.1rem",
                  marginBottom: "12px",
                  borderBottom: "1px solid #e0e0e0",
                  paddingBottom: "6px"
                }}
              >
                Artículos Desglosados
              </h4>

              <div className="emp-products-preview">
                {facturaVista.productos?.map((prod, idx) => (
                  <div className="emp-product-card" key={idx}>
                    <div className="emp-product-card__left">
                      <div className="emp-product-card__image">
                        <span className="material-icons" style={{ color: "#111" }}>receipt</span>
                      </div>
                      <div>
                        <h5>{prod.nombre}</h5>
                        <p>Precio Unitario: ${prod.precio_unitario}</p>
                      </div>
                    </div>
                    <div className="emp-product-card__right">
                      <span>Cantidad: {prod.cantidad}</span>
                      <strong>${prod.subtotal}</strong>
                    </div>
                  </div>
                ))}
              </div>

              <div className="emp-total-banner" style={{ marginTop: "24px" }}>
                <h5>TOTAL NETO COBRADO</h5>
                <strong>${facturaVista.total}</strong>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer emp-modal__footer">
          <button type="button" className="modal-close emp-btn emp-btn--primary">
            Aceptar y Salir
          </button>
        </div>
      </div>

    </div>
  );
}