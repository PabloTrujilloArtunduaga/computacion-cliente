import React from 'react';

export default function FacturasPage() {
  const facturas = [
    { id: 'FAC-001', cliente: 'Juan Pérez', fecha: '2026-04-20', total: '$125.000', estado: 'Pagada' },
    { id: 'FAC-002', cliente: 'Laura Gómez', fecha: '2026-04-21', total: '$89.500', estado: 'Pendiente' },
    { id: 'FAC-003', cliente: 'Carlos Ruiz', fecha: '2026-04-21', total: '$210.000', estado: 'Pagada' },
    { id: 'FAC-004', cliente: 'Ana Torres', fecha: '2026-04-22', total: '$56.000', estado: 'Anulada' },
    { id: 'FAC-005', cliente: 'Pedro Ramírez', fecha: '2026-04-22', total: '$178.900', estado: 'Pagada' },
  ];

  return (
    <div className="grey lighten-4" style={{ minHeight: '100vh' }}>
      <nav className="blue darken-3">
        <div className="nav-wrapper" style={{ padding: '0 20px' }}>
          <a href="#" className="brand-logo">MalaCopa Admin</a>
          <ul className="right hide-on-med-and-down">
            <li><a href="#">Inicio</a></li>
            <li className="active"><a href="#">Facturas</a></li>
          </ul>
        </div>
      </nav>

      <div className="container" style={{ width: '95%', marginTop: '30px' }}>
        <div className="row">
          <div className="col s12 m6 l3">
            <div className="card blue white-text" style={{ borderRadius: '12px' }}>
              <div className="card-content center">
                <i className="material-icons large">receipt_long</i>
                <h4>5</h4>
                <p>Total Facturas</p>
              </div>
            </div>
          </div>

          <div className="col s12 m6 l3">
            <div className="card green white-text" style={{ borderRadius: '12px' }}>
              <div className="card-content center">
                <i className="material-icons large">paid</i>
                <h4>3</h4>
                <p>Facturas Pagadas</p>
              </div>
            </div>
          </div>

          <div className="col s12 m6 l3">
            <div className="card orange white-text" style={{ borderRadius: '12px' }}>
              <div className="card-content center">
                <i className="material-icons large">schedule</i>
                <h4>1</h4>
                <p>Pendientes</p>
              </div>
            </div>
          </div>

          <div className="col s12 m6 l3">
            <div className="card purple white-text" style={{ borderRadius: '12px' }}>
              <div className="card-content center">
                <i className="material-icons large">bar_chart</i>
                <h4>$659K</h4>
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
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {facturas.map((factura) => (
                  <tr key={factura.id}>
                    <td>{factura.id}</td>
                    <td>{factura.cliente}</td>
                    <td>{factura.fecha}</td>
                    <td>{factura.total}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}