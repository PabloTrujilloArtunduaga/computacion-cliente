import React, { useEffect, useState } from "react";
import { fetchConToken } from "../../utils/api";
import ClienteNavbar from "./ClienteNavbar";

export default function ClienteDashboard() {
  const [usuario, setUsuario] = useState(null);
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Cargar usuario desde localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUsuario(user);
  }, []);

  // 📦 Traer facturas del cliente
  useEffect(() => {
    const cargarFacturas = async () => {
      try {
        const res = await fetchConToken(
          "http://localhost:3000/api/facturas" // Revisar
        );

        const data = await res.json();
        setFacturas(data);
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
      case "pagada":
        return "green";
      case "pendiente":
        return "orange";
      case "anulada":
        return "red";
      default:
        return "grey";
    }
  };

  return (
    <>
      {/* 🔥 NAVBAR CLIENTE */}
      <ClienteNavbar />

      <div className="container" style={{ marginTop: "30px" }}>

        {/* INFO CLIENTE */}
        <div className="card">
          <div className="card-content">
            <span className="card-title">Mi Información</span>

            <p><strong>Nombre:</strong> {usuario?.nombre}</p>
            <p><strong>Email:</strong> {usuario?.email}</p>
            <p>
              <strong>Estado:</strong>{" "}
              <span className="new badge green" data-badge-caption="">
                Activo
              </span>
            </p>
          </div>
        </div>

        {/* RESUMEN */}
        <div className="card blue white-text">
          <div className="card-content center">
            <h4>{facturas.length}</h4>
            <p>Compras realizadas</p>
          </div>
        </div>

        {/* HISTORIAL */}
        <div className="card">
          <div className="card-content">
            <span className="card-title">Mis Compras</span>

            {loading ? (
              <p>Cargando...</p>
            ) : (
              <table className="highlight responsive-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Total</th>
                    <th>Método Pago</th>
                    <th>Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {facturas.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center" }}>
                        No tienes compras aún
                      </td>
                    </tr>
                  ) : (
                    facturas.map((factura) => (
                      <tr key={factura._id}>
                        <td>{factura._id}</td>
                        <td>${factura.total}</td>
                        <td>{factura.metodo_pago}</td>
                        <td>
                          <span
                            className={`new badge ${getEstadoColor(
                              factura.estado
                            )}`}
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