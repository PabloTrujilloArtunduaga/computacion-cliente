import React, { useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { CarritoProvider } from "./context/CarritoContext";
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// CONTEXT
import { CarritoProvider } from "./context/CarritoContext";

// COMPONENTES
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// PÁGINAS PÚBLICAS
import Inicio from "./pages/Inicio";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import Productos from "./pages/Productos";
import Carrito from "./pages/Carrito";

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function App() {
  const mainContentRef = useRef(null);

  useGSAP(() => {
    // 🔹 ACCESIBILIDAD: Desactivar animaciones si el usuario lo prefiere en su S.O.
    gsap.matchMedia().add("(prefers-reduced-motion: reduce)", () => {
      gsap.globalTimeline.timeScale(1000); 
    });

    // Animación de entrada global
    gsap.from(mainContentRef.current, {
      y: 30,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.2,
      clearProps: "all" 
    });
  });
// AUTH
import Login from "./pages/Login";
import Registro from "./pages/Registro";

// ROLES
import Admin from "./pages/admin/Admin.jsx";
//import Empleado from "./pages/empleados/empleados.jsx";
import Dashboard from "./pages/empleados/Dashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./ProtectedRoute.jsx";

// ADMIN PÁGINAS
import ProductosCategoriasPage from "./pages/admin/ProductosAD.jsx";
import UsuariosEmpleadosPage from "./pages/admin/UsuariosAD.jsx";
import FacturasPage from "./pages/admin/Fact.jsx";

// CLIENTE
import ClienteDashboard from "./pages/cliente/ClienteDashboard";

// Layout inteligente
function Layout() {
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");
  const isCliente = location.pathname.startsWith("/cliente");

  return (
    <>
      {!isAdmin && !isCliente && <Navbar />}

      <div className="main-content">
        <Routes>
          {/* PÚBLICO */}
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/carrito" element={<Carrito />} />

        <div ref={mainContentRef} className="main-content">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/dashboard-empleado" element={<Dashboard />} />
          </Routes>
        </div>
          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registro />} />

          {/* ROLES */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute rolPermitido="admin">
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
              path="/cliente"
              element={
                <ProtectedRoute rolPermitido="cliente">
                  <ClienteDashboard />
                </ProtectedRoute>
              }
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

          {/* ADMIN DETALLE */}
          <Route path="/admin/productos" element={<ProductosCategoriasPage />} />
          <Route path="/admin/usuarios" element={<UsuariosEmpleadosPage />} />
          <Route path="/admin/facturas" element={<FacturasPage />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {!isAdmin && !isCliente && <Footer />}
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