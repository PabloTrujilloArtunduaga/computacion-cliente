import React from 'react';

export default function UsuariosEmpleadosPage() {
  const usuarios = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@malacopa.com', rol: 'Cliente', estado: 'Activo' },
    { id: 2, nombre: 'Laura Gómez', email: 'laura@malacopa.com', rol: 'Empleado', estado: 'Activo' },
    { id: 3, nombre: 'Carlos Ruiz', email: 'carlos@malacopa.com', rol: 'Cliente', estado: 'Inactivo' },
    { id: 4, nombre: 'Ana Torres', email: 'ana@malacopa.com', rol: 'Empleado', estado: 'Activo' },
  ];

  const empleados = [
    { id: 1, nombre: 'Laura Gómez', cargo: 'Vendedora', salario: '$1.800.000', estado: 'Activo' },
    { id: 2, nombre: 'Ana Torres', cargo: 'Administradora', salario: '$2.500.000', estado: 'Activo' },
    { id: 3, nombre: 'Pedro Ramírez', cargo: 'Bodeguero', salario: '$1.600.000', estado: 'Activo' },
  ];

  return (
    <div className="grey lighten-4" style={{ minHeight: '100vh' }}>
      <nav className="blue darken-3">
        <div className="nav-wrapper" style={{ padding: '0 20px' }}>
          <a href="#" className="brand-logo">MalaCopa Admin</a>
          <ul className="right hide-on-med-and-down">
            <li><a href="#">Inicio</a></li>
            <li className="active"><a href="#">Usuarios y Empleados</a></li>
          </ul>
        </div>
      </nav>

      <div className="container" style={{ width: '95%', marginTop: '30px' }}>
        <div className="row">
          <div className="col s12 m6 l3">
            <div className="card blue white-text" style={{ borderRadius: '12px' }}>
              <div className="card-content center">
                <i className="material-icons large">people</i>
                <h4>{usuarios.length}</h4>
                <p>Total Usuarios</p>
              </div>
            </div>
          </div>

          <div className="col s12 m6 l3">
            <div className="card green white-text" style={{ borderRadius: '12px' }}>
              <div className="card-content center">
                <i className="material-icons large">badge</i>
                <h4>{empleados.length}</h4>
                <p>Empleados</p>
              </div>
            </div>
          </div>

          <div className="col s12 m6 l3">
            <div className="card orange white-text" style={{ borderRadius: '12px' }}>
              <div className="card-content center">
                <i className="material-icons large">check_circle</i>
                <h4>{usuarios.filter(u => u.estado === 'Activo').length}</h4>
                <p>Usuarios Activos</p>
              </div>
            </div>
          </div>

          <div className="col s12 m6 l3">
            <div className="card red white-text" style={{ borderRadius: '12px' }}>
              <div className="card-content center">
                <i className="material-icons large">person_off</i>
                <h4>{usuarios.filter(u => u.estado === 'Inactivo').length}</h4>
                <p>Usuarios Inactivos</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col s12">
            <div className="card" style={{ borderRadius: '12px' }}>
              <div className="card-content">
                <div className="row valign-wrapper">
                  <div className="col s12 m6">
                    <span className="card-title">Gestión de Usuarios</span>
                  </div>
                  <div className="col s12 m6 right-align">
                    <a className="btn blue waves-effect waves-light">
                      <i className="material-icons left">person_add</i>
                      Crear Usuario
                    </a>
                  </div>
                </div>

                <table className="highlight responsive-table centered">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usuario) => (
                      <tr key={usuario.id}>
                        <td>{usuario.id}</td>
                        <td>{usuario.nombre}</td>
                        <td>{usuario.email}</td>
                        <td>{usuario.rol}</td>
                        <td>
                          <span className={`new badge ${usuario.estado === 'Activo' ? 'green' : 'red'}`} data-badge-caption="">
                            {usuario.estado}
                          </span>
                        </td>
                        <td>
                          <a className="btn-small blue"><i className="material-icons">edit</i></a>{' '}
                          <a className="btn-small orange"><i className="material-icons">swap_horiz</i></a>{' '}
                          <a className="btn-small green"><i className="material-icons">toggle_on</i></a>{' '}
                          <a className="btn-small red"><i className="material-icons">delete</i></a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col s12">
            <div className="card" style={{ borderRadius: '12px' }}>
              <div className="card-content">
                <div className="row valign-wrapper">
                  <div className="col s12 m6">
                    <span className="card-title">Gestión de Empleados</span>
                  </div>
                  <div className="col s12 m6 right-align">
                    <a className="btn green waves-effect waves-light">
                      <i className="material-icons left">badge</i>
                      Crear Empleado
                    </a>
                  </div>
                </div>

                <table className="highlight responsive-table centered">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Cargo</th>
                      <th>Salario</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {empleados.map((empleado) => (
                      <tr key={empleado.id}>
                        <td>{empleado.id}</td>
                        <td>{empleado.nombre}</td>
                        <td>{empleado.cargo}</td>
                        <td>{empleado.salario}</td>
                        <td>
                          <span className="new badge green" data-badge-caption="">
                            {empleado.estado}
                          </span>
                        </td>
                        <td>
                          <a className="btn-small blue"><i className="material-icons">edit</i></a>{' '}
                          <a className="btn-small orange"><i className="material-icons">payments</i></a>{' '}
                          <a className="btn-small purple"><i className="material-icons">work</i></a>
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