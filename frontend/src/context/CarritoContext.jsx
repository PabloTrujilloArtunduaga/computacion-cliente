import { createContext, useEffect, useState } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const CarritoContext = createContext(null);

const CARRITO_INVITADO = 'carrito_invitado';

const getCarritoKey = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?._id ? `carrito_${user._id}` : CARRITO_INVITADO;
  } catch {
    return CARRITO_INVITADO;
  }
};

const leerCarrito = (key) => {
  try {
    const raw = localStorage.getItem(key);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const calcularTotal = (carrito) =>
  carrito.reduce(
    (acc, item) => acc + Number(item.precio || 0) * Number(item.cantidad || 0),
    0
  );

export function CarritoProvider({ children }) {
  const [carritoKey] = useState(getCarritoKey);
  const [carrito, setCarrito] = useState(() => leerCarrito(getCarritoKey()));
  const [total, setTotal] = useState(() => calcularTotal(leerCarrito(getCarritoKey())));

  // Mantiene el total sincronizado con el carrito.
  useEffect(() => {
    setTotal(calcularTotal(carrito));
  }, [carrito]);

  // Persiste el carrito del usuario actual.
  useEffect(() => {
    localStorage.setItem(carritoKey, JSON.stringify(carrito));
  }, [carrito, carritoKey]);

  const agregarAlCarrito = (producto) => {
    if (!producto?._id) return;

    setCarrito((prev) => {
      const existe = prev.find((item) => item._id === producto._id);

      if (existe) {
        return prev.map((item) =>
          item._id === producto._id
            ? { ...item, cantidad: Number(item.cantidad) + 1 }
            : item
        );
      }

      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const actualizarCantidad = (_id, delta) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item._id === _id
          ? {
              ...item,
              cantidad: Math.max(Number(item.cantidad) + delta, 1),
            }
          : item
      )
    );
  };

  const eliminarProducto = (_id) => {
    setCarrito((prev) => prev.filter((item) => item._id !== _id));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    setTotal(0);
    localStorage.removeItem(carritoKey);
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        total,
        agregarAlCarrito,
        actualizarCantidad,
        eliminarProducto,
        vaciarCarrito,
        setCarrito,
        setTotal,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}
