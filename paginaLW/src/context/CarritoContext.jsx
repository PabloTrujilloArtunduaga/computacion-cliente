import React, {
  createContext,
  useEffect,
  useState
} from "react";

export const CarritoContext =
  createContext();

export function CarritoProvider({
  children
}) {

  // =========================================
  // ESTADOS
  // =========================================

  const [carrito, setCarrito] =
    useState([]);

  const [total, setTotal] =
    useState(0);

  const [carritoKey, setCarritoKey] =
    useState("carrito_invitado");

  // =========================================
  // CARGAR USER
  // =========================================

  useEffect(() => {

    try {

      const user =
        JSON.parse(
          localStorage.getItem("user")
        );

      console.log("=================================");
      console.log("👤 USER LOCALSTORAGE:");
      console.log(user);

      // =====================================
      // KEY POR USUARIO
      // =====================================

      const nuevaKey =
        user?._id
          ? `carrito_${user._id}`
          : "carrito_invitado";

      console.log("🛒 CARRITO KEY:");
      console.log(nuevaKey);

      setCarritoKey(nuevaKey);

    } catch (error) {

      console.error(
        "❌ ERROR LEYENDO USER:",
        error
      );

      setCarritoKey(
        "carrito_invitado"
      );

    }

  }, []);

  // =========================================
  // CARGAR CARRITO
  // =========================================

  useEffect(() => {

    try {

      console.log("=================================");
      console.log("📦 CARGANDO CARRITO");

      const carritoGuardado =
        localStorage.getItem(
          carritoKey
        );

      console.log("🛒 KEY:");
      console.log(carritoKey);

      console.log("💾 DATA:");
      console.log(carritoGuardado);

      if (carritoGuardado) {

        const carritoParseado =
          JSON.parse(
            carritoGuardado
          );

        console.log(
          "✅ CARRITO CARGADO:"
        );

        console.log(
          carritoParseado
        );

        setCarrito(
          carritoParseado
        );

      } else {

        console.log(
          "⚠️ NO EXISTE CARRITO"
        );

        setCarrito([]);

      }

    } catch (error) {

      console.error(
        "❌ ERROR CARGANDO CARRITO:",
        error
      );

      setCarrito([]);

    }

  }, [carritoKey]);

  // =========================================
  // RECALCULAR TOTAL
  // =========================================

  useEffect(() => {

    const nuevoTotal =
      carrito.reduce(

        (acc, item) =>

          acc +

          (
            Number(item.precio) *
            Number(item.cantidad)
          ),

        0

      );

    setTotal(nuevoTotal);

    console.log("=================================");
    console.log("💰 TOTAL:");
    console.log(nuevoTotal);

    // =====================================
    // GUARDAR
    // =====================================

    localStorage.setItem(

      carritoKey,

      JSON.stringify(carrito)

    );

    console.log("💾 CARRITO GUARDADO");

  }, [carrito, carritoKey]);

  // =========================================
  // AGREGAR
  // =========================================

  const agregarAlCarrito =
    (producto) => {

      console.log("=================================");
      console.log("➕ AGREGAR PRODUCTO:");
      console.log(producto);

      setCarrito((prev) => {

        const existe =
          prev.find(

            (p) =>
              p._id ===
              producto._id

          );

        // =====================================
        // YA EXISTE
        // =====================================

        if (existe) {

          console.log(
            "📌 PRODUCTO EXISTENTE"
          );

          return prev.map((p) =>

            p._id ===
            producto._id

              ? {

                  ...p,

                  cantidad:
                    Number(
                      p.cantidad
                    ) + 1

                }

              : p

          );

        }

        // =====================================
        // NUEVO
        // =====================================

        console.log(
          "🆕 NUEVO PRODUCTO"
        );

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
  // ACTUALIZAR
  // =========================================

  const actualizarCantidad =
    (_id, delta) => {

      console.log("=================================");
      console.log("🔄 ACTUALIZAR CANTIDAD");

      console.log("_id:", _id);
      console.log("delta:", delta);

      setCarrito((prev) =>

        prev.map((p) =>

          p._id === _id

            ? {

                ...p,

                cantidad:
                  Math.max(

                    Number(
                      p.cantidad
                    ) + delta,

                    1

                  )

              }

            : p

        )

      );

    };

  // =========================================
  // ELIMINAR
  // =========================================

  const eliminarProducto =
    (_id) => {

      console.log("=================================");
      console.log("🗑️ ELIMINAR PRODUCTO");
      console.log(_id);

      setCarrito((prev) =>

        prev.filter(

          (p) =>
            p._id !== _id

        )

      );

    };

  // =========================================
  // VACIAR
  // =========================================

  const vaciarCarrito =
    () => {

      console.log("=================================");
      console.log("🧹 VACIANDO CARRITO");

      setCarrito([]);

      setTotal(0);

      localStorage.removeItem(
        carritoKey
      );

    };

  // =========================================
  // PROVIDER
  // =========================================

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