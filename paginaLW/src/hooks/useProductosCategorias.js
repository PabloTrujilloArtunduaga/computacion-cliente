import {
  useState,
  useEffect,
  useCallback,
} from "react";

import { API } from "../constants/api";
import { fetchConToken } from "../utils/api";

export function useProductosCategorias() {

  /*
  ==========================================
  STATES
  ==========================================
  */

  const [productos, setProductos] =
    useState([]);

  const [categorias, setCategorias] =
    useState([]);

  const [toast, setToast] =
    useState(null);

  /*
  ==========================================
  TOAST
  ==========================================
  */

  const showToast = useCallback(
    (
      msg,
      color = "#388e3c"
    ) => {

      setToast({
        msg,
        color,
      });

      setTimeout(() => {
        setToast(null);
      }, 3000);

    },
    []
  );

  /*
  ==========================================
  NORMALIZAR PRODUCTO
  ==========================================
  */

  const normalizeProducto =
    (producto) => ({

      ...producto,

      categoria_id:
        producto?.categoria_id?._id ||
        producto?.categoria_id ||
        "",

      categoria_nombre:
        producto?.categoria_id?.nombre ||
        producto?.categoria_nombre ||
        "—",

      /*
      ======================================
      BOOLEAN REAL
      ======================================
      */

      estado:
        producto?.estado === true,

      deleted:
        producto?.deleted === true,

    });

  /*
  ==========================================
  FETCH PRODUCTOS
  ==========================================
  */

  const fetchProductos =
    useCallback(async () => {

      try {

        const res =
          await fetchConToken(
            `${API}/products`
          );

        const data =
          await res.json();

        if (!res.ok) {

          throw new Error(
            data?.message ||
            "Error cargando productos"
          );
        }

        let productosArray = [];

        if (
          Array.isArray(data)
        ) {

          productosArray = data;

        } else if (
          Array.isArray(
            data?.products
          )
        ) {

          productosArray =
            data.products;
        }

        const normalized =
          productosArray.map(
            normalizeProducto
          );

        setProductos(
          normalized
        );

      } catch (error) {

        console.error(
          "ERROR PRODUCTOS:",
          error
        );

        showToast(
          "Error al cargar productos",
          "#c62828"
        );
      }

    }, [showToast]);

  /*
  ==========================================
  FETCH CATEGORÍAS
  ==========================================
  */

  const fetchCategorias =
    useCallback(async () => {

      try {

        const res =
          await fetchConToken(
            `${API}/categories`
          );

        const data =
          await res.json();

        if (!res.ok) {

          throw new Error(
            data?.message ||
            "Error cargando categorías"
          );
        }

        let categoriasArray = [];

        if (
          Array.isArray(data)
        ) {

          categoriasArray = data;

        } else if (
          Array.isArray(
            data?.categories
          )
        ) {

          categoriasArray =
            data.categories;
        }

        setCategorias(
          categoriasArray
        );

      } catch (error) {

        console.error(
          "ERROR CATEGORÍAS:",
          error
        );

        showToast(
          "Error al cargar categorías",
          "#c62828"
        );
      }

    }, [showToast]);

  /*
  ==========================================
  INIT
  ==========================================
  */

  useEffect(() => {

    fetchProductos();
    fetchCategorias();

  }, [
    fetchProductos,
    fetchCategorias,
  ]);

  /*
  ==========================================
  VALIDAR CATEGORÍA
  ==========================================
  */

  const validateCategoria =
    (id) => {

      return categorias.some(
        (categoria) =>
          String(
            categoria._id
          ) === String(id)
      );
    };

  /*
  ==========================================
  BUILD PRODUCT BODY
  ==========================================
  */

  const buildProductBody =
    (body) => ({

      nombre:
        body?.nombre?.trim() || "",

      descripcion:
        body?.descripcion?.trim() || "",

      precio:
        Number(
          body?.precio || 0
        ),

      stock:
        Number(
          body?.stock || 0
        ),

      categoria_id:
        String(
          body?.categoria_id || ""
        ),

      codigo_barras:
        body?.codigo_barras?.trim() || "",

      /*
      ======================================
      IMAGEN
      ======================================
      */

      imagen:
        body?.imagen?.trim()
          ? body.imagen.trim()
          : undefined,

      /*
      ======================================
      ESTADO
      ======================================
      */

      estado:
        body?.estado === true,

      /*
      ======================================
      DELETE
      ======================================
      */

      deleted:
        body?.deleted === true,

    });

  /*
  ==========================================
  CREATE PRODUCT
  ==========================================
  */

  const handleCreateProduct =
    useCallback(
      async (body) => {

        try {

          if (
            !validateCategoria(
              body.categoria_id
            )
          ) {

            showToast(
              "Categoría inválida",
              "#c62828"
            );

            return false;
          }

          const payload =
            buildProductBody({
              ...body,
              deleted: false,
            });

          const res =
            await fetchConToken(
              `${API}/products`,
              {
                method: "POST",

                body: JSON.stringify(
                  payload
                ),
              }
            );

          const data =
            await res.json();

          if (!res.ok) {

            console.log(
              "ERROR CREATE:",
              data
            );

            showToast(
              data?.message ||
              "Error al crear producto",
              "#c62828"
            );

            return false;
          }

          await fetchProductos();

          showToast(
            "Producto creado"
          );

          return true;

        } catch (error) {

          console.error(
            "ERROR CREATE:",
            error
          );

          showToast(
            "Error de conexión",
            "#c62828"
          );

          return false;
        }

      },
      [
        categorias,
        fetchProductos,
        showToast,
      ]
    );

  /*
  ==========================================
  UPDATE PRODUCT
  ==========================================
  */

  const handleUpdateProduct =
    useCallback(
      async (
        id,
        body
      ) => {

        try {

          if (
            !validateCategoria(
              body.categoria_id
            )
          ) {

            showToast(
              "Categoría inválida",
              "#c62828"
            );

            return false;
          }

          const payload =
            buildProductBody(body);

          console.log(
            "UPDATE PAYLOAD:",
            payload
          );

          const res =
            await fetchConToken(
              `${API}/products/${id}`,
              {
                method: "PUT",

                body: JSON.stringify(
                  payload
                ),
              }
            );

          const data =
            await res.json();

          if (!res.ok) {

            console.log(
              "ERROR UPDATE:",
              data
            );

            showToast(
              data?.message ||
              "Error al actualizar producto",
              "#c62828"
            );

            return false;
          }

          await fetchProductos();

          showToast(
            "Producto actualizado"
          );

          return true;

        } catch (error) {

          console.error(
            "ERROR UPDATE:",
            error
          );

          showToast(
            "Error de conexión",
            "#c62828"
          );

          return false;
        }

      },
      [
        categorias,
        fetchProductos,
        showToast,
      ]
    );

  /*
  ==========================================
  DELETE PRODUCT
  ==========================================
  */

  const handleDeleteProduct =
    useCallback(
      async (id) => {

        const confirmacion =
          window.confirm(
            "¿Eliminar producto?"
          );

        if (!confirmacion) {
          return;
        }

        try {

          const res =
            await fetchConToken(
              `${API}/products/${id}`,
              {
                method: "DELETE",
              }
            );

          const data =
            await res.json();

          if (!res.ok) {

            showToast(
              data?.message ||
              "Error eliminando producto",
              "#c62828"
            );

            return;
          }

          /*
          ======================================
          SOFT DELETE
          deleted = true
          ======================================
          */

          await fetchProductos();

          showToast(
            "Producto eliminado"
          );

        } catch (error) {

          console.error(
            "ERROR DELETE:",
            error
          );

          showToast(
            "Error de conexión",
            "#c62828"
          );
        }

      },
      [
        fetchProductos,
        showToast,
      ]
    );

  /*
  ==========================================
  TOGGLE PRODUCT
  ==========================================
  */

  const handleToggleProduct =
    useCallback(
      async (producto) => {

        try {

          /*
          ======================================
          CAMBIAR ESTADO
          true -> false
          false -> true
          ======================================
          */

          const nuevoEstado =
            producto.estado === true
              ? false
              : true;

          const payload = {

            nombre:
              producto?.nombre || "",

            descripcion:
              producto?.descripcion || "",

            precio:
              Number(
                producto?.precio || 0
              ),

            stock:
              Number(
                producto?.stock || 0
              ),

            categoria_id:
              String(
                producto?.categoria_id || ""
              ),

            codigo_barras:
              producto?.codigo_barras || "",

            imagen:
              producto?.imagen || "",

            /*
            ==================================
            ESTADO
            ==================================
            */

            estado:
              nuevoEstado,

            /*
            ==================================
            NO TOCAR DELETE
            ==================================
            */

            deleted:
              producto?.deleted === true,

          };

          console.log(
            "TOGGLE PAYLOAD:",
            payload
          );

          const res =
            await fetchConToken(
              `${API}/products/${producto._id}`,
              {
                method: "PUT",

                body: JSON.stringify(
                  payload
                ),
              }
            );

          const data =
            await res.json();

          console.log(
            "TOGGLE RESPONSE:",
            data
          );

          if (!res.ok) {

            console.log(
              "ERROR TOGGLE:",
              data
            );

            showToast(
              data?.message ||
              "Error al cambiar estado",
              "#c62828"
            );

            return false;
          }

          await fetchProductos();

          showToast(
            nuevoEstado
              ? "Producto disponible"
              : "Producto no disponible"
          );

          return true;

        } catch (error) {

          console.error(
            "ERROR TOGGLE:",
            error
          );

          showToast(
            "Error de conexión",
            "#c62828"
          );

          return false;
        }

      },
      [
        fetchProductos,
        showToast,
      ]
    );

  /*
  ==========================================
  CREATE CATEGORY
  ==========================================
  */

  const handleCreateCat =
    useCallback(
      async (body) => {

        try {

          const res =
            await fetchConToken(
              `${API}/categories`,
              {
                method: "POST",

                body: JSON.stringify(
                  body
                ),
              }
            );

          const data =
            await res.json();

          if (!res.ok) {

            showToast(
              data?.message ||
              "Error creando categoría",
              "#c62828"
            );

            return false;
          }

          await fetchCategorias();

          showToast(
            "Categoría creada"
          );

          return true;

        } catch (error) {

          console.error(
            "ERROR CREATE CAT:",
            error
          );

          showToast(
            "Error de conexión",
            "#c62828"
          );

          return false;
        }

      },
      [
        fetchCategorias,
        showToast,
      ]
    );

  /*
  ==========================================
  UPDATE CATEGORY
  ==========================================
  */

  const handleUpdateCat =
    useCallback(
      async (
        id,
        body
      ) => {

        try {

          const res =
            await fetchConToken(
              `${API}/categories/${id}`,
              {
                method: "PUT",

                body: JSON.stringify(
                  body
                ),
              }
            );

          const data =
            await res.json();

          if (!res.ok) {

            showToast(
              data?.message ||
              "Error actualizando categoría",
              "#c62828"
            );

            return false;
          }

          await fetchCategorias();

          showToast(
            "Categoría actualizada"
          );

          return true;

        } catch (error) {

          console.error(
            "ERROR UPDATE CAT:",
            error
          );

          showToast(
            "Error de conexión",
            "#c62828"
          );

          return false;
        }

      },
      [
        fetchCategorias,
        showToast,
      ]
    );

  /*
  ==========================================
  DELETE CATEGORY
  ==========================================
  */

  const handleDeleteCat =
    useCallback(
      async (id) => {

        const confirmacion =
          window.confirm(
            "¿Eliminar categoría?"
          );

        if (!confirmacion) {
          return;
        }

        try {

          const res =
            await fetchConToken(
              `${API}/categories/${id}`,
              {
                method: "DELETE",
              }
            );

          const data =
            await res.json();

          if (!res.ok) {

            showToast(
              data?.message ||
              "Error eliminando categoría",
              "#c62828"
            );

            return;
          }

          await fetchCategorias();

          showToast(
            "Categoría eliminada"
          );

        } catch (error) {

          console.error(
            "ERROR DELETE CAT:",
            error
          );

          showToast(
            "Error de conexión",
            "#c62828"
          );
        }

      },
      [
        fetchCategorias,
        showToast,
      ]
    );

  /*
  ==========================================
  RETURN
  ==========================================
  */

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