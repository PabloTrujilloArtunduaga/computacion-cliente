import React from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { CarritoProvider } from "./context/CarritoContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Inicio from "./pages/Inicio";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import Productos from "./pages/Productos";
import Carrito from "./pages/Carrito";

import Login from "./pages/Login";
import Registro from "./pages/Registro";

import Admin from "./pages/admin/Admin.jsx";

import Dashboard from "./pages/empleados/Dashboard";

import NotFound from "./pages/NotFound";

import ProtectedRoute from "./ProtectedRoute.jsx";

import ProductosCategoriasPage from "./pages/admin/ProductosAD.jsx";

import UsuariosEmpleadosPage from "./pages/admin/UsuariosAD.jsx";

import FacturasPage from "./pages/admin/Fact.jsx";

import ClienteDashboard from "./pages/cliente/ClienteDashboard";

function Layout() {
  const location = useLocation();

  const isAdmin =
    location.pathname.startsWith(
      "/admin"
    );

  const isCliente =
    location.pathname.startsWith(
      "/cliente"
    );

  return (
    <>
      {!isAdmin &&
        !isCliente && <Navbar />}

      <main className="main-content">
        <Routes>
          {/* PUBLICO */}
          <Route
            path="/"
            element={<Inicio />}
          />

          <Route
            path="/productos"
            element={<Productos />}
          />

          <Route
            path="/nosotros"
            element={<Nosotros />}
          />

          <Route
            path="/contacto"
            element={<Contacto />}
          />

          <Route
            path="/carrito"
            element={<Carrito />}
          />

          {/* AUTH */}
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Registro />}
          />

          {/* EMPLEADO */}
          <Route
            path="/dashboard-empleado"
            element={
              <ProtectedRoute rolPermitido="empleado">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* CLIENTE */}
          <Route
            path="/cliente"
            element={
              <ProtectedRoute rolPermitido="cliente">
                <ClienteDashboard />
              </ProtectedRoute>
            }
          />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute rolPermitido="admin">
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/productos"
            element={
              <ProductosCategoriasPage />
            }
          />

          <Route
            path="/admin/usuarios"
            element={
              <UsuariosEmpleadosPage />
            }
          />

          <Route
            path="/admin/facturas"
            element={<FacturasPage />}
          />

          {/* 404 */}
          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </main>

      {!isAdmin &&
        !isCliente && <Footer />}
    </>
  );
}

function App() {
  return (
    <CarritoProvider>
      <Router>
        <Layout />
      </Router>
    </CarritoProvider>
  );
}

export default App;