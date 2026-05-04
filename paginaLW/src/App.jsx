import React, { useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { CarritoProvider } from "./context/CarritoContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Inicio from "./pages/Inicio";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import Productos from "./pages/Productos";
import Carrito from "./pages/Carrito";
import Dashboard from "./pages/Dashboard"; 

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

  return (
    <CarritoProvider>
      <Router>
        <Navbar />

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

        <Footer />
      </Router>
    </CarritoProvider>
  );
}

export default App;