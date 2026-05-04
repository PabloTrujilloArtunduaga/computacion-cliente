import React from 'react';

function StatCard({ color, icon, value, label }) {
  return (
    <div className="col s12 m6 l3">
      <div className={`card ${color} white-text`} style={{ borderRadius: 12 }}>
        <div className="card-content center">
          <i className="material-icons large">{icon}</i>
          <h4>{value}</h4>
          <p>{label}</p>
        </div>
      </div>
    </div>
  );
}

export default function StatsCards({ productos, categorias }) {
  const totalProductos  = productos.length;
  const disponibles     = productos.filter(p => p.estado === true).length;
  const noDisponibles   = productos.filter(p => p.estado === false).length;
  const totalCategorias = categorias.length;

  return (
    <div className="row">
      <StatCard color="green"  icon="inventory_2"  value={totalProductos}  label="Total Productos" />
      <StatCard color="blue"   icon="check_circle" value={disponibles}     label="Disponibles" />
      <StatCard color="orange" icon="category"     value={totalCategorias} label="Categorías" />
      <StatCard color="red"    icon="cancel"       value={noDisponibles}   label="No Disponibles" />
    </div>
  );
}