import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import { CarritoProvider } from "./context/CarritoContext";


import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


// CONTEXT
import { CarritoProvider } from "./context/CarritoContext";

// COMPONENTES
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// PÁGINAS
import Inicio from "./pages/Inicio";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import Productos from "./pages/Productos";
import Carrito from "./pages/Carrito";
import Login from "./pages/Login";
import Registro from "./pages/Registro";


const Admin = () => <h1>Panel Admin</h1>;
const Empleado = () => <h1>Panel Empleado</h1>;
const Cliente = () => <h1>Panel Cliente</h1>;

// ADMIN / EMPLEADO
import Admin from "./pages/admin/Admin.jsx";
import Empleado from "./pages/empleados/empleados.jsx";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ProductosCategoriasPage from "./pages/admin/ProductosAD.jsx";
import UsuariosEmpleadosPage from "./pages/admin/UsuariosAD.jsx";
import FacturasPage from "./pages/admin/Fact.jsx";

function App() {
  return (
    <CarritoProvider>
      <Router>
        <Navbar />

        <div className="main-content">
          <Routes>
            {/* rutas normales */}
            {/* PÚBLICO */}
            <Route path="/" element={<Inicio />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/carrito" element={<Carrito />} />

            {/* auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registro />} />

            {/* RUTAS POR ROL (CLAVE) */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/empleado" element={<Empleado />} />
            <Route path="/cliente" element={<Cliente />} />
            {/* EMPLEADO */}
            <Route path="/empleado" element={<Empleado />} />
            <Route path="/dashboard-empleado" element={<Dashboard />} />

            {/* ADMIN */}
            <Route path="/admin" element={<Admin />} />
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