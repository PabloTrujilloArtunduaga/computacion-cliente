import {
  Navigate
} from "react-router-dom";

export default function ProtectedRoute({
  children,
  rolPermitido
}) {

  /*
    =========================
    OBTENER DATOS
    =========================
  */

  const token =
    localStorage.getItem("token");

  const rol =
    localStorage.getItem("rol");

  /*
    =========================
    VALIDAR TOKEN
    =========================
  */

  if (!token) {

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  /*
    =========================
    VALIDAR ROL
    =========================
  */

  if (
    rolPermitido &&
    rol !== rolPermitido
  ) {

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  /*
    =========================
    TODO OK
    =========================
  */

  return children;
}