import axios from 'axios';
import { API_ORIGIN } from '../constants/api';
import { clearSession, fetchConToken, getErrorMessage } from '../utils/api';

const api = axios.create({
  baseURL: API_ORIGIN,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearSession();
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }

    return Promise.reject(error);
  }
);

const request = async (endpoint) => {
  try {
    const { data } = await api.get(endpoint);
    return data;
  } catch (error) {
    const data = error?.response?.data;
    throw new Error(getErrorMessage(data, error.message || 'Error de conexión'));
  }
};

export const getUsuarios = () => request('/api/usuarios');
export const getProductos = () => request('/api/products');
export const getCategorias = () => request('/api/categories');
export const getEmpleados = () => request('/api/empleados');
export const getFacturas = () => request('/api/facturas');
export const getVentasPorMes = () => request('/api/facturas/ventas-mes');

export { fetchConToken };
export default api;
