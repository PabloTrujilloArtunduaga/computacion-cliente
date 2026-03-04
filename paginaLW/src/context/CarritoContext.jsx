import React, { createContext, useState } from "react";

export const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existing = prev.find((p) => p.titulo === producto.titulo);
      if (existing) {
        // Si hay prodicto, aumentamos cantidad
        return prev.map((p) =>
          p.titulo === producto.titulo
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        );
      }
      
      // Si no existe prodcuto, agregamos con cantidad 1
      return [...prev, { ...producto, cantidad: 1 }];
    });

    setTotal((prevTotal) => prevTotal + (producto.precio || 0));
  };

  const actualizarCantidad = (titulo, delta) => {
    setCarrito((prev) => {
      const newCarrito = prev.map((p) =>
        p.titulo === titulo
          ? { ...p, cantidad: Math.max(p.cantidad + delta, 1) }
          : p
      );
      return newCarrito;
    });
    // Recalcular total
    setTotal((prevTotal) =>
      carrito.reduce(
        (acc, p) => acc + p.precio * p.cantidad,
        0
      )
    );
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    setTotal(0);
  };

  return (
    <CarritoContext.Provider
      value={{ carrito, total, agregarAlCarrito, actualizarCantidad, vaciarCarrito, setCarrito, setTotal }}
    >
      {children}
    </CarritoContext.Provider>
  );
}
