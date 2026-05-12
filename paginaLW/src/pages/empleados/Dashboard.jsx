import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../../styles/Dashboard.css';

export default function EmpleadoDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carrito, setCarrito] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [cargando, setCargando] = useState(false);

  const [empleado, setEmpleado]     = useState(null);
  const [facturas, setFacturas]     = useState([]);
  const [productos, setProductos]   = useState([]);
  const [clientes, setClientes]     = useState([]);
  const [clienteId, setClienteId]   = useState('');

  const token = localStorage.getItem("token");
  const user  = JSON.parse(localStorage.getItem("user"));

  // Cargar datos iniciales
  useEffect(() => {
    setEmpleado(user);
    cargarFacturas();
    cargarProductos();
    cargarClientes();
  }, []);

  const cargarFacturas = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/facturas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFacturas(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error facturas", e);
    }
  };

  const cargarProductos = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/productos");
      const data = await res.json();
      // Solo productos activos
      setProductos(Array.isArray(data) ? data.filter(p => p.estado) : []);
    } catch (e) {
      console.error("Error productos", e);
    }
  };

  const cargarClientes = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // Solo clientes
      setClientes(Array.isArray(data) ? data.filter(u => u.rol === "cliente") : []);
    } catch (e) {
      console.error("Error clientes", e);
    }
  };

  const agregarAlCarrito = () => {
    if (!productoSeleccionado) return;
    const producto = productos.find(p => p._id === productoSeleccionado);
    if (!producto) return;

    const existente = carrito.find(i => i._id === producto._id);
    if (existente) {
      setCarrito(carrito.map(i =>
        i._id === producto._id
          ? { ...i, cantidad: i.cantidad + parseInt(cantidad), subtotal: (i.cantidad + parseInt(cantidad)) * i.precio }
          : i
      ));
    } else {
      setCarrito([...carrito, {
        ...producto,
        cantidad: parseInt(cantidad),
        subtotal: producto.precio * parseInt(cantidad),
      }]);
    }
    setCantidad(1);
  };

  const calcularTotal = () => carrito.reduce((acc, i) => acc + i.subtotal, 0);

  const guardarFactura = async () => {
    if (carrito.length === 0) {
      alert("Agrega al menos un producto.");
      return;
    }
    if (!clienteId) {
      alert("Selecciona un cliente.");
      return;
    }

    setCargando(true);

    // El empleado necesita su empleado_id (no el usuario_id)
    // Lo guardamos en localStorage al hacer login si existe
    const empleadoId = localStorage.getItem("empleado_id");

    const productosPayload = carrito.map(item => ({
      producto_id: item._id,
      cantidad: item.cantidad,
      precio_unitario: item.precio,
    }));

    try {
      const res = await fetch("http://localhost:3000/api/facturas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cliente_id: clienteId,
          empleado_id: empleadoId,
          productos: productosPayload,
          metodo_pago: metodoPago,
          estado: "pagada",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`Error: ${data.message}`);
        return;
      }

      alert(`✅ Factura creada. Total: $${calcularTotal().toLocaleString()}`);
      setCarrito([]);
      setClienteId('');
      setIsModalOpen(false);
      cargarFacturas(); // Refrescar tabla
    } catch (e) {
      console.error(e);
      alert("Error al conectar con el servidor");
    } finally {
      setCargando(false);
    }
  };

  const getEstadoClass = (estado) => {
    if (!estado) return '';
    return estado.toLowerCase();
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2 className="sidebar-logo">
          <span className="logo-blanco">ESTANCO</span>
          <span className="logo-amarillo">MALACOPA</span>
        </h2>
        <ul>
          <li className="active">Dashboard</li>
        </ul>
      </aside>

      <main className="main-content">
        <div className="header-section">
          <div>
            <h1 style={{ margin: 0, color: '#111827' }}>Hola, {empleado?.nombre}</h1>
            <p style={{ margin: '5px 0 0 0', color: '#6b7280' }}>
              Empleado | Estado: <strong>Activo</strong>
            </p>
          </div>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            + Nueva Factura
          </button>
        </div>

        <section className="kpi-grid">
          <div className="kpi-card"><h3>Facturas Totales</h3><p>{facturas.length}</p></div>
          <div className="kpi-card">
            <h3>Ingresos Totales</h3>
            <p>${facturas.reduce((acc, f) => acc + (f.total || 0), 0).toLocaleString()}</p>
          </div>
          <div className="kpi-card">
            <h3>Pagadas</h3>
            <p>{facturas.filter(f => f.estado === "pagada").length}</p>
          </div>
        </section>

        <section className="table-container">
          <h2 style={{ marginTop: 0 }}>Facturas Recientes</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Método</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {facturas.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center' }}>Sin facturas</td></tr>
              ) : (
                facturas.map((f) => (
                  <tr key={f._id}>
                    <td style={{ fontSize: '11px' }}>{f._id}</td>
                    <td>{f.cliente_id?.nombre || "—"}</td>
                    <td>${f.total?.toLocaleString()}</td>
                    <td>{f.metodo_pago}</td>
                    <td>
                      <span className={`badge ${getEstadoClass(f.estado)}`}>
                        {f.estado}
                      </span>
                    </td>
                    <td>{new Date(f.createdAt).toLocaleDateString("es-CO")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>

      {isModalOpen && ReactDOM.createPortal(
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ marginTop: 0 }}>Nueva Factura</h2>

            {/* Selector de cliente */}
            <div style={{ marginBottom: '16px', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: '#374151' }}>
                Cliente
              </label>
              <select
                style={{ width: '100%', padding: '8px', border: '1px solid #9ca3af', borderRadius: '4px', backgroundColor: 'white', color: 'black', height: '38px', fontSize: '14px' }}
                value={clienteId}
                onChange={e => setClienteId(e.target.value)}
              >
                <option value="">-- Seleccionar cliente --</option>
                {clientes.map(c => (
                  <option key={c._id} value={c._id}>{c.nombre} — {c.email}</option>
                ))}
              </select>
            </div>

            {/* Producto + cantidad */}
            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', marginBottom: '20px' }}>
              <div style={{ flex: 2, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <label style={{ marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: '#374151' }}>Producto</label>
                <select
                  style={{ width: '100%', padding: '8px', border: '1px solid #9ca3af', borderRadius: '4px', backgroundColor: 'white', color: 'black', height: '38px', fontSize: '14px' }}
                  value={productoSeleccionado}
                  onChange={e => setProductoSeleccionado(e.target.value)}
                >
                  <option value="">-- Elige un producto --</option>
                  {productos.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.nombre} — ${p.precio.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <label style={{ marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: '#374151' }}>Cant.</label>
                <input
                  style={{ width: '100%', padding: '8px', border: '1px solid #9ca3af', borderRadius: '4px', backgroundColor: 'white', color: 'black', height: '38px', boxSizing: 'border-box' }}
                  type="number" min="1" value={cantidad}
                  onChange={e => setCantidad(e.target.value)}
                />
              </div>
              <button
                style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', padding: '0 20px', height: '38px', cursor: 'pointer', fontWeight: 'bold' }}
                onClick={agregarAlCarrito}
              >
                Agregar
              </button>
            </div>

            <table className="mini-table">
              <thead><tr><th>Producto</th><th>Cant.</th><th>Subtotal</th></tr></thead>
              <tbody>
                {carrito.length === 0 ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center' }}>Sin productos</td></tr>
                ) : (
                  carrito.map((item, i) => (
                    <tr key={i}>
                      <td>{item.nombre}</td>
                      <td>{item.cantidad}</td>
                      <td>${item.subtotal.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="total-section">
              <strong>Total: ${calcularTotal().toLocaleString()}</strong>
            </div>

            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: '#374151' }}>Método de Pago</label>
              <select
                style={{ width: '100%', padding: '8px', border: '1px solid #9ca3af', borderRadius: '4px', backgroundColor: 'white', color: 'black', height: '38px', fontSize: '14px' }}
                value={metodoPago}
                onChange={e => setMetodoPago(e.target.value)}
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta de Crédito/Débito</option>
                <option value="Transferencia">Transferencia (Nequi/Daviplata)</option>
              </select>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => { setIsModalOpen(false); setCarrito([]); }}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={guardarFactura} disabled={cargando}>
                {cargando ? "Guardando..." : "Generar Factura"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}