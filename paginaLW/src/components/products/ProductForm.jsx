import React, { useState } from 'react';
import Field from '../common/Field';
import CategoryMenuBar from '../products/CategoryMenuBar';
import { inputStyle } from '../../constants/styles';

const INITIAL_STATE = {
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
  categoria_nombre: '',
  codigo_barras: '',
  imagen: '',
  estado: true,
};

function validate(form) {
  const e = {};
  if (!form.nombre.trim())
    e.nombre = 'El nombre es requerido';
  if (!form.precio || isNaN(form.precio) || Number(form.precio) <= 0)
    e.precio = 'Precio válido requerido';
  if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0)
    e.stock = 'Stock válido requerido';
  if (!form.categoria_nombre)
    e.categoria_nombre = 'Selecciona una categoría';
  if (form.imagen && !/^https?:\/\/.+/.test(form.imagen))
    e.imagen = 'Debe ser una URL válida (http/https)';
  return e;
}

export default function ProductForm({ initial, categorias, onSave, onClose }) {
  const [form, setForm] = useState({
    ...INITIAL_STATE,
    ...initial,
  });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  const setVal = (field) => (val) => setForm(f => ({ ...f, [field]: val }));

  const handleSubmit = async () => {
  const e = validate(form);
  if (Object.keys(e).length) { setErrors(e); return; }

  console.log("FORM:", form);

  setLoading(true);

  const cat = categorias.find(c => c.nombre === form.categoria_nombre);

  if (!cat) {
    console.log("CATEGORIAS:", categorias);
    console.log("BUSCANDO:", form.categoria_nombre);

    setErrors({ categoria_nombre: 'Categoría no encontrada' });
    setLoading(false);
    return;
  }

  const body = {
    nombre: form.nombre.trim(),
    descripcion: form.descripcion.trim(),
    precio: Number(form.precio),
    stock: Number(form.stock),
    categoria_id: cat._id,
    codigo_barras: form.codigo_barras.trim(),
    imagen: form.imagen.trim(),
    estado: form.estado,
  };

  console.log("BODY QUE SE ENVÍA:", body); // ✅ aquí sí

  const ok = await onSave(body);
  if (ok !== false) onClose();
  setLoading(false);
};

  const isValidImageUrl = form.imagen && /^https?:\/\/.+/.test(form.imagen);

  return (
    <>
      <Field label="Nombre *" error={errors.nombre}>
        <input style={inputStyle} value={form.nombre} onChange={set('nombre')} placeholder="Nombre del producto" />
      </Field>

      <Field label="Descripción">
        <input style={inputStyle} value={form.descripcion} onChange={set('descripcion')} placeholder="Descripción" />
      </Field>

      <Field label="Precio *" error={errors.precio}>
        <input style={inputStyle} type="number" value={form.precio} onChange={set('precio')} placeholder="Ej: 85000" />
      </Field>

      <Field label="Stock *" error={errors.stock}>
        <input style={inputStyle} type="number" value={form.stock} onChange={set('stock')} placeholder="Ej: 30" />
      </Field>

      <Field label="URL de imagen" error={errors.imagen}>
        <input style={inputStyle} value={form.imagen} onChange={set('imagen')} placeholder="https://..." />
        {isValidImageUrl && (
          <img
            src={form.imagen} alt="preview"
            style={{ marginTop: 8, maxHeight: 80, borderRadius: 6, border: '1px solid #ddd' }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        )}
      </Field>

      <Field label="Código de barras">
        <input style={inputStyle} value={form.codigo_barras} onChange={set('codigo_barras')} placeholder="Opcional" />
      </Field>

      <Field label="Categoría *" error={errors.categoria_nombre}>
        <CategoryMenuBar
          categorias={categorias}
          value={form.categoria_nombre}
          onChange={setVal('categoria_nombre')}
        />
      </Field>

      <Field label="Estado">
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={form.estado}
            onChange={e => setForm(f => ({ ...f, estado: e.target.checked }))}
          />
          <span>{form.estado ? 'Disponible' : 'No disponible'}</span>
        </label>
      </Field>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
        <button onClick={onClose} style={{ padding: '9px 22px', borderRadius: 7, border: '1.5px solid #ccc', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>
          Cancelar
        </button>
        <button onClick={handleSubmit} disabled={loading} style={{ padding: '9px 22px', borderRadius: 7, border: 'none', background: '#1565C0', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </>
  );
}