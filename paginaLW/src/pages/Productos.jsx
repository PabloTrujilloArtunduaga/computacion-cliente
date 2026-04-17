import React, { useEffect, useState } from "react";
import ProductoCard from "../components/ProductoCard";
import "../styles/Productos.css";

function Productos() {
  const [productos, setProductos] = useState([]);

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

    // CONEXIÓN CON BACKEND
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/admin/products");
        const data = await res.json();

        console.log("PRODUCTOS BACKEND ", data);

        setProductos(data);
      } catch (error) {
        console.error("Error cargando productos:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="productos-section container">

      {/* CERVEZAS */}
      <h4 className="section-title">Cervezas</h4>
      <div className="productos-grid">
        {productos
          .filter((p) => p.categoria_id?.nombre === "cerveza")
          .map((prod) => (
            <ProductoCard
              key={prod._id}
              producto={{
                nombre: prod.nombre,
                descripcion: prod.descripcion,
                precio: prod.precio,
                imagen: prod.imagen,
                estado: prod.estado,
              }}
            />
          ))}
      </div>

      {/* LICORES */}
      <h4 className="section-title">Licores</h4>
      <div className="productos-grid">
        {productos
          .filter((p) => p.categoria_id?.nombre === "licores")
          .map((prod) => (
            <ProductoCard
              key={prod._id}
              producto={{
                nombre: prod.nombre,
                descripcion: prod.descripcion,
                precio: prod.precio,
                imagen: prod.imagen,
                estado: prod.estado,
              }}
            />
          ))}
      </div>

    </div>
  );
}

export default Productos;