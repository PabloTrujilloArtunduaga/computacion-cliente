const rawApiUrl =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Quita la barra final para evitar URLs con doble slash.
export const API = rawApiUrl.replace(/\/+$/, '');

// Origen del backend (sin /api), útil para axios y recursos.
export const API_ORIGIN = API.replace(/\/api$/, '');

export default API;
