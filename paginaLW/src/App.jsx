import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// IMPORTA EL CONTEXT DEL CARRITO
import { CarritoProvider } from "./context/CarritoContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Inicio from "./pages/Inicio";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import Productos from "./pages/Productos";
import Carrito from "./pages/Carrito";
import Dashboard from "./pages/Dashboard"; 

function App() {
  return (
    <CarritoProvider>
      <Router>
        <Navbar />

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/dashboard-empleado" element={<Dashboard />} />

            <Route path="/admin" element={<Admin />} />
            <Route path="/empleado" element={<Empleado />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/admin/productos" element={<ProductosCategoriasPage />} />
            <Route path="/admin/usuarios" element={<UsuariosEmpleadosPage />} />
            <Route path="/admin/facturas" element={<FacturasPage />} />
            
          </Routes>
        </div>

        <Footer />
      </Router>
    </CarritoProvider>
  );
}

export default App;