import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import { CarritoProvider } from "./context/CarritoContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Inicio from "./pages/Inicio";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import Productos from "./pages/Productos";
import Carrito from "./pages/Carrito";
import Admin from "./pages/admin/Admin.jsx";
import ClienteDashboard from "./pages/cliente/ClienteDashboard";

function Layout() {
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");
  const isCliente = location.pathname.startsWith("/cliente");

  return (
    <>
      {!isAdmin && !isCliente && <Navbar />}

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/carrito" element={<Carrito />} />

          {/* ADMIN */}
          <Route path="/admin" element={<Admin />} />

          {/* CLIENTE */}
          <Route path="/cliente" element={<ClienteDashboard />} />
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