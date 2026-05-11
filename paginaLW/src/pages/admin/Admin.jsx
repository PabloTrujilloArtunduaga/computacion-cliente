
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../admin/AdminNavbar";

export default function AdminDashboardMaterialize() {
  const salesChartRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, []);

  useEffect(() => {
    if (!salesChartRef.current) return;
    const chart = new Chart(salesChartRef.current, {
      type: 'line',
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
        datasets: [
          {
            label: 'Ventas',
            data: [1200, 1900, 1500, 2200, 2800, 3200],
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            backgroundColor: 'rgba(250,204,21,0.15)',
            borderColor: '#facc15',
            pointBackgroundColor: '#facc15',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#fff', font: { size: 14 } }
          }
        },
        scales: {
          x: { ticks: { color: '#d1d5db' }, grid: { color: '#374151' } },
          y: { ticks: { color: '#d1d5db' }, grid: { color: '#374151' } },
        },
      },
    });
    return () => chart.destroy();
  }, []);

  const cards = [
    { title: 'Usuarios', value: '150', color: 'linear-gradient(135deg,#2563eb,#1e293b)', icon: 'people' },
    { title: 'Productos', value: '320', color: 'linear-gradient(135deg,#059669,#1e293b)', icon: 'inventory_2' },
    { title: 'Categorías', value: '44', color: 'linear-gradient(135deg,#f59e42,#1e293b)', icon: 'category' },
    { title: 'Empleados', value: '65', color: 'linear-gradient(135deg,#a21caf,#1e293b)', icon: 'badge' },
    { title: 'Facturas', value: '540', color: 'linear-gradient(135deg,#dc2626,#1e293b)', icon: 'receipt_long' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg,#18181b 0%,#23272f 100%)' }}>
      <AdminNavbar />
      <div className="container" style={{ width: '97%', marginTop: '32px', maxWidth: 1400 }}>
        {/* CARDS */}
        <div className="row" style={{ gap: 0 }}>
          {cards.map((card, index) => (
            <div className="col s12 m6 l4 xl2" key={index}>
              <div className="card white-text dashboard-card" style={{ background: card.color, borderRadius: 16, boxShadow: '0 4px 24px #0002', marginBottom: 18 }}>
                <div className="card-content" style={{ padding: 24 }}>
                  <div className="row" style={{ marginBottom: 0, alignItems: 'center' }}>
                    <div className="col s8">
                      <span style={{ fontSize: '2.2rem', fontWeight: 700, letterSpacing: 1 }}>{card.value}</span>
                      <p style={{ margin: 0, fontSize: 16, color: '#f3f4f6' }}>{card.title}</p>
                    </div>
                    <div className="col s4 right-align">
                      <i className="material-icons" style={{ fontSize: '3.5rem', opacity: 0.85, color: '#facc15' }}>{card.icon}</i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CHART + ACCESOS */}
        <div className="row" style={{ gap: 0 }}>
          <div className="col s12 l8">
            <div className="card" style={{ borderRadius: 16, background: '#23272f', boxShadow: '0 4px 24px #0002' }}>
              <div className="card-content" style={{ padding: 28 }}>
                <span className="card-title" style={{ color: '#facc15', fontWeight: 600, fontSize: 22 }}>Resumen de Ventas</span>
                <div style={{ height: '350px' }}>
                  <canvas ref={salesChartRef}></canvas>
                </div>
              </div>
            </div>
          </div>
          <div className="col s12 l4">
            <div className="card" style={{ borderRadius: 16, background: '#18181b', boxShadow: '0 4px 24px #0002' }}>
              <div className="card-content" style={{ padding: 28 }}>
                <span className="card-title" style={{ color: '#facc15', fontWeight: 600, fontSize: 22 }}>Accesos Rápidos</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 18 }}>
                  <button className="quick-access-btn" onClick={() => navigate("/admin/usuarios")}> <i className="material-icons left">people</i> Usuarios </button>
                  <button className="quick-access-btn" onClick={() => navigate("/admin/productos")}> <i className="material-icons left">inventory_2</i> Productos </button>
                  <button className="quick-access-btn" onClick={() => navigate("/admin/categorias")}> <i className="material-icons left">category</i> Categorías </button>
                  <button className="quick-access-btn" onClick={() => navigate("/admin/empleados")}> <i className="material-icons left">badge</i> Empleados </button>
                  <button className="quick-access-btn" onClick={() => navigate("/admin/facturas")}> <i className="material-icons left">receipt_long</i> Facturas </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TABLA */}
        <div className="row">
          <div className="col s12">
            <div className="card" style={{ borderRadius: 16, background: '#23272f', boxShadow: '0 4px 24px #0002' }}>
              <div className="card-content" style={{ padding: 28 }}>
                <span className="card-title" style={{ color: '#facc15', fontWeight: 600, fontSize: 22 }}>Productos Más Vendidos</span>
                <table className="highlight responsive-table" style={{ color: '#f3f4f6', fontSize: 16 }}>
                  <thead>
                    <tr style={{ color: '#facc15', fontWeight: 600 }}>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Ventas</th>
                      <th>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Whisky Premium</td><td>Whisky</td><td>120</td><td>45</td></tr>
                    <tr><td>Ron Añejo</td><td>Ron</td><td>98</td><td>30</td></tr>
                    <tr><td>Vodka Importado</td><td>Vodka</td><td>85</td><td>27</td></tr>
                    <tr><td>Tequila Reserva</td><td>Tequila</td><td>73</td><td>18</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Estilos extra para botones y cards */}
      <style>{`
        .dashboard-card { transition: transform 0.15s; }
        .dashboard-card:hover { transform: translateY(-4px) scale(1.03); box-shadow: 0 8px 32px #0004; }
        .quick-access-btn {
          background: linear-gradient(90deg,#23272f 60%,#facc15 100%);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 12px 18px;
          font-size: 1.1rem;
          font-weight: 500;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 2px 8px #0002;
          transition: background 0.2s, transform 0.15s;
        }
        .quick-access-btn:hover {
          background: linear-gradient(90deg,#facc15 60%,#23272f 100%);
          color: #23272f;
          transform: translateY(-2px) scale(1.04);
        }
      `}</style>
    </div>
  );
}