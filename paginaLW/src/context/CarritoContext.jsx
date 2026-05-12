import React, {
  createContext,
  useEffect,
  useState
} from "react";

export const CarritoContext = createContext();

export function CarritoProvider({ children }) {

  // =========================================
  // ESTADOS
  // =========================================
  const [carrito, setCarrito] = useState([]);

  const [total, setTotal] = useState(0);


  // =========================================
  // CARGAR LOCALSTORAGE
  // =========================================
  useEffect(() => {

    const carritoGuardado = localStorage.getItem("carrito");

    if (carritoGuardado) {

      const carritoParseado = JSON.parse(carritoGuardado);

      setCarrito(carritoParseado);

    }

  }, []);


  // =========================================
  // RECALCULAR TOTAL
  // =========================================
  useEffect(() => {

    const nuevoTotal = carrito.reduce(
      (acc, item) =>
        acc + (item.precio * item.cantidad),
      0
    );

    setTotal(nuevoTotal);

    // Guardar carrito
    localStorage.setItem(
      "carrito",
      JSON.stringify(carrito)
    );

  }, [carrito]);


  // =========================================
  // AGREGAR PRODUCTO
  // =========================================
  const agregarAlCarrito = (producto) => {

    setCarrito((prev) => {

      // ✅ BUSCAR POR _id
      const existe = prev.find(
        (p) => p._id === producto._id
      );

      // =====================================
      // SI YA EXISTE
      // =====================================
      if (existe) {

        return prev.map((p) =>

          p._id === producto._id

            ? {
                ...p,
                cantidad: p.cantidad + 1
              }

            : p

        );

      }

      // =====================================
      // NUEVO PRODUCTO
      // =====================================
      return [

        ...prev,

        {
          ...producto,
          cantidad: 1
        }

      ];

    });

  };


  // =========================================
  // ACTUALIZAR CANTIDAD
  // =========================================
  const actualizarCantidad = (_id, delta) => {

    setCarrito((prev) =>

      prev.map((p) =>

        p._id === _id

          ? {
              ...p,

              cantidad: Math.max(
                p.cantidad + delta,
                1
              )
            }

          : p

      )

    );

  };


  // =========================================
  // ELIMINAR PRODUCTO
  // =========================================
  const eliminarProducto = (_id) => {

    setCarrito((prev) =>

      prev.filter(
        (p) => p._id !== _id
      )

    );

  };


  // =========================================
  // VACIAR CARRITO
  // =========================================
  const vaciarCarrito = () => {

    setCarrito([]);

    localStorage.removeItem("carrito");

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
        setTotal

      }}
    >

      {children}

    </CarritoContext.Provider>

  );

}