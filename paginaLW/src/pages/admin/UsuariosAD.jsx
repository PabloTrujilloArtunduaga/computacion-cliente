import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── 1. CONSTANTES ────────────────────────────────────────────────────────────

const API = 'http://localhost:3000/admin';

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: 7,
  border: '1.5px solid #ccc',
  fontSize: 14,
  boxSizing: 'border-box',
  outline: 'none',
};

// ─── 2. COMPONENTES AUXILIARES ────────────────────────────────────────────────

function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.55)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 12,
    }}>
      <div style={{
        background: '#fff', borderRadius: 14, width: '100%',
        maxWidth: 480, maxHeight: '90vh', display: 'flex',
        flexDirection: 'column', boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
        overflow: 'hidden',
      }}>
        <div style={{
          background: '#1565C0', color: '#fff',
          padding: '16px 22px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontWeight: 700, fontSize: 16 }}>{title}</span>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#fff',
            fontSize: 22, cursor: 'pointer', lineHeight: 1,
          }}>×</button>
        </div>
        <div style={{ padding: '22px 24px', overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block', fontWeight: 600,
        marginBottom: 6, fontSize: 13, color: '#444',
      }}>
        {label}
      </label>
      {children}
      {error && (
        <span style={{ color: '#e53935', fontSize: 12, marginTop: 4, display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, zIndex: 2000,
      background: toast.color, color: '#fff', padding: '12px 24px',
      borderRadius: 8, fontWeight: 600, boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      animation: 'fadeIn 0.3s',
    }}>
      {toast.msg}
    </div>
  );
}

// ─── 3. FORMULARIOS ───────────────────────────────────────────────────────────

function UsuarioForm({ initial, onSave, onClose }) {
  const isEdit = Boolean(initial);

  const [form, setForm] = useState({
    nombre:             initial?.nombre   || '',
    email:              initial?.email    || '',
    password:           '',
    rol:                initial?.rol      || 'cliente',
    estado:             initial?.estado !== undefined ? initial.estado : true,
    // Campos extra para cuando rol === 'empleado'
    cargo:              '',
    salario:            '',
    fecha_contratacion: '',
  });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};

    const nombre = form.nombre.trim();
    if (!nombre) {
      e.nombre = 'El nombre es obligatorio';
    } else if (nombre.length < 2) {
      e.nombre = 'El nombre debe tener al menos 2 caracteres';
    } else if (nombre.length > 50) {
      e.nombre = 'El nombre no puede tener más de 50 caracteres';
    }

    const email = form.email.trim();
    if (!email) {
      e.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = 'El email no es válido';
    }

    const password = form.password.trim();
    if (!isEdit) {
      if (!password) {
        e.password = 'La contraseña es obligatoria';
      } else if (password.length < 6) {
        e.password = 'La contraseña debe tener al menos 6 caracteres';
      } else if (!/[A-Z]/.test(password)) {
        e.password = 'Debe contener al menos una letra mayúscula';
      } else if (!/[a-z]/.test(password)) {
        e.password = 'Debe contener al menos una letra minúscula';
      } else if (!/[0-9]/.test(password)) {
        e.password = 'Debe contener al menos un número';
      } else if (!/[^A-Za-z0-9]/.test(password)) {
        e.password = 'Debe contener al menos un carácter especial';
      }
    } else if (password) {
      if (password.length < 6) {
        e.password = 'La contraseña debe tener al menos 6 caracteres';
      } else if (!/[A-Z]/.test(password)) {
        e.password = 'Debe contener al menos una letra mayúscula';
      } else if (!/[a-z]/.test(password)) {
        e.password = 'Debe contener al menos una letra minúscula';
      } else if (!/[0-9]/.test(password)) {
        e.password = 'Debe contener al menos un número';
      } else if (!/[^A-Za-z0-9]/.test(password)) {
        e.password = 'Debe contener al menos un carácter especial';
      }
    }

    if (!['admin', 'empleado', 'cliente'].includes(form.rol)) {
      e.rol = 'Rol inválido';
    }

    // Validaciones adicionales si el rol es empleado
    if (form.rol === 'empleado') {
      if (!form.cargo.trim()) {
        e.cargo = 'El cargo es requerido';
      }
      if (!form.salario || isNaN(form.salario) || Number(form.salario) <= 0) {
        e.salario = 'Salario válido requerido';
      }
    }

    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);

    const body = {
      nombre:  form.nombre.trim(),
      email:   form.email.trim(),
      rol:     form.rol,
      estado:  form.estado,
    };
    if (form.password.trim()) body.password = form.password.trim();

    // Incluir datos de empleado si aplica
    if (form.rol === 'empleado') {
      body.cargo              = form.cargo.trim();
      body.salario            = form.salario;
      body.fecha_contratacion = form.fecha_contratacion || null;
    }

    await onSave(body);
    setLoading(false);
  };

  return (
    <>
      <Field label="Nombre completo *" error={errors.nombre}>
        <input
          style={inputStyle}
          value={form.nombre}
          onChange={e => setForm({ ...form, nombre: e.target.value })}
          placeholder="Ej: Juan Pérez"
        />
      </Field>

      <Field label="Email *" error={errors.email}>
        <input
          style={inputStyle}
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          placeholder="usuario@malacopa.com"
        />
      </Field>

      <Field label={isEdit ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña *'} error={errors.password}>
        <input
          style={inputStyle}
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          placeholder={isEdit ? 'Dejar vacío para conservar' : 'Mínimo 6 caracteres'}
        />
      </Field>

      <Field label="Rol *" error={errors.rol}>
        <select
          style={{
            ...inputStyle,
            display: 'block',
            backgroundColor: '#fff',
            color: '#333',
            cursor: 'pointer',
            appearance: 'auto',
            WebkitAppearance: 'menulist',
            MozAppearance: 'menulist',
          }}
          value={form.rol}
          onChange={e => setForm({ ...form, rol: e.target.value })}
        >
          <option value="" disabled>Seleccione un rol</option>
          <option value="admin">Administrador</option>
          <option value="empleado">Empleado</option>
          <option value="cliente">Cliente</option>
        </select>
      </Field>

      <Field label="Estado">
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={form.estado}
            onChange={e => setForm({ ...form, estado: e.target.checked })}
          />
          <span>{form.estado ? 'Activo' : 'Inactivo'}</span>
        </label>
      </Field>

      {/* ── CAMPOS ADICIONALES: SOLO SI EL ROL ES EMPLEADO ── */}
      {form.rol === 'empleado' && (
        <div style={{
          marginTop: 20,
          marginBottom: 20,
          padding: 18,
          borderRadius: 10,
          background: '#f1f8e9',
          border: '1px solid #c5e1a5',
        }}>
          <h6 style={{ margin: '0 0 18px 0', color: '#2e7d32', fontWeight: 700 }}>
            Información del Empleado
          </h6>

          <Field label="Cargo *" error={errors.cargo}>
            <input
              style={inputStyle}
              value={form.cargo}
              onChange={e => setForm({ ...form, cargo: e.target.value })}
              placeholder="Ej: Vendedor"
            />
          </Field>

          <Field label="Salario (COP) *" error={errors.salario}>
            <input
              style={inputStyle}
              type="number"
              min="0"
              value={form.salario}
              onChange={e => setForm({ ...form, salario: e.target.value })}
              placeholder="Ej: 1800000"
            />
          </Field>

          <Field label="Fecha de contratación">
            <input
              style={inputStyle}
              type="date"
              value={form.fecha_contratacion}
              onChange={e => setForm({ ...form, fecha_contratacion: e.target.value })}
            />
          </Field>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
        <button onClick={onClose} style={{
          padding: '9px 22px', borderRadius: 7, border: '1.5px solid #ccc',
          background: '#fff', cursor: 'pointer', fontWeight: 600,
        }}>
          Cancelar
        </button>
        <button onClick={handleSubmit} disabled={loading} style={{
          padding: '9px 22px', borderRadius: 7, border: 'none',
          background: '#1565C0', color: '#fff', cursor: 'pointer', fontWeight: 700,
        }}>
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </>
  );
}

function EmpleadoForm({ initial, usuariosLibres, onSave, onClose }) {
  const isEdit = Boolean(initial);

  const [form, setForm] = useState({
    usuario_id:         isEdit ? (initial.usuario_id?._id || initial.usuario_id) : '',
    cargo:              initial?.cargo              || '',
    salario:            initial?.salario            || '',
    fecha_contratacion: initial?.fecha_contratacion
      ? initial.fecha_contratacion.substring(0, 10)
      : '',
  });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!isEdit && !form.usuario_id) e.usuario_id = 'Selecciona un usuario';
    if (!form.cargo.trim())          e.cargo      = 'El cargo es requerido';
    if (!form.salario || isNaN(form.salario) || Number(form.salario) <= 0)
      e.salario = 'Salario válido requerido';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);

    const body = {
      cargo:   form.cargo.trim(),
      salario: Number(form.salario),
    };
    if (!isEdit) body.usuario_id = form.usuario_id;
    if (form.fecha_contratacion) body.fecha_contratacion = form.fecha_contratacion;

    await onSave(body);
    setLoading(false);
  };

  return (
    <>
      {!isEdit ? (
        <Field label="Usuario *" error={errors.usuario_id}>
          <select
            style={{
              ...inputStyle,
              backgroundColor: '#fff',
              color: '#333',
              cursor: 'pointer',
              appearance: 'menulist',
              WebkitAppearance: 'menulist',
              MozAppearance: 'menulist',
            }}
            value={form.usuario_id}
            onChange={e => setForm({ ...form, usuario_id: e.target.value })}
          >
            <option value="">Seleccione un usuario</option>
            {usuariosLibres.map(u => (
              <option key={u._id} value={u._id}>
                {u.nombre} — {u.email} ({u.rol})
              </option>
            ))}
          </select>
          {usuariosLibres.filter(u => u.rol === 'empleado').length === 0 && (
            <span style={{ color: '#888', fontSize: 12, marginTop: 6, display: 'block' }}>
              No hay usuarios con rol "empleado" disponibles.
            </span>
          )}
        </Field>
      ) : (
        <Field label="Usuario (no editable)">
          <input
            style={{ ...inputStyle, background: '#f5f5f5', color: '#888' }}
            value={initial.usuario_id?.nombre || 'Usuario desconocido'}
            disabled
          />
        </Field>
      )}

      <Field label="Cargo *" error={errors.cargo}>
        <input
          style={inputStyle}
          value={form.cargo}
          onChange={e => setForm({ ...form, cargo: e.target.value })}
          placeholder="Ej: Vendedor, Bodeguero, Administrador"
        />
      </Field>

      <Field label="Salario (COP) *" error={errors.salario}>
        <input
          style={inputStyle}
          type="number"
          value={form.salario}
          onChange={e => setForm({ ...form, salario: e.target.value })}
          placeholder="Ej: 1800000"
          min="0"
        />
      </Field>

      <Field label="Fecha de contratación">
        <input
          style={inputStyle}
          type="date"
          value={form.fecha_contratacion}
          onChange={e => setForm({ ...form, fecha_contratacion: e.target.value })}
        />
      </Field>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
        <button onClick={onClose} style={{
          padding: '9px 22px', borderRadius: 7, border: '1.5px solid #ccc',
          background: '#fff', cursor: 'pointer', fontWeight: 600,
        }}>
          Cancelar
        </button>
        <button onClick={handleSubmit} disabled={loading} style={{
          padding: '9px 22px', borderRadius: 7, border: 'none',
          background: '#2e7d32', color: '#fff', cursor: 'pointer', fontWeight: 700,
        }}>
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </>
  );
}

// ─── 4. PÁGINA PRINCIPAL ──────────────────────────────────────────────────────

export default function UsuariosEmpleadosPage() {
  const navigate = useNavigate();

  const [usuarios,  setUsuarios]  = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [modal,     setModal]     = useState(null);
  const [toast,     setToast]     = useState(null);

  const showToast = (msg, color = '#388e3c') => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsuarios = async () => {
    try {
      const res  = await fetch(`${API}/users`);
      const data = await res.json();
      setUsuarios(data);
    } catch {
      showToast('Error al cargar usuarios', '#c62828');
    }
  };

  const fetchEmpleados = async () => {
    try {
      const res  = await fetch(`${API}/empleados`);
      const data = await res.json();
      setEmpleados(data);
    } catch {
      showToast('Error al cargar empleados', '#c62828');
    }
  };

  useEffect(() => {
    fetchUsuarios();
    fetchEmpleados();
  }, []);

  const empleadoUserIds = new Set(
    empleados.map(e => e.usuario_id?._id || e.usuario_id)
  );
  const usuariosLibres = usuarios.filter(u => !empleadoUserIds.has(u._id));

  const totalUsuarios   = usuarios.length;
  const usuariosActivos = usuarios.filter(u => u.estado === true).length;
  const usuariosInact   = usuarios.filter(u => u.estado === false).length;
  const totalEmpleados  = empleados.length;

  // ── CRUD USUARIOS ─────────────────────────────────────────────────────────────

  const handleCreateUser = async (body) => {
    try {
      const userRes = await fetch(`${API}/user`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          nombre:  body.nombre,
          email:   body.email,
          password: body.password,
          rol:     body.rol,
          estado:  body.estado,
        }),
      });

      const userData = await userRes.json();

      if (!userRes.ok) {
        showToast(userData.message || 'Error al crear usuario', '#c62828');
        return;
      }

      // Si es empleado, crear automáticamente su registro en empleados
      if (body.rol === 'empleado') {
        const empleadoRes = await fetch(`${API}/empleados`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({
            usuario_id:         userData._id,
            cargo:              body.cargo,
            salario:            Number(body.salario),
            fecha_contratacion: body.fecha_contratacion || null,
          }),
        });

        const empleadoData = await empleadoRes.json();

        if (!empleadoRes.ok) {
          showToast(
            empleadoData.message || 'Usuario creado, pero falló la creación del empleado',
            '#ef6c00'
          );
          await fetchUsuarios();
          return;
        }

        await fetchEmpleados();
      }

      await fetchUsuarios();
      setModal(null);
      showToast(
        body.rol === 'empleado'
          ? 'Usuario y empleado creados exitosamente'
          : 'Usuario creado exitosamente'
      );
    } catch (error) {
      console.error(error);
      showToast('Error de conexión', '#c62828');
    }
  };

  const handleUpdateUser = async (id, body) => {
    try {
      const res = await fetch(`${API}/user/${id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json();
        showToast(d.message || 'Error al actualizar', '#c62828');
        return;
      }
      await fetchUsuarios();
      setModal(null);
      showToast('Usuario actualizado');
    } catch {
      showToast('Error de conexión', '#c62828');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('¿Desactivar este usuario? (soft delete)')) return;
    try {
      const res = await fetch(`${API}/user/${id}`, { method: 'DELETE' });
      if (!res.ok) { showToast('Error al eliminar', '#c62828'); return; }
      await fetchUsuarios();
      showToast('Usuario desactivado');
    } catch {
      showToast('Error de conexión', '#c62828');
    }
  };

  const handleToggleUser = async (usuario) => {
    try {
      const res = await fetch(`${API}/user/${usuario._id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ estado: !usuario.estado }),
      });
      if (!res.ok) { showToast('Error al cambiar estado', '#c62828'); return; }
      await fetchUsuarios();
      showToast(`Usuario ${!usuario.estado ? 'activado' : 'desactivado'}`);
    } catch {
      showToast('Error de conexión', '#c62828');
    }
  };

  // ── CRUD EMPLEADOS ────────────────────────────────────────────────────────────

  const handleCreateEmpleado = async (body) => {
    try {
      const res = await fetch(`${API}/empleados`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          usuario_id:         body.usuario_id,
          cargo:              body.cargo,
          salario:            Number(body.salario),
          fecha_contratacion: body.fecha_contratacion || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || 'Error al crear empleado', '#c62828');
        return;
      }

      await fetchEmpleados();
      setModal(null);
      showToast('Empleado creado exitosamente');
    } catch (error) {
      console.error(error);
      showToast('Error de conexión', '#c62828');
    }
  };

  const handleUpdateEmpleado = async (id, body) => {
    try {
      const res = await fetch(`${API}/empleados/${id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json();
        showToast(d.message || 'Error al actualizar empleado', '#c62828');
        return;
      }
      await fetchEmpleados();
      setModal(null);
      showToast('Empleado actualizado');
    } catch {
      showToast('Error de conexión', '#c62828');
    }
  };

  const handleDeleteEmpleado = async (id) => {
    if (!window.confirm('¿Desactivar este empleado? (soft delete)')) return;
    try {
      const res = await fetch(`${API}/empleados/${id}`, { method: 'DELETE' });
      if (!res.ok) { showToast('Error al eliminar empleado', '#c62828'); return; }
      await fetchEmpleados();
      showToast('Empleado desactivado');
    } catch {
      showToast('Error de conexión', '#c62828');
    }
  };

  // ── HELPERS ───────────────────────────────────────────────────────────────────

  const formatSalario = (n) =>
    n ? `$${Number(n).toLocaleString('es-CO')}` : '—';

  const getNombreUsuario = (emp) =>
    emp.usuario_id?.nombre || '—';

  const getEmailUsuario = (emp) =>
    emp.usuario_id?.email || '—';

  const formatFecha = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('es-CO');
  };

  // ── RENDER ────────────────────────────────────────────────────────────────────

  return (
    <div className="grey lighten-4" style={{ minHeight: '100vh' }}>

      <Toast toast={toast} />

      <nav className="blue darken-3">
        <div className="nav-wrapper" style={{ padding: '0 20px' }}>
          <a href="#" className="brand-logo">MalaCopa Admin</a>
          <ul className="right hide-on-med-and-down">
            <li>
              <a onClick={() => navigate('/admin')} style={{ cursor: 'pointer' }}>
                Inicio
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="container" style={{ width: '95%', marginTop: 30 }}>

        {/* ── ESTADÍSTICAS ── */}
        <div className="row">
          <div className="col s12 m6 l3">
            <div className="card blue white-text" style={{ borderRadius: 12 }}>
              <div className="card-content center">
                <i className="material-icons large">people</i>
                <h4>{totalUsuarios}</h4>
                <p>Total Usuarios</p>
              </div>
            </div>
          </div>
          <div className="col s12 m6 l3">
            <div className="card green white-text" style={{ borderRadius: 12 }}>
              <div className="card-content center">
                <i className="material-icons large">badge</i>
                <h4>{totalEmpleados}</h4>
                <p>Empleados</p>
              </div>
            </div>
          </div>
          <div className="col s12 m6 l3">
            <div className="card orange white-text" style={{ borderRadius: 12 }}>
              <div className="card-content center">
                <i className="material-icons large">check_circle</i>
                <h4>{usuariosActivos}</h4>
                <p>Usuarios Activos</p>
              </div>
            </div>
          </div>
          <div className="col s12 m6 l3">
            <div className="card red white-text" style={{ borderRadius: 12 }}>
              <div className="card-content center">
                <i className="material-icons large">person_off</i>
                <h4>{usuariosInact}</h4>
                <p>Usuarios Inactivos</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── TABLA USUARIOS ── */}
        <div className="row">
          <div className="col s12">
            <div className="card" style={{ borderRadius: 12 }}>
              <div className="card-content">
                <div className="row valign-wrapper" style={{ marginBottom: 0 }}>
                  <div className="col s12 m6">
                    <span className="card-title">Gestión de Usuarios</span>
                  </div>
                  <div className="col s12 m6 right-align">
                    <a
                      className="btn blue waves-effect waves-light"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setModal({ type: 'createUser' })}
                    >
                      <i className="material-icons left">person_add</i>
                      Crear Usuario
                    </a>
                  </div>
                </div>

                <table className="highlight responsive-table centered">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ color: '#aaa', padding: 30 }}>
                          Sin usuarios
                        </td>
                      </tr>
                    ) : usuarios.map(u => (
                      <tr key={u._id}>
                        <td><b>{u.nombre}</b></td>
                        <td>{u.email}</td>
                        <td style={{ textTransform: 'capitalize' }}>{u.rol}</td>
                        <td>
                          <span
                            className={`new badge ${u.estado ? 'green' : 'red'}`}
                            data-badge-caption=""
                          >
                            {u.estado ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td>
                          <a
                            className="btn-small blue"
                            title="Editar usuario"
                            style={{ cursor: 'pointer', marginRight: 4 }}
                            onClick={() => setModal({ type: 'editUser', data: u })}
                          >
                            <i className="material-icons">edit</i>
                          </a>
                          <a
                            className={`btn-small ${u.estado ? 'orange' : 'green'}`}
                            title={u.estado ? 'Desactivar' : 'Activar'}
                            style={{ cursor: 'pointer', marginRight: 4 }}
                            onClick={() => handleToggleUser(u)}
                          >
                            <i className="material-icons">
                              {u.estado ? 'toggle_off' : 'toggle_on'}
                            </i>
                          </a>
                          <a
                            className="btn-small red"
                            title="Eliminar (soft delete)"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleDeleteUser(u._id)}
                          >
                            <i className="material-icons">delete</i>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* ── TABLA EMPLEADOS ── */}
        <div className="row">
          <div className="col s12">
            <div className="card" style={{ borderRadius: 12 }}>
              <div className="card-content">
                <div className="row valign-wrapper" style={{ marginBottom: 0 }}>
                  <div className="col s12 m6">
                    <span className="card-title">Gestión de Empleados</span>
                  </div>
                  <div className="col s12 m6 right-align">
                    <a
                      className="btn green waves-effect waves-light"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setModal({ type: 'createEmpleado' })}
                    >
                      <i className="material-icons left">badge</i>
                      Crear Empleado
                    </a>
                  </div>
                </div>

                <table className="highlight responsive-table centered">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Cargo</th>
                      <th>Salario</th>
                      <th>Contratación</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {empleados.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ color: '#aaa', padding: 30 }}>
                          Sin empleados
                        </td>
                      </tr>
                    ) : empleados.map(emp => (
                      <tr key={emp._id}>
                        <td><b>{getNombreUsuario(emp)}</b></td>
                        <td>{getEmailUsuario(emp)}</td>
                        <td>{emp.cargo || '—'}</td>
                        <td>{formatSalario(emp.salario)}</td>
                        <td>{formatFecha(emp.fecha_contratacion)}</td>
                        <td>
                          <span className="new badge green" data-badge-caption="">
                            Activo
                          </span>
                        </td>
                        <td>
                          <a
                            className="btn-small blue"
                            title="Editar empleado"
                            style={{ cursor: 'pointer', marginRight: 4 }}
                            onClick={() => setModal({ type: 'editEmpleado', data: emp })}
                          >
                            <i className="material-icons">edit</i>
                          </a>
                          <a
                            className="btn-small red"
                            title="Desactivar empleado (soft delete)"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleDeleteEmpleado(emp._id)}
                          >
                            <i className="material-icons">delete</i>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>{/* /container */}

      {/* ── MODALES ── */}

      {modal?.type === 'createUser' && (
        <Modal title="Crear Usuario" onClose={() => setModal(null)}>
          <UsuarioForm
            onSave={handleCreateUser}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}

      {modal?.type === 'editUser' && (
        <Modal title="Editar Usuario" onClose={() => setModal(null)}>
          <UsuarioForm
            initial={modal.data}
            onSave={(body) => handleUpdateUser(modal.data._id, body)}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}

      {modal?.type === 'createEmpleado' && (
        <Modal title="Crear Empleado" onClose={() => setModal(null)}>
          <EmpleadoForm
            usuariosLibres={usuariosLibres}
            onSave={handleCreateEmpleado}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}

      {modal?.type === 'editEmpleado' && (
        <Modal title="Editar Empleado" onClose={() => setModal(null)}>
          <EmpleadoForm
            initial={modal.data}
            usuariosLibres={usuariosLibres}
            onSave={(body) => handleUpdateEmpleado(modal.data._id, body)}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>

    </div>
  );
}