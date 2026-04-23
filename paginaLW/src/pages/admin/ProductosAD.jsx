import React from 'react';

export default function ProductosCategoriasPage() {
  const productos = [
    { id: 1, nombre: 'Whisky Premium', categoria: 'Whisky', precio: '$120.000', stock: 45, estado: 'Disponible' },
    { id: 2, nombre: 'Ron Añejo', categoria: 'Ron', precio: '$85.000', stock: 30, estado: 'Disponible' },
    { id: 3, nombre: 'Vodka Importado', categoria: 'Vodka', precio: '$95.000', stock: 27, estado: 'No disponible' },
    { id: 4, nombre: 'Tequila Reserva', categoria: 'Tequila', precio: '$140.000', stock: 18, estado: 'Disponible' },
  ];

  const categorias = [
    { id: 1, nombre: 'Whisky', descripcion: 'Licores destilados de malta', productos: 12 },
    { id: 2, nombre: 'Ron', descripcion: 'Bebidas elaboradas a base de caña', productos: 10 },
    { id: 3, nombre: 'Vodka', descripcion: 'Destilados neutros e importados', productos: 8 },
    { id: 4, nombre: 'Tequila', descripcion: 'Licores derivados del agave', productos: 6 },
  ];

  return (
    <div className="grey lighten-4" style={{ minHeight: '100vh' }}>
      <nav className="blue darken-3">
        <div className="nav-wrapper" style={{ padding: '0 20px' }}>
          <a href="#" className="brand-logo">MalaCopa Admin</a>
          <ul className="right hide-on-med-and-down">
            <li><a href="#">Inicio</a></li>
            <li className="active"><a href="#">Productos y Categorías</a></li>
          </ul>
        </div>
      </nav>

      <div className="container" style={{ width: '95%', marginTop: '30px' }}>
        <div className="row">
          <div className="col s12 m6 l3">
            <div className="card green white-text" style={{ borderRadius: '12px' }}>
              <div className="card-content center">
                <i className="material-icons large">inventory_2</i>
                <h4>{productos.length}</h4>
                <p>Total Productos</p>
              </div>
            </div>
          </div>

          <div className="col s12 m6 l3">
            <div className="card blue white-text" style={{ borderRadius: '12px' }}>
              <div className="card-content center">
                <i className="material-icons large">check_circle</i>
                <h4>{productos.filter(p => p.estado === 'Disponible').length}</h4>
                <p>Disponibles</p>
              </div>
            </div>
          </div>

          <div className="col s12 m6 l3">
            <div className="card orange white-text" style={{ borderRadius: '12px' }}>
              <div className="card-content center">
                <i className="material-icons large">category</i>
                <h4>{categorias.length}</h4>
                <p>Categorías</p>
              </div>
            </div>
          </div>

          <div className="col s12 m6 l3">
            <div className="card red white-text" style={{ borderRadius: '12px' }}>
              <div className="card-content center">
                <i className="material-icons large">cancel</i>
                <h4>{productos.filter(p => p.estado === 'No disponible').length}</h4>
                <p>No Disponibles</p>
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
                    <span className="card-title">Gestión de Productos</span>
                  </div>
                  <div className="col s12 m6 right-align">
                    <a className="btn green waves-effect waves-light">
                      <i className="material-icons left">add_box</i>
                      Crear Producto
                    </a>
                  </div>
                </div>

                <table className="highlight responsive-table centered">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map((producto) => (
                      <tr key={producto.id}>
                        <td>{producto.id}</td>
                        <td>{producto.nombre}</td>
                        <td>{producto.categoria}</td>
                        <td>{producto.precio}</td>
                        <td>{producto.stock}</td>
                        <td>
                          <span className={`new badge ${producto.estado === 'Disponible' ? 'green' : 'red'}`} data-badge-caption="">
                            {producto.estado}
                          </span>
                        </td>
                        <td>
                          <a className="btn-small blue"><i className="material-icons">edit</i></a>{' '}
                          <a className="btn-small orange"><i className="material-icons">sync</i></a>{' '}
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
                    <span className="card-title">Gestión de Categorías</span>
                  </div>
                  <div className="col s12 m6 right-align">
                    <a className="btn orange waves-effect waves-light">
                      <i className="material-icons left">create_new_folder</i>
                      Crear Categoría
                    </a>
                  </div>
                </div>

                <table className="highlight responsive-table centered">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Productos</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categorias.map((categoria) => (
                      <tr key={categoria.id}>
                        <td>{categoria.id}</td>
                        <td>{categoria.nombre}</td>
                        <td>{categoria.descripcion}</td>
                        <td>{categoria.productos}</td>
                        <td>
                          <a className="btn-small blue"><i className="material-icons">edit</i></a>{' '}
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
      </div>
    </div>
  );
}