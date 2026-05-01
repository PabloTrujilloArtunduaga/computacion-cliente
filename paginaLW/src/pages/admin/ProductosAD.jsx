import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useProductosCategorias } from "../../hooks/useProductosCategorias";
import { getCatNombre } from '../../utils/helpers';

import Toast           from '../../components/common/Toast';
import Modal           from '../../components/common/Modal';
import StatsCards      from '../../components/common/StatsCards';
import ProductosTable  from '../../components/products/ProductosTable';
import CategoriasTable from '../../components/products/CategoriasTable';
import ProductForm     from '../../components/products/ProductForm';
import CategoryForm    from '../../components/products/CategoryForm';

export default function ProductosCategoriasPage() {
  const navigate = useNavigate();
  const [modal, setModal] = useState(null);

  const {
    productos,
    categorias,
    toast,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleToggleProduct,
    handleCreateCat,
    handleUpdateCat,
    handleDeleteCat,
  } = useProductosCategorias();

  const closeModal = () => setModal(null);

  return (
    <div className="grey lighten-4" style={{ minHeight: '100vh' }}>
      <Toast toast={toast} />

      {/* Nav */}
      <nav className="blue darken-3">
        <div className="nav-wrapper" style={{ padding: '0 20px' }}>
          <a href="#" className="brand-logo">MalaCopa Admin</a>
          <ul className="right hide-on-med-and-down">
            <li>
              <a onClick={() => navigate('/admin')} style={{ cursor: 'pointer' }}>Inicio</a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="container" style={{ width: '95%', marginTop: 30 }}>
        <StatsCards productos={productos} categorias={categorias} />

        <ProductosTable
          productos={productos}
          onCreateClick={() => setModal({ type: 'createProduct' })}
          onEdit={p => setModal({ type: 'editProduct', data: { ...p, categoria_nombre: getCatNombre(p) } })}
          onToggle={p => handleToggleProduct(p, categorias)}
          onDelete={handleDeleteProduct}
        />

        <CategoriasTable
          categorias={categorias}
          onCreateClick={() => setModal({ type: 'createCat' })}
          onEdit={c => setModal({ type: 'editCat', data: c })}
          onDelete={handleDeleteCat}
        />
      </div>

      {/* Modals */}
      {modal?.type === 'createProduct' && (
        <Modal title="Crear Producto" onClose={closeModal}>
          <ProductForm categorias={categorias} onSave={handleCreateProduct} onClose={closeModal} />
        </Modal>
      )}

      {modal?.type === 'editProduct' && (
        <Modal title="Editar Producto" onClose={closeModal}>
          <ProductForm
            initial={modal.data}
            categorias={categorias}
            onSave={body => handleUpdateProduct(modal.data._id, body)}
            onClose={closeModal}
          />
        </Modal>
      )}

      {modal?.type === 'createCat' && (
        <Modal title="Crear Categoría" onClose={closeModal}>
          <CategoryForm onSave={handleCreateCat} onClose={closeModal} />
        </Modal>
      )}

      {modal?.type === 'editCat' && (
        <Modal title="Editar Categoría" onClose={closeModal}>
          <CategoryForm
            initial={modal.data}
            onSave={body => handleUpdateCat(modal.data._id, body)}
            onClose={closeModal}
          />
        </Modal>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}