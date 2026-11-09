import { API } from '../constants/api';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export const getToken = () => localStorage.getItem('token');

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('rol');
  localStorage.removeItem('user');
};

const redirectToLogin = () => {
  if (window.location.pathname !== '/login') {
    window.location.assign('/login');
  }
};

/** Lee la respuesta como JSON sin romperse si viene vacía o es texto. */
export const parseJsonSafe = async (res) => {
  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

export const getErrorMessage = (data, fallback = 'Error de conexión con el servidor') => {
  if (!data) return fallback;

  if (Array.isArray(data.error)) {
    return data.error
      .map((item) => (item?.field ? `${item.field}: ${item.message}` : item?.message))
      .filter(Boolean)
      .join(' | ');
  }

  if (typeof data.error === 'string' && data.error) return data.error;

  return data.message || data.mensaje || fallback;
};

/**
 * Fetch con token. Devuelve la Response para mantener compatibilidad
 * con los llamados existentes.
 */
export const fetchConToken = async (url, options = {}) => {
  const token = getToken();
  const headers = { ...options.headers };

  if (options.body && !headers['Content-Type']) {
    Object.assign(headers, JSON_HEADERS);
  }

  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });

  // Solo cerramos sesión si el token realmente no sirve.
  if (res.status === 401) {
    clearSession();
    redirectToLogin();
  }

  return res;
};

/**
 * Petición JSON al API que devuelve datos o lanza ApiError con mensaje legible.
 * `path` es relativo a /api, por ejemplo: "/products".
 */
export const apiFetch = async (path, options = {}) => {
  const url = path.startsWith('http') ? path : `${API}${path}`;
  const res = await fetchConToken(url, options);
  const data = await parseJsonSafe(res);

  if (!res.ok) {
    throw new ApiError(getErrorMessage(data), res.status, data?.error);
  }

  return data;
};
