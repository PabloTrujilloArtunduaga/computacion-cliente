import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../admin/AdminNavbar";
import { API } from "../../constants/api";
import { fetchConToken } from "../../utils/api";

export default function FacturasPage() {
  const navigate = useNavigate();
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const res = await fetchConToken(`${API}/facturas`);
        const data = await res.json();
        setFacturas(data);
      } catch (err) {
        setFacturas([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFacturas();
  }, []);

  // Estadísticas
  const totalFacturas = facturas.length;
  const pagadas = facturas.filter(f => f.estado === 'Pagada').length;
  const pendientes = facturas.filter(f => f.estado === 'Pendiente').length;
  const totalVentas = facturas.reduce((acc, f) => acc + (f.total || 0), 0);

  return (
    <div className="grey lighten-4" style={{ minHeight: '100vh' }}>
      <AdminNavbar/>

      <div className="container" style={{ width: '95%', marginTop: '30px' }}>
        <div className="row">
          <div className="col s12 m6 l3">
            <div className="card blue white-text" style={{ borderRadius: '12px' }}>
              <div className="card-content center">
                <i className="material-icons large">receipt_long</i>
                <h4>{loading ? '-' : totalFacturas}</h4>
                <p>Total Facturas</p>
              </div>
            </div>
          </div>

          <div className="col s12 m6 l3">
            <div className="card green white-text" style={{ borderRadius: '12px' }}>
              <div className="card-content center">
                <i className="material-icons large">paid</i>
                <h4>{loading ? '-' : pagadas}</h4>
                <p>Facturas Pagadas</p>
              </div>
            </div>
          </div>

          <div className="col s12 m6 l3">
            <div className="card orange white-text" style={{ borderRadius: '12px' }}>
              <div className="card-content center">
                <i className="material-icons large">schedule</i>
                <h4>{loading ? '-' : pendientes}</h4>
                <p>Pendientes</p>
              </div>
            </div>
          </div>

          <div className="col s12 m6 l3">
            <div className="card purple white-text" style={{ borderRadius: '12px' }}>
              <div className="card-content center">
                <i className="material-icons large">bar_chart</i>
                <h4>{loading ? '-' : `$${totalVentas.toLocaleString()}`}</h4>
                <p>Ventas Totales</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ borderRadius: '12px' }}>
          <div className="card-content">
            <div className="row">
              <div className="col s12 m4">
                <span className="card-title">Gestión de Facturas</span>
              </div>
              <div className="col s12 m8 right-align">
                <a className="btn blue waves-effect waves-light" style={{ marginRight: '10px' }}>
                  <i className="material-icons left">filter_list</i>
                  Filtrar Ventas
                </a>
                <a className="btn green waves-effect waves-light">
                  <i className="material-icons left">assessment</i>
                  Ver Reportes
                </a>
              </div>
            </div>

            <table className="highlight responsive-table centered">
              <thead>
                <tr>
                  <th>N° Factura</th>
                  <th>Cliente</th>
                  <th>Empleado</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7">Cargando...</td></tr>
                ) : facturas.length === 0 ? (
                  <tr><td colSpan="7">No hay facturas</td></tr>
                ) : (
                  facturas.map((factura) => (
                    <tr key={factura._id}>
                      <td>{factura._id.slice(-6).toUpperCase()}</td>
                      <td>{factura.cliente_id?.nombre || '—'}</td>
                      <td>{factura.empleado_id?.usuario_id?.nombre || '—'}</td>
                      <td>{new Date(factura.createdAt).toLocaleDateString()}</td>
                      <td>${factura.total?.toLocaleString() || 0}</td>
                      <td>
                        <span
                          className={`new badge ${
                            factura.estado === 'Pagada'
                              ? 'green'
                              : factura.estado === 'Pendiente'
                              ? 'orange'
                              : 'red'
                          }`}
                          data-badge-caption=""
                        >
                          {factura.estado}
                        </span>
                      </td>
                      <td>
                        <a className="btn-small blue"><i className="material-icons">visibility</i></a>{' '}
                        <a className="btn-small green"><i className="material-icons">print</i></a>{' '}
                        <a className="btn-small purple"><i className="material-icons">download</i></a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}