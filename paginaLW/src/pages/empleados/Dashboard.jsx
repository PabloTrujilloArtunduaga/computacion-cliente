import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import '../../styles/Dashboard.css';

const Dashboard = () => {
  // --- 1. ESTADO DE LA APLICACIÓN ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carrito, setCarrito] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [metodoPago, setMetodoPago] = useState('Efectivo');

  // DATOS 
  const empleado = {
    nombre: "Yonaiker ",
    cargo: "Auxiliar de ventas",
    estado: "Activo",
    totalVentas: 64,
    ingresoPromedio: "$3.000.000"
  };

  const facturasIniciales = [
    { id: "FAC-001", fecha: "24/04/2026", total: "$120.00", metodo: "Tarjeta", estado: "Finalizada" },
    { id: "FAC-002", fecha: "23/04/2026", total: "$45.00", metodo: "Efectivo", estado: "Pendiente" },
    { id: "FAC-003", fecha: "20/04/2026", total: "$300.00", metodo: "Transferencia", estado: "Anulada" }
  ];

  const catalogoProductos = [
    { id: 1, nombre: "Aguardiente Doble Anís 750ml", precio: 45000 },
    { id: 2, nombre: "Ron Viejo de Caldas 8 Años", precio: 65000 },
    { id: 3, nombre: "Six Pack Cerveza Poker", precio: 22000 },
    { id: 4, nombre: "Whisky Buchanan's 12 Años", precio: 140000 }
  ];

  //  Logica factura
  const agregarAlCarrito = () => {
    if (!productoSeleccionado) return;
    const producto = catalogoProductos.find(p => p.id === parseInt(productoSeleccionado));
    
    const nuevoItem = {
      ...producto,
      cantidad: parseInt(cantidad),
      subtotal: producto.precio * parseInt(cantidad)
    };
    
    setCarrito([...carrito, nuevoItem]);
    setCantidad(1); // Resetear cantidad
  };

  const calcularTotal = () => {
    return carrito.reduce((acumulador, item) => acumulador + item.subtotal, 0);
  };

  const guardarFactura = () => {
    if (carrito.length === 0) {
      alert("Agrega al menos un producto a la factura.");
      return;
    }
    alert(`¡Factura guardada exitosamente!\nTotal: $${calcularTotal()}\nMétodo: ${metodoPago}`);
    setCarrito([]);
    setIsModalOpen(false);
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2 className="sidebar-logo">
          <span className="logo-blanco">ESTANCO</span>
          <span className="logo-amarillo">MALACOPA</span>
        </h2>
        <ul></ul>
        <ul>
          <li>Inicio</li>
          <li>Servicios</li>
          <li>Marketing</li>
          <li className="active">Dashboard Empleados (BETA)</li>
          <li>Tareas</li>
        </ul>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">
        <div className="header-section">
          <div>
            <h1 style={{ margin: 0, color: '#111827' }}>Hola, {empleado.nombre}</h1>
            <p style={{ margin: '5px 0 0 0', color: '#6b7280' }}>
              {empleado.cargo} | Estado: <strong>{empleado.estado}</strong>
            </p>
          </div>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            + Nueva Factura
          </button>
        </div>

        {/* KPIs */}
        <section className="kpi-grid">
          <div className="kpi-card"><h3>Total de Ventas</h3><p>{empleado.totalVentas}</p></div>
          <div className="kpi-card"><h3>Ingreso Promedio</h3><p>{empleado.ingresoPromedio}</p></div>
          <div className="kpi-card"><h3>Facturas Generadas</h3><p>{facturasIniciales.length}</p></div>
        </section>

        /* --- MÓDULO 1.5: GRÁFICOS VISUALES --- */
        <section className="charts-grid">
          
          {/* Gráfico 1: Ventas por Día */}
          <div className="chart-card">
            <h3>Ventas por Día (Última Semana)</h3>
            <div className="bar-chart">
              <div className="bar-col"><div className="bar" style={{height: '40%'}}></div><span>Lun (2)</span></div>
              <div className="bar-col"><div className="bar" style={{height: '70%'}}></div><span>Mar (5)</span></div>
              <div className="bar-col"><div className="bar" style={{height: '50%'}}></div><span>Mie (0)</span></div>
              <div className="bar-col"><div className="bar" style={{height: '90%'}}></div><span>Jue (12)</span></div>
              <div className="bar-col"><div className="bar" style={{height: '65%'}}></div><span>Vie (3)</span></div>
              <div className="bar-col"><div className="bar" style={{height: '100%', backgroundColor: '#f97316'}}></div><span>Sab (10)</span></div>
            </div>
          </div>

          {/* Gráfico 2: Métodos de Pago */}
          <div className="chart-card">
            <h3>Métodos de Pago Utilizados</h3>
            <div className="progress-chart">
              <div className="progress-item">
                <div className="progress-label"><span>Efectivo</span><span>50%</span></div>
                <div className="progress-track"><div className="progress-fill" style={{width: '50%', backgroundColor: '#10b981'}}></div></div>
              </div>
              <div className="progress-item">
                <div className="progress-label"><span>Tarjeta de Crédito/Débito</span><span>35%</span></div>
                <div className="progress-track"><div className="progress-fill" style={{width: '35%', backgroundColor: '#3b82f6'}}></div></div>
              </div>
              <div className="progress-item">
                <div className="progress-label"><span>Transferencia (Nequi/Daviplata)</span><span>15%</span></div>
                <div className="progress-track"><div className="progress-fill" style={{width: '15%', backgroundColor: '#eab308'}}></div></div>
              </div>
            </div>
          </div>

        </section>





        {/* TABLA DE FACTURAS */}
        <section className="table-container">
          <h2 style={{ marginTop: 0 }}>Facturas Recientes</h2>
          <table>
            <thead>
              <tr><th>ID Factura</th><th>Fecha</th><th>Total</th><th>Método</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {facturasIniciales.map((f) => (
                <tr key={f.id}>
                  <td><strong>{f.id}</strong></td><td>{f.fecha}</td><td>{f.total}</td><td>{f.metodo}</td>
                  <td><span className={`badge ${f.estado.toLowerCase()}`}>{f.estado}</span></td>
                  <td>
                    {f.estado === 'Pendiente' ? (
                      <button className="btn-action">Editar</button>
                    ) : (
                      <button className="btn-disabled" disabled>Solo Lectura</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {/* --- MODAL (USANDO PORTAL) --- */}
      {isModalOpen && ReactDOM.createPortal(
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ marginTop: 0 }}>Nueva Factura</h2>
            
{/* Formulario de Productos con estilos forzados */}
            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', marginBottom: '20px', width: '100%' }}>
              
              <div style={{ flex: 2, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <label style={{ marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: '#374151' }}>
                  Seleccionar Producto
                </label>
                <select 
                  style={{ display: 'block', width: '100%', padding: '8px', border: '1px solid #9ca3af', borderRadius: '4px', backgroundColor: 'white', color: 'black', height: '38px', fontSize: '14px' }}
                  onChange={(e) => setProductoSeleccionado(e.target.value)} 
                  value={productoSeleccionado}
                >
                  <option value="">-- Elige un licor --</option>
                  {catalogoProductos.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre} - ${p.precio}</option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <label style={{ marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: '#374151' }}>
                  Cant.
                </label>
                <input 
                  style={{ display: 'block', width: '100%', padding: '8px', border: '1px solid #9ca3af', borderRadius: '4px', backgroundColor: 'white', color: 'black', height: '38px', boxSizing: 'border-box' }}
                  type="number" min="1" 
                  value={cantidad} 
                  onChange={(e) => setCantidad(e.target.value)}
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
                  <tr><td colSpan="3" style={{ textAlign: 'center' }}>No hay productos aún</td></tr>
                ) : (
                  carrito.map((item, index) => (
                    <tr key={index}><td>{item.nombre}</td><td>{item.cantidad}</td><td>${item.subtotal}</td></tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="total-section">
              <strong>Total a cobrar: ${calcularTotal()}</strong>
            </div>

{/* Método de Pago  */}
            <div style={{ marginBottom: '20px', textAlign: 'left', width: '100%' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: '#374151' }}>
                Método de Pago
              </label>
              <select 
                style={{ display: 'block', width: '100%', padding: '8px', border: '1px solid #9ca3af', borderRadius: '4px', backgroundColor: 'white', color: 'black', height: '38px', fontSize: '14px' }}
                value={metodoPago} 
                onChange={(e) => setMetodoPago(e.target.value)}
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta de Crédito/Débito</option>
                <option value="Transferencia">Transferencia (Nequi/Daviplata)</option>
              </select>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
              <button className="btn-primary" onClick={guardarFactura}>Generar Factura</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Dashboard;