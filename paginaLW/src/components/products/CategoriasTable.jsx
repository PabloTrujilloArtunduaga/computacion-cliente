import React from 'react';

function CategoriaRow({ c, onEdit, onDelete }) {
  return (
    <tr>
      <td><b>{c.nombre}</b></td>
      <td>{c.descripcion || '—'}</td>
      <td>
        <span className={`new badge ${c.estado ? 'green' : 'red'}`} data-badge-caption="">
          {c.estado ? 'Activa' : 'Inactiva'}
        </span>
      </td>
      <td>
        <a className="btn-small blue" title="Editar" onClick={onEdit}><i className="material-icons">edit</i></a>{' '}
        <a className="btn-small red" title="Eliminar" onClick={onDelete}><i className="material-icons">delete</i></a>
      </td>
    </tr>
  );
}

export default function CategoriasTable({ categorias, onCreateClick, onEdit, onDelete }) {
  return (
    <div className="row">
      <div className="col s12">
        <div className="card" style={{ borderRadius: 12 }}>
          <div className="card-content">
            <div className="row valign-wrapper" style={{ marginBottom: 0 }}>
              <div className="col s12 m6">
                <span className="card-title">Gestión de Categorías</span>
              </div>
              <div className="col s12 m6 right-align">
                <a className="btn waves-effect waves-light" style={{ background: '#F9A825', fontWeight: 700 }} onClick={onCreateClick}>
                  <i className="material-icons left">create_new_folder</i>Crear Categoría
                </a>
              </div>
            </div>

            <table className="highlight responsive-table centered">
              <thead>
                <tr>
                  <th>Nombre</th><th>Descripción</th><th>Estado</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categorias.length === 0
                  ? <tr><td colSpan={4} style={{ color: '#aaa', padding: 30 }}>Sin categorías</td></tr>
                  : categorias.map(c => (
                    <CategoriaRow
                      key={c._id}
                      c={c}
                      onEdit={() => onEdit(c)}
                      onDelete={() => onDelete(c._id)}
                    />
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}