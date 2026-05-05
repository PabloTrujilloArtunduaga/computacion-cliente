import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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

// AUTH
import Login from "./pages/Login";
import Registro from "./pages/Registro";

// ADMIN / EMPLEADO REAL
import Admin from "./pages/admin/Admin.jsx";
import Empleado from "./pages/empleados/empleados.jsx";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// ADMIN PÁGINAS
import ProductosCategoriasPage from "./pages/admin/ProductosAD.jsx";
import UsuariosEmpleadosPage from "./pages/admin/UsuariosAD.jsx";
import FacturasPage from "./pages/admin/Fact.jsx";

// CLIENTE (simple por ahora)
const Cliente = () => <h1>Panel Cliente</h1>;

function App() {
  return (
    <CarritoProvider>
      <Router>
        <Navbar />

        <div className="main-content">
          <Routes>
            {/* PÚBLICO */}
            <Route path="/" element={<Inicio />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/carrito" element={<Carrito />} />

            {/* AUTH */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registro />} />

            {/* ROLES */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/empleado" element={<Empleado />} />
            <Route path="/cliente" element={<Cliente />} />

            {/* EMPLEADO */}
            <Route path="/dashboard-empleado" element={<Dashboard />} />

            {/* ADMIN DETALLE */}
            <Route path="/admin/productos" element={<ProductosCategoriasPage />} />
            <Route path="/admin/usuarios" element={<UsuariosEmpleadosPage />} />
            <Route path="/admin/facturas" element={<FacturasPage />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        <Footer />
      </Router>
    </CarritoProvider>
  );
}

export default App;