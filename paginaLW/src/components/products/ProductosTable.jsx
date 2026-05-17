import React from 'react';

import { getCatNombre } from '../../utils/helpers';

function ProductRow({
  p,
  onEdit,
  onToggle,
  onDelete
}) {

  /*
    =====================================
    ESTADO REAL DEL PRODUCTO
    =====================================

    🔥 IMPORTANTE:

    - Si stock = 0
      => SIEMPRE "No disponible"

    - Si stock > 0
      => depende de p.estado

    =====================================
  */

  const stockDisponible =
    Number(p.stock) > 0;

  /*
    =====================================
    ESTADO FINAL
    =====================================
  */

  const estadoFinal =
    stockDisponible && p.estado;

  return (

    <tr>

      {/* =====================================
          IMAGEN
      ===================================== */}
      <td>

        {
          p.imagen
            ? (

              <img
                src={p.imagen}
                alt={p.nombre}
                style={{
                  width: 44,
                  height: 44,
                  objectFit: 'cover',
                  borderRadius: 8,
                  border: '1px solid #ddd'
                }}
                onError={(e) => {
                  e.target.style.display =
                    'none';
                }}
              />

            )
            : (

              <span
                style={{
                  color: '#bbb',
                  fontSize: 12
                }}
              >
                Sin imagen
              </span>

            )
        }

      </td>

      {/* =====================================
          PRODUCTO
      ===================================== */}
      <td>
        <b>{p.nombre}</b>
      </td>

      {/* =====================================
          CATEGORIA
      ===================================== */}
      <td>
        {getCatNombre(p)}
      </td>

      {/* =====================================
          PRECIO
      ===================================== */}
      <td>

        $
        {
          Number(p.precio)
            .toLocaleString('es-CO')
        }

      </td>

      {/* =====================================
          STOCK
      ===================================== */}
      <td>

        <span
          style={{
            fontWeight: 700,
            color:
              stockDisponible
                ? '#2e7d32'
                : '#c62828'
          }}
        >

          {p.stock}

        </span>

      </td>

      {/* =====================================
          ESTADO
      ===================================== */}
      <td>

        <span
          className={
            `new badge ${
              estadoFinal
                ? 'green'
                : 'red'
            }`
          }
          data-badge-caption=""
        >

          {
            estadoFinal
              ? 'Disponible'
              : 'No disponible'
          }

        </span>

      </td>

      {/* =====================================
          ACCIONES
      ===================================== */}
      <td>

        {/* =====================================
            EDITAR
        ===================================== */}
        <a
          className="btn-small blue"
          title="Editar"
          onClick={onEdit}
        >

          <i className="material-icons">
            edit
          </i>

        </a>

        {' '}

        {/* =====================================
            CAMBIAR ESTADO
        ===================================== */}
        <a
          className={`
            btn-small
            ${
              estadoFinal
                ? 'orange'
                : 'grey darken-1'
            }
          `}
          title={
            estadoFinal
              ? 'Deshabilitar producto'
              : 'Habilitar producto'
          }
          onClick={() => {

            /*
              =================================
              SI STOCK = 0
              NO PERMITIR ACTIVAR
              =================================
            */

            if (
              Number(p.stock) <= 0
            ) {

              M.toast({
                html:
                  '⚠️ No puedes habilitar un producto sin stock',
                classes:
                  'orange darken-2'
              });

              return;
            }

            /*
              =================================
              CAMBIAR ESTADO
              =================================
            */

            onToggle(p);

          }}
        >

          <i className="material-icons">
            sync
          </i>

        </a>

        {' '}

        {/* =====================================
            ELIMINAR
        ===================================== */}
        <a
          className="btn-small red"
          title="Eliminar"
          onClick={onDelete}
        >

          <i className="material-icons">
            delete
          </i>

        </a>

      </td>

    </tr>

  );
}

export default function ProductosTable({
  productos,
  onCreateClick,
  onEdit,
  onToggle,
  onDelete
}) {

  return (

    <div className="row">

      <div className="col s12">

        <div
          className="card"
          style={{
            borderRadius: 12
          }}
        >

          <div className="card-content">

            {/* =====================================
                HEADER
            ===================================== */}
            <div
              className="row valign-wrapper"
              style={{
                marginBottom: 0
              }}
            >

              <div className="col s12 m6">

                <span className="card-title">
                  Gestión de Productos
                </span>

              </div>

              <div className="col s12 m6 right-align">

                <a
                  className="
                    btn
                    waves-effect
                    waves-light
                  "
                  style={{
                    background: '#F9A825',
                    fontWeight: 700
                  }}
                  onClick={onCreateClick}
                >

                  <i className="material-icons left">
                    add_box
                  </i>

                  Crear Producto

                </a>

              </div>

            </div>

            {/* =====================================
                TABLA
            ===================================== */}
            <table
              className="
                highlight
                responsive-table
                centered
              "
            >

              <thead>

                <tr>

                  <th>Imagen</th>

                  <th>Producto</th>

                  <th>Categoría</th>

                  <th>Precio</th>

                  <th>Stock</th>

                  <th>Estado</th>

                  <th>Acciones</th>

                </tr>

              </thead>

              <tbody>

                {
                  productos.length === 0
                    ? (

                      <tr>

                        <td
                          colSpan={7}
                          style={{
                            color: '#aaa',
                            padding: 30
                          }}
                        >

                          Sin productos

                        </td>

                      </tr>

                    )
                    : (

                      productos.map((p) => (

                        <ProductRow
                          key={p._id}
                          p={p}
                          onEdit={() => onEdit(p)}
                          onToggle={() => onToggle(p)}
                          onDelete={() => onDelete(p._id)}
                        />

                      ))

                    )
                }

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  );
}