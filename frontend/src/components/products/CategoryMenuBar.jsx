import React from 'react';

export default function CategoryMenuBar({ categorias, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
      {categorias.map(c => (
        <button
          key={c._id}
          type="button"
          onClick={() => onChange(c.nombre)}
          style={{
            padding: '7px 18px', borderRadius: 20, border: 'none',
            cursor: 'pointer', fontWeight: 600, fontSize: 13,
            background: value === c.nombre ? '#1565C0' : '#e3eaf5',
            color:      value === c.nombre ? '#fff'    : '#1565C0',
            transition: 'all 0.18s',
          }}
        >
          {c.nombre}
        </button>
      ))}
    </div>
  );
}