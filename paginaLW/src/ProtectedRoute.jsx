import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, rolPermitido }) {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  // 🔒 Si no hay token → al inicio
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 🔒 Si el rol no coincide → al inicio
  if (rolPermitido && rol !== rolPermitido) {
    return <Navigate to="/" replace />;
  }

  return children;
}