import React from "react";

export default function ClienteDashboard() {
  const cliente = {
    nombre: "Juan Pérez",
    estado: "Activo",
  };

  const compras = [
    {
      id: 1,
      producto: "Whisky Premium",
      cantidad: 2,
      precio: "$120.000",
      estado: "Entregado",
    },
    {
      id: 2,
      producto: "Ron Añejo",
      cantidad: 1,
      precio: "$85.000",
      estado: "Enviado",
    },
    {
      id: 3,
      producto: "Vodka Importado",
      cantidad: 3,
      precio: "$95.000",
      estado: "Pendiente",
    },
    {
      id: 4,
      producto: "Tequila Reserva",
      cantidad: 1,
      precio: "$140.000",
      estado: "Cancelado",
    },
  ];

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "Entregado":
        return "green";
      case "Enviado":
        return "blue";
      case "Pendiente":
        return "orange";
      case "Cancelado":
        return "red";
      default:
        return "grey";
    }
  };

  return (
    <div className="grey lighten-4" style={{ minHeight: "100vh" }}>
      
      {/* NAVBAR */}
      <nav className="black">
        <div className="nav-wrapper" style={{ padding: "0 20px" }}>
          <a href="#" className="brand-logo" style={{ color: "#d4af37" }}>
            Mi Cuenta
          </a>
        </div>
      </nav>

      <div className="container" style={{ width: "95%", marginTop: "30px" }}>

        {/* INFO CLIENTE */}
        <div className="row">
          <div className="col s12 m6">
            <div className="card" style={{ borderRadius: "12px" }}>
              <div className="card-content">
                <span className="card-title">Información del Cliente</span>

                <p><strong>Nombre:</strong> {cliente.nombre}</p>

                <p>
                  <strong>Estado:</strong>{" "}
                  <span
                    className={`new badge ${cliente.estado === "Activo" ? "green" : "red"}`}
                    data-badge-caption=""
                  >
                    {cliente.estado}
                  </span>
                </p>

              </div>
            </div>
          </div>

          {/* RESUMEN */}
          <div className="col s12 m6">
            <div className="card blue white-text" style={{ borderRadius: "12px" }}>
              <div className="card-content center">
                <i className="material-icons large">shopping_cart</i>
                <h4>{compras.length}</h4>
                <p>Compras realizadas</p>
              </div>
            </div>
          </div>
        </div>

        {/* HISTORIAL DE COMPRAS */}
        <div className="row">
          <div className="col s12">
            <div className="card" style={{ borderRadius: "12px" }}>
              <div className="card-content">
                <span className="card-title">Historial de Compras</span>

                <table className="highlight responsive-table centered">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio</th>
                      <th>Estado</th>
                    </tr>
                  </thead>

                  <tbody>
                    {compras.map((compra) => (
                      <tr key={compra.id}>
                        <td>{compra.id}</td>
                        <td>{compra.producto}</td>
                        <td>{compra.cantidad}</td>
                        <td>{compra.precio}</td>
                        <td>
                          <span
                            className={`new badge ${getEstadoColor(compra.estado)}`}
                            data-badge-caption=""
                          >
                            {compra.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
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