import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


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


const Admin = () => <h1>Panel Administrador</h1>;
const Empleado = () => <h1>Panel Empleado</h1>;
const Cliente = () => <h1>Panel Cliente</h1>;

function App() {
  return (
    <CarritoProvider>
      <Router>
        <Navbar />

        <div className="main-content">
          <Routes>
            {/* rutas normales */}
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
          </Routes>
        </div>

        <Footer />
      </Router>
    </CarritoProvider>
  );
}

export default App;