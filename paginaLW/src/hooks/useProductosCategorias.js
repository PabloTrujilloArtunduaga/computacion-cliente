import { useState, useEffect, useCallback } from 'react';
import { API } from '../constants/api';

export function useProductosCategorias() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [toast, setToast] = useState(null);

  // ───────────── TOAST ─────────────
  const showToast = useCallback((msg, color = '#388e3c') => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ───────────── NORMALIZADOR ─────────────
  const normalizeProducto = (p) => ({
    ...p,
    categoria_id: p.categoria_id?._id || p.categoria_id || null,
    categoria_nombre:
      p.categoria_id?.nombre || p.categoria_nombre || '—',
  });

  // ───────────── FETCH ─────────────
  const fetchProductos = useCallback(async () => {
    try {
      const res = await fetch(`${API}/products`);
      const data = await res.json();

      const normalized = data.map(normalizeProducto);
      setProductos(normalized);

    } catch {
      showToast('Error al cargar productos', '#c62828');
    }
  }, [showToast]);

  const fetchCategorias = useCallback(async () => {
    try {
      const res = await fetch(`${API}/categories`);
      const data = await res.json();
      setCategorias(data);
    } catch {
      showToast('Error al cargar categorías', '#c62828');
    }
  }, [showToast]);

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, [fetchProductos, fetchCategorias]);

  // ───────────── VALIDACIÓN ─────────────
  const validateCategoria = (id) => {
    if (!id) return false;
    return categorias.some(c => c._id === id);
  };

  // ───────────── PRODUCT CRUD ─────────────
  const handleCreateProduct = useCallback(async (body) => {
    try {
      // 🔥 VALIDACIÓN CRÍTICA
      if (!validateCategoria(body.categoria_id)) {
        showToast('Categoría inválida', '#c62828');
        return false;
      }

      const cleanBody = {
        ...body,
        categoria_id: String(body.categoria_id),
      };

      const res = await fetch(`${API}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanBody),
      });

      if (!res.ok) {
        const d = await res.json();
        showToast(d.message || 'Error al crear', '#c62828');
        return false;
      }

      await fetchProductos();
      showToast('Producto creado exitosamente');
      return true;

    } catch {
      showToast('Error de conexión', '#c62828');
      return false;
    }
  }, [fetchProductos, showToast, categorias]);

  const handleUpdateProduct = useCallback(async (id, body) => {
    try {
      if (!validateCategoria(body.categoria_id)) {
        showToast('Categoría inválida', '#c62828');
        return false;
      }

      const cleanBody = {
        ...body,
        categoria_id: String(body.categoria_id),
      };

      const res = await fetch(`${API}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanBody),
      });

      if (!res.ok) {
        const d = await res.json();
        showToast(d.message || 'Error al actualizar', '#c62828');
        return false;
      }

      await fetchProductos();
      showToast('Producto actualizado');
      return true;

    } catch {
      showToast('Error de conexión', '#c62828');
      return false;
    }
  }, [fetchProductos, showToast, categorias]);

  const handleDeleteProduct = useCallback(async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;

    try {
      const res = await fetch(`${API}/products/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        showToast('Error al eliminar', '#c62828');
        return;
      }

      await fetchProductos();
      showToast('Producto eliminado');

    } catch {
      showToast('Error de conexión', '#c62828');
    }
  }, [fetchProductos, showToast]);

  const handleToggleProduct = useCallback(async (producto) => {
    try {
      if (!producto.categoria_id) {
        showToast('Producto sin categoría válida', '#c62828');
        return;
      }

      const body = {
        nombre: producto.nombre,
        descripcion: producto.descripcion || '',
        precio: producto.precio,
        stock: producto.stock,
        categoria_id: String(producto.categoria_id),
        imagen: producto.imagen || '',
        codigo_barras: producto.codigo_barras || '',
        estado: !producto.estado,
      };

      const res = await fetch(`${API}/products/${producto._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        showToast('Error al cambiar estado', '#c62828');
        return;
      }

      await fetchProductos();
      showToast('Estado cambiado');

    } catch {
      showToast('Error de conexión', '#c62828');
    }
  }, [fetchProductos, showToast]);

  // ───────────── CATEGORY CRUD ─────────────
  const handleCreateCat = useCallback(async (body) => {
    try {
      const res = await fetch(`${API}/category`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const d = await res.json();
        showToast(d.message || 'Error al crear', '#c62828');
        return false;
      }

      await fetchCategorias();
      showToast('Categoría creada');
      return true;

    } catch {
      showToast('Error de conexión', '#c62828');
      return false;
    }
  }, [fetchCategorias, showToast]);

  const handleUpdateCat = useCallback(async (id, body) => {
    try {
      const res = await fetch(`${API}/category/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const d = await res.json();
        showToast(d.message || 'Error al actualizar', '#c62828');
        return false;
      }

      await fetchCategorias();
      showToast('Categoría actualizada');
      return true;

    } catch {
      showToast('Error de conexión', '#c62828');
      return false;
    }
  }, [fetchCategorias, showToast]);

  const handleDeleteCat = useCallback(async (id) => {
    if (!window.confirm('¿Eliminar esta categoría?')) return;

    try {
      const res = await fetch(`${API}/category/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        showToast('Error al eliminar', '#c62828');
        return;
      }

      await fetchCategorias();
      showToast('Categoría eliminada');

    } catch {
      showToast('Error de conexión', '#c62828');
    }
  }, [fetchCategorias, showToast]);

  return {
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
  };
}