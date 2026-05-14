import axios from "axios";

// ============================================
// CONFIG AXIOS
// ============================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

// ============================================
// INSTANCE
// ============================================

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// ============================================
// INTERCEPTOR TOKEN
// ============================================

api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("token");

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    return config;

  },
  (error) =>
    Promise.reject(error)
);

// ============================================
// ERROR HANDLER
// ============================================

const handleError = (
  error,
  endpoint
) => {

  console.error(
    `❌ ERROR EN ${endpoint}:`,
    error?.response?.data ||
    error.message
  );

  throw (
    error?.response?.data ||
    error
  );

};

// ============================================
// USUARIOS
// ============================================

export const getUsuarios =
  async () => {

    try {

      const res =
        await api.get(
          "/api/usuarios"
        );

      return res.data;

    } catch (error) {

      handleError(
        error,
        "GET USUARIOS"
      );

    }

  };

// ============================================
// PRODUCTOS
// ============================================

export const getProductos =
  async () => {

    try {

      const res =
        await api.get(
          "/api/productos"
        );

      return res.data;

    } catch (error) {

      handleError(
        error,
        "GET PRODUCTOS"
      );

    }

  };

// ============================================
// CATEGORIAS
// ============================================

export const getCategorias =
  async () => {

    try {

      const res =
        await api.get(
          "/api/categorias"
        );

      return res.data;

    } catch (error) {

      handleError(
        error,
        "GET CATEGORIAS"
      );

    }

  };

// ============================================
// EMPLEADOS
// ============================================

export const getEmpleados =
  async () => {

    try {

      const res =
        await api.get(
          "/api/empleados"
        );

      return res.data;

    } catch (error) {

      handleError(
        error,
        "GET EMPLEADOS"
      );

    }

  };

// ============================================
// FACTURAS
// ============================================

export const getFacturas =
  async () => {

    try {

      const res =
        await api.get(
          "/api/facturas"
        );

      return res.data;

    } catch (error) {

      handleError(
        error,
        "GET FACTURAS"
      );

    }

  };

// ============================================
// VENTAS POR MES
// ============================================

export const getVentasPorMes =
  async () => {

    try {

      const res =
        await api.get(
          "/api/facturas/ventas-mes"
        );

      return res.data;

    } catch (error) {

      handleError(
        error,
        "GET VENTAS POR MES"
      );

    }

  };


// ============================================
// EXPORT DEFAULT
// ============================================

export default api;