import axios from 'axios';

const API_URL = 'http://localhost:3001'; // Cambia el puerto si tu backend usa otro

export const getUsuarios = async (token) => {
  const res = await axios.get(`${API_URL}/api/usuarios`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getProductos = async () => {
  const res = await axios.get(`${API_URL}/api/productos`);
  return res.data;
};

export const getCategorias = async () => {
  const res = await axios.get(`${API_URL}/api/categorias`);
  return res.data;
};

export const getEmpleados = async (token) => {
  const res = await axios.get(`${API_URL}/api/empleados`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getFacturas = async (token) => {
  const res = await axios.get(`${API_URL}/api/facturas`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getVentasPorMes = async (token) => {
  const res = await axios.get(`${API_URL}/api/facturas/ventas-mes`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getProductosMasVendidos = async (token) => {
  const res = await axios.get(`${API_URL}/api/facturas/mas-vendidos`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
