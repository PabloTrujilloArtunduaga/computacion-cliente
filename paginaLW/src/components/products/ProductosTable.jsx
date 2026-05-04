import React from 'react';
import { getCatNombre } from '../../utils/helpers';

function ProductRow({ p, onEdit, onToggle, onDelete }) {
  return (
    <tr>
      <td>
        {p.imagen
          ? <img src={p.imagen} alt={p.nombre} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, border: '1px solid #ddd' }} onError={e => { e.target.style.display = 'none'; }} />
          : <span style={{ color: '#bbb', fontSize: 12 }}>Sin imagen</span>
        }
      </td>
      <td><b>{p.nombre}</b></td>
      <td>{getCatNombre(p)}</td>
      <td>${Number(p.precio).toLocaleString('es-CO')}</td>
      <td>{p.stock}</td>
      <td>
        <span className={`new badge ${p.estado ? 'green' : 'red'}`} data-badge-caption="">
          {p.estado ? 'Disponible' : 'No disponible'}
        </span>
      </td>
      <td>
        <a className="btn-small blue" title="Editar" onClick={onEdit}><i className="material-icons">edit</i></a>{' '}
        <a className="btn-small orange" title="Cambiar estado" onClick={onToggle}><i className="material-icons">sync</i></a>{' '}
        <a className="btn-small red" title="Eliminar" onClick={onDelete}><i className="material-icons">delete</i></a>
      </td>
    </tr>
  );
}

export default function ProductosTable({ productos, onCreateClick, onEdit, onToggle, onDelete }) {
  return (
    <div className="row">
      <div className="col s12">
        <div className="card" style={{ borderRadius: 12 }}>
          <div className="card-content">
            <div className="row valign-wrapper" style={{ marginBottom: 0 }}>
              <div className="col s12 m6">
                <span className="card-title">Gestión de Productos</span>
              </div>
              <div className="col s12 m6 right-align">
                <a className="btn waves-effect waves-light" style={{ background: '#F9A825', fontWeight: 700 }} onClick={onCreateClick}>
                  <i className="material-icons left">add_box</i>Crear Producto
                </a>
              </div>
            </div>

            <table className="highlight responsive-table centered">
              <thead>
                <tr>
                  <th>Imagen</th><th>Producto</th><th>Categoría</th>
                  <th>Precio</th><th>Stock</th><th>Estado</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.length === 0
                  ? <tr><td colSpan={7} style={{ color: '#aaa', padding: 30 }}>Sin productos</td></tr>
                  : productos.map(p => (
                    <ProductRow
                      key={p._id}
                      p={p}
                      onEdit={() => onEdit(p)}
                      onToggle={() => onToggle(p)}
                      onDelete={() => onDelete(p._id)}
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