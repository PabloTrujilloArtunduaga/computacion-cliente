import React, { useState } from 'react';
import Field from '../common/Field';
import { inputStyle } from '../../constants/styles';

const INITIAL_STATE = { nombre: '', descripcion: '', estado: true };

function validate(form) {
  const e = {};
  if (!form.nombre.trim()) e.nombre = 'El nombre es requerido';
  return e;
}

export default function CategoryForm({ initial, onSave, onClose }) {
  const [form, setForm]       = useState({ ...INITIAL_STATE, ...initial });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async () => {
    const e = validate(form);
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);

    const ok = await onSave({
      nombre:      form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      estado:      form.estado,
    });

    if (ok !== false) onClose();
    setLoading(false);
  };

  return (
    <>
      <Field label="Nombre *" error={errors.nombre}>
        <input style={inputStyle} value={form.nombre} onChange={set('nombre')} placeholder="Nombre de la categoría" />
      </Field>

      <Field label="Descripción">
        <input style={inputStyle} value={form.descripcion} onChange={set('descripcion')} placeholder="Descripción" />
      </Field>

      <Field label="Estado">
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={form.estado}
            onChange={e => setForm(f => ({ ...f, estado: e.target.checked }))}
          />
          <span>{form.estado ? 'Activa' : 'Inactiva'}</span>
        </label>
      </Field>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
        <button onClick={onClose} style={{ padding: '9px 22px', borderRadius: 7, border: '1.5px solid #ccc', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>
          Cancelar
        </button>
        <button onClick={handleSubmit} disabled={loading} style={{ padding: '9px 22px', borderRadius: 7, border: 'none', background: '#E65100', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </>
  );
}