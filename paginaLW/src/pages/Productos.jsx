import React, { useEffect, useState } from "react";
import ProductoCard from "../components/ProductoCard";
import "../styles/Productos.css";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 TRAER PRODUCTOS DEL BACKEND
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/admin/products");
        const data = await res.json();

        console.log("🔥 PRODUCTOS BACKEND:", data);

        setProductos(data);
      } catch (error) {
        console.error("❌ Error cargando productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 🔹 OBSERVER
  useEffect(() => {
    const items = document.querySelectorAll(".producto-card, .section-title");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    items.forEach((item) => observer.observe(item));
  }, [productos]);

  // 🔹 FILTROS
  const cervezas = productos.filter(
    (p) => p.categoria_id?.nombre?.toLowerCase() === "cerveza"
  );

  const licores = productos.filter(
    (p) => p.categoria_id?.nombre?.toLowerCase() === "licores"
  );

  return (
    <div className="productos-section container">

      {/* 🔄 LOADING */}
      {loading && <p className="center">Cargando productos...</p>}

      {/* ❌ SIN PRODUCTOS */}
      {!loading && productos.length === 0 && (
        <div className="center">
          <h5>⚠️ No hay productos disponibles</h5>
          <p>Intenta más tarde o revisa el backend</p>
        </div>
      )}

      {/* 🍺 CERVEZAS */}
      {!loading && productos.length > 0 && (
        <>
          <h4 className="section-title">Cervezas</h4>
          <div className="productos-grid">

            {cervezas.length === 0 ? (
              <p className="center">No hay cervezas disponibles</p>
            ) : (
              cervezas.map((prod) => (
                <ProductoCard
                  key={prod._id}
                  producto={{
                    nombre: prod.nombre,
                    descripcion: prod.descripcion || "Sin descripción",
                    precio: prod.precio,
                    imagen: prod.imagen || "https://via.placeholder.com/300",
                    estado: prod.estado,
                    stock: prod.stock
                  }}
                />
              ))
            )}

          </div>

          {/* 🥃 LICORES */}
          <h4 className="section-title">Licores</h4>
          <div className="productos-grid">

            {licores.length === 0 ? (
              <p className="center">No hay licores disponibles</p>
            ) : (
              licores.map((prod) => (
                <ProductoCard
                  key={prod._id}
                  producto={{
                    nombre: prod.nombre,
                    descripcion: prod.descripcion || "Sin descripción",
                    precio: prod.precio,
                    imagen: prod.imagen || "https://static.vecteezy.com/system/resources/previews/023/103/916/non_2x/not-available-rubber-stamp-seal-vector.jpg",
                    estado: prod.estado,
                    stock: prod.stock
                  }}
                />
              ))
            )}

          </div>
        </>
      )}
    </div>
  );
}

export default Productos;