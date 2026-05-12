import React, { useEffect, useState } from "react";
import ClienteNavbar from "./ClienteNavbar";

export default function ClienteDashboard() {
  const [usuario, setUsuario] = useState(null);
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUsuario(user);
  }, []);

  useEffect(() => {
    const cargarFacturas = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");
        if (!user || !token) return;

        const res = await fetch(
          `http://localhost:3000/api/facturas/cliente/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        setFacturas(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error cargando facturas", error);
      } finally {
        setLoading(false);
      }
    };

    cargarFacturas();
  }, []);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "pagada":    return "green";
      case "pendiente": return "orange";
      case "anulada":   return "red";
      default:          return "grey";
    }
  };

  return (
    <>
      <ClienteNavbar />
      <div className="container" style={{ marginTop: "30px" }}>

        <div className="card">
          <div className="card-content">
            <span className="card-title">Mi Información</span>
            <p><strong>Nombre:</strong> {usuario?.nombre}</p>
            <p><strong>Email:</strong> {usuario?.email}</p>
            <p>
              <strong>Estado:</strong>{" "}
              <span className="new badge green" data-badge-caption="">Activo</span>
            </p>
          </div>
        </div>

        <div className="card blue white-text">
          <div className="card-content center">
            <h4>{facturas.length}</h4>
            <p>Compras realizadas</p>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <span className="card-title">Mis Compras</span>
            {loading ? (
              <p>Cargando...</p>
            ) : (
              <table className="highlight responsive-table">
                <thead>
                  <tr>
                    <th>ID Factura</th>
                    <th>Productos</th>
                    <th>Total</th>
                    <th>Método Pago</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {facturas.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        No tienes compras aún
                      </td>
                    </tr>
                  ) : (
                    facturas.map((factura) => (
                      <tr key={factura._id}>
                        <td style={{ fontSize: "11px" }}>{factura._id}</td>
                        <td>
                          {factura.productos.map((p, i) => (
                            <div key={i} style={{ fontSize: "12px" }}>
                              {p.nombre} x{p.cantidad}
                            </div>
                          ))}
                        </td>
                        <td>${factura.total?.toLocaleString()}</td>
                        <td>{factura.metodo_pago}</td>
                        <td>{new Date(factura.createdAt).toLocaleDateString("es-CO")}</td>
                        <td>
                          <span
                            className={`new badge ${getEstadoColor(factura.estado)}`}
                            data-badge-caption=""
                          >
                            {factura.estado}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </>
  );
}