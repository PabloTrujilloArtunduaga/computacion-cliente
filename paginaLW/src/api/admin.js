import axios from "axios";

// ============================================
// CONFIG AXIOS
// Usa VITE_API_URL del .env (sin /api al final
// porque axios usa baseURL + rutas relativas).
// Misma variable que constants/api.js.
// ============================================

const API_URL =
  import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/api$/, "")
    : "http://localhost:3000";

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

    console.log("🔑 TOKEN ENVIADO:", token);

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

  console.error(
    "📌 STATUS:",
    error?.response?.status
  );

  console.error(
    "📌 URL:",
    error?.config?.url
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

      console.log(
        "📡 GET /api/usuarios"
      );

      const res =
        await api.get(
          "/api/usuarios"
        );

      console.log(
        "✅ USUARIOS:",
        res.data
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

      console.log(
        "📡 GET /api/products"
      );

      const res =
        await api.get(
          "/api/products"
        );

      console.log(
        "✅ PRODUCTOS:",
        res.data
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

      console.log(
        "📡 GET /api/categories"
      );

      const res =
        await api.get(
          "/api/categories"
        );

      console.log(
        "✅ CATEGORIAS:",
        res.data
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

      console.log(
        "📡 GET /api/empleados"
      );

      const res =
        await api.get(
          "/api/empleados"
        );

      console.log(
        "✅ EMPLEADOS:",
        res.data
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

      console.log(
        "📡 GET /api/facturas"
      );

      const res =
        await api.get(
          "/api/facturas"
        );

      console.log(
        "✅ FACTURAS:",
        res.data
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

      console.log(
        "📡 GET /api/facturas/ventas-mes"
      );

      const res =
        await api.get(
          "/api/facturas/ventas-mes"
        );

      console.log(
        "✅ VENTAS POR MES:",
        res.data
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