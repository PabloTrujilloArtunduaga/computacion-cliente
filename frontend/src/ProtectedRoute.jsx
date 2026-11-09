import { Navigate } from 'react-router-dom';

/** Decodifica el payload del JWT sin validar la firma (el backend la valida). */
const decodePayload = (token) => {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;

    const base64 = payload
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(Math.ceil(payload.length / 4) * 4, '=');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
};

export default function ProtectedRoute({ children, rolPermitido }) {
  const token = localStorage.getItem('token');
  const payload = token ? decodePayload(token) : null;

  // Token ausente, mal formado o expirado
  const expirado = payload?.exp ? payload.exp * 1000 <= Date.now() : false;

  if (!token || !payload || expirado) {
    if (token) {
      localStorage.removeItem('token');
      localStorage.removeItem('rol');
      localStorage.removeItem('user');
    }

    return <Navigate to="/login" replace />;
  }

  if (rolPermitido && payload.rol !== rolPermitido) {
    return <Navigate to="/" replace />;
  }

  return children;
}
