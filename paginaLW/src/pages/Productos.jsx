import React, { useEffect } from "react";
import ProductoCard from "../components/ProductoCard";
import "../styles/Productos.css";


function Productos() {
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
  }, []);

  // Agregamos precio a cada producto
  const cervezas = [
    {
      titulo: "Águila Original",
      descripcion: "La clásica cerveza colombiana.",
      imagen:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0oix7BeqXhUh2td085-p5lYPKx8u0D4xOZw&s",
      precio: 5000,
    },
    {
      titulo: "Poker",
      descripcion: "Tradición entre amigos.",
      imagen:
        "https://distribuidoranikoll.com/wp-content/uploads/2023/04/Bebidas-Alcoholicas-Distribuidora-Nikoll-2-2.jpg",
      precio: 4500,
    },
    {
      titulo: "Corona",
      descripcion: "Suave y refrescante.",
      imagen:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC4-_iiFgBY2uarVnuVamsLTbgW6Ix6kv-Ig&s",
      precio: 6000,
    },
  ];

  const licores = [
    {
      titulo: "Jack Daniel's",
      descripcion: "Whisky premium americano.",
      imagen:
        "https://img.lalr.co/cms/2022/10/06193559/Jack_Daniels_Rye_Cask_Finish-1.jpg?size=xl",
      precio: 95000,
    },
    {
      titulo: "Buchanan's",
      descripcion: "Perfecto para compartir.",
      imagen:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBC1RrT6joqntEZ8bPKxzRpI3yGIzuErpQcw&s",
      precio: 87000,
    },
    {
      titulo: "Aguardiente Antioqueño",
      descripcion: "El licor de la casa.",
      imagen:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX2pHGLTZU9vhN0XKJVzQu9UNFKaZaSv-L3Q&s",
      precio: 30000,
    },
  ];

  return (
    <div className="productos-section container">
      <h4 className="section-title">Cervezas</h4>
      <div className="productos-grid">
        {cervezas.map((prod, idx) => (
          <ProductoCard key={idx} producto={prod} />
        ))}
      </div>

      <h4 className="section-title">Licores</h4>
      <div className="productos-grid">
        {licores.map((prod, idx) => (
          <ProductoCard key={idx} producto={prod} />
        ))}
      </div>
    </div>
  );
}

export default Productos;
