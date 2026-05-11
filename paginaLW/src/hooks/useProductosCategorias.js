import { useState, useEffect, useCallback } from "react";
import { API } from "../constants/api";
import { fetchConToken } from "../utils/api";

export function useProductosCategorias() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [toast, setToast] = useState(null);

  // ───────── TOAST ─────────
  const showToast = useCallback((msg, color = "#388e3c") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ───────── NORMALIZAR PRODUCTO ─────────
  const normalizeProducto = (p) => ({
    ...p,
    categoria_id: p.categoria_id?._id || p.categoria_id || null,
    categoria_nombre: p.categoria_id?.nombre || "—",
  });

  // ───────── FETCH PRODUCTOS ─────────
  const fetchProductos = useCallback(async () => {
    try {
      const res = await fetchConToken(`${API}/products`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error productos");
      }

      const normalized = Array.isArray(data)
        ? data.map(normalizeProducto)
        : [];

      setProductos(normalized);
    } catch (err) {
      console.error(err);
      showToast("Error al cargar productos", "#c62828");
    }
  }, [showToast]);

  // ───────── FETCH CATEGORÍAS ─────────
  const fetchCategorias = useCallback(async () => {
    try {
      const res = await fetchConToken(`${API}/categories`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error categorías");
      }

      setCategorias(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      showToast("Error al cargar categorías", "#c62828");
    }
  }, [showToast]);

  // ───────── INIT ─────────
  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, [fetchProductos, fetchCategorias]);

  // ───────── VALIDACIÓN ─────────
  const validateCategoria = (id) =>
    categorias.some((c) => String(c._id) === String(id));

  // ───────── CREATE PRODUCT ─────────
  const handleCreateProduct = useCallback(
    async (body) => {
      try {
        if (!validateCategoria(body.categoria_id)) {
          showToast("Categoría inválida", "#c62828");
          return false;
        }

        const res = await fetchConToken(`${API}/products`, {
          method: "POST",
          body: JSON.stringify({
            ...body,
            categoria_id: String(body.categoria_id),
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          showToast(data.message || "Error al crear", "#c62828");
          return false;
        }

        await fetchProductos();
        showToast("Producto creado");
        return true;
      } catch (err) {
        console.error(err);
        showToast("Error de conexión", "#c62828");
        return false;
      }
    },
    [fetchProductos, showToast, categorias]
  );

  // ───────── UPDATE PRODUCT ─────────
  const handleUpdateProduct = useCallback(
    async (id, body) => {
      try {
        if (!validateCategoria(body.categoria_id)) {
          showToast("Categoría inválida", "#c62828");
          return false;
        }

        const res = await fetchConToken(`${API}/products/${id}`, {
          method: "PUT",
          body: JSON.stringify({
            ...body,
            categoria_id: String(body.categoria_id),
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          showToast(data.message || "Error al actualizar", "#c62828");
          return false;
        }

        await fetchProductos();
        showToast("Producto actualizado");
        return true;
      } catch (err) {
        console.error(err);
        showToast("Error de conexión", "#c62828");
        return false;
      }
    },
    [fetchProductos, showToast, categorias]
  );

  // ───────── DELETE PRODUCT ─────────
  const handleDeleteProduct = useCallback(
    async (id) => {
      if (!window.confirm("¿Eliminar producto?")) return;

      try {
        const res = await fetchConToken(`${API}/products/${id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (!res.ok) {
          showToast(data.message || "Error al eliminar", "#c62828");
          return;
        }

        await fetchProductos();
        showToast("Producto eliminado");
      } catch (err) {
        console.error(err);
        showToast("Error de conexión", "#c62828");
      }
    },
    [fetchProductos, showToast]
  );

  // ───────── TOGGLE PRODUCT ─────────
  const handleToggleProduct = useCallback(
    async (producto) => {
      try {
        const res = await fetchConToken(
          `${API}/products/${producto._id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              ...producto,
              categoria_id: String(producto.categoria_id),
              estado: !producto.estado,
            }),
          }
        );

        if (!res.ok) {
          showToast("Error al cambiar estado", "#c62828");
          return;
        }

        await fetchProductos();
        showToast("Estado actualizado");
      } catch (err) {
        console.error(err);
        showToast("Error de conexión", "#c62828");
      }
    },
    [fetchProductos, showToast]
  );

  // ───────── CATEGORY ─────────
  const handleCreateCat = useCallback(
    async (body) => {
      try {
        const res = await fetchConToken(`${API}/categories`, {
          method: "POST",
          body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
          showToast(data.message || "Error categoría", "#c62828");
          return false;
        }

        await fetchCategorias();
        showToast("Categoría creada");
        return true;
      } catch (err) {
        console.error(err);
        showToast("Error de conexión", "#c62828");
        return false;
      }
    },
    [fetchCategorias, showToast]
  );

  const handleUpdateCat = useCallback(
    async (id, body) => {
      try {
        const res = await fetchConToken(
          `${API}/categories/${id}`,
          {
            method: "PUT",
            body: JSON.stringify(body),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          showToast(data.message || "Error categoría", "#c62828");
          return false;
        }

        await fetchCategorias();
        showToast("Categoría actualizada");
        return true;
      } catch (err) {
        console.error(err);
        showToast("Error de conexión", "#c62828");
        return false;
      }
    },
    [fetchCategorias, showToast]
  );

  const handleDeleteCat = useCallback(
    async (id) => {
      if (!window.confirm("¿Eliminar categoría?")) return;

      try {
        const res = await fetchConToken(
          `${API}/categories/${id}`,
          { method: "DELETE" }
        );

        const data = await res.json();

        if (!res.ok) {
          showToast(data.message || "Error categoría", "#c62828");
          return;
        }

        await fetchCategorias();
        showToast("Categoría eliminada");
      } catch (err) {
        console.error(err);
        showToast("Error de conexión", "#c62828");
      }
    },
    [fetchCategorias, showToast]
  );

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