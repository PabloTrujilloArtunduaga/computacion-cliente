import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useNavigate, Link } from "react-router-dom";

export default function AdminDashboardMaterialize() {
  const salesChartRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
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
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    });

    return () => chart.destroy();
  }, []);

  const cards = [
    { title: 'Usuarios', value: '150', color: '#1976d2', icon: 'people' },
    { title: 'Productos', value: '320', color: '#388e3c', icon: 'inventory_2' },
    { title: 'Categorías', value: '44', color: '#f9a825', icon: 'category' },
    { title: 'Empleados', value: '65', color: '#8e24aa', icon: 'badge' },
    { title: 'Facturas', value: '540', color: '#d32f2f', icon: 'receipt_long' },
  ];

  return (
    <div className="grey lighten-4" style={{ minHeight: '100vh' }}>
      
      <nav className="blue darken-3">
        <div className="nav-wrapper" style={{ padding: '0 20px' }}>
          <span className="brand-logo">MalaCopa Admin</span>

          <ul className="right hide-on-med-and-down">
            <li><Link to="/admin">Inicio</Link></li>
            <li><Link to="/admin/usuarios">Usuarios</Link></li>
            <li><Link to="/admin/productos">Productos</Link></li>
            <li><Link to="/admin/categorias">Categorías</Link></li>
            <li><Link to="/admin/empleados">Empleados</Link></li>
            <li><Link to="/admin/facturas">Facturas</Link></li>
          </ul>
        </div>
      </nav>

      <div className="container" style={{ width: '95%', marginTop: '30px' }}>
        
        <div className="row">
          {cards.map((card, index) => (
            <div className="col s12 m6 l4 xl2" key={index}>
              <div className="card white-text" style={{ backgroundColor: card.color, borderRadius: '12px' }}>
                <div className="card-content">
                  <div className="row" style={{ marginBottom: 0 }}>
                    <div className="col s8">
                      <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                        {card.value}
                      </span>
                      <p>{card.title}</p>
                    </div>
                    <div className="col s4 right-align">
                      <i className="material-icons" style={{ fontSize: '3.5rem', opacity: 0.8 }}>
                        {card.icon}
                      </i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row">
          <div className="col s12 l8">
            <div className="card" style={{ borderRadius: '12px' }}>
              <div className="card-content">
                <span className="card-title">Resumen de Ventas</span>
                <div style={{ height: '350px' }}>
                  <canvas ref={salesChartRef}></canvas>
                </div>
              </div>
            </div>
          </div>

          <div className="col s12 l4">
            <div className="card" style={{ borderRadius: '12px' }}>
              <div className="card-content">
                <span className="card-title">Accesos Rápidos</span>

                <div className="collection">
                  <div className="collection-item" onClick={() => navigate("/admin/usuarios")} style={{ cursor: "pointer" }}>
                    Gestionar Usuarios
                  </div>
                  <div className="collection-item" onClick={() => navigate("/admin/productos")} style={{ cursor: "pointer" }}>
                    Administrar Productos
                  </div>
                  <div className="collection-item" onClick={() => navigate("/admin/categorias")} style={{ cursor: "pointer" }}>
                    Control de Categorías
                  </div>
                  <div className="collection-item" onClick={() => navigate("/admin/empleados")} style={{ cursor: "pointer" }}>
                    Gestión de Empleados
                  </div>
                  <div className="collection-item" onClick={() => navigate("/admin/facturas")} style={{ cursor: "pointer" }}>
                    Ver Facturas
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col s12">
            <div className="card" style={{ borderRadius: '12px' }}>
              <div className="card-content">
                <span className="card-title">Productos Más Vendidos</span>

                <table className="highlight responsive-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Ventas</th>
                      <th>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Whisky Premium</td>
                      <td>Whisky</td>
                      <td>120</td>
                      <td>45</td>
                    </tr>
                    <tr>
                      <td>Ron Añejo</td>
                      <td>Ron</td>
                      <td>98</td>
                      <td>30</td>
                    </tr>
                    <tr>
                      <td>Vodka Importado</td>
                      <td>Vodka</td>
                      <td>85</td>
                      <td>27</td>
                    </tr>
                    <tr>
                      <td>Tequila Reserva</td>
                      <td>Tequila</td>
                      <td>73</td>
                      <td>18</td>
                    </tr>
                  </tbody>
                </table>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}