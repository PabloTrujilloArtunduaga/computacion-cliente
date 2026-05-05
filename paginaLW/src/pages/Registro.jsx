import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Registro.css'; 

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 Validaciones
    if (!nombre.trim() || !correo.trim() || !password.trim() || !confirmPassword.trim()) {
      alert('Error: No puedes dejar campos vacíos.');
      return; 
    }

    if (!correo.includes("@")) {
      alert("Correo inválido");
      return;
    }

    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      alert('Error: Las contraseñas no coinciden.');
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          usuario: nombre,
          email: correo,
          password: password
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert('¡Usuario registrado con éxito!');
        
        // 🔥 Redirección correcta (sin recargar)
        navigate("/login");

      } else {
        alert(data.mensaje || "Error al registrar");
      }

    } catch (error) {
      console.error(error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="contenedor-formulario">
      <div className="card-panel tarjeta-blanca z-depth-3">
        <h4 className="center-align">Registrarse</h4>
        <p className="center-align texto-gris">Crea tu cuenta en Estanco MalaCopa</p>

        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <input 
              id="nombre" 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
            />
            <label htmlFor="nombre">Nombre de Usuario</label>
          </div>

          <div className="input-field">
            <input 
              id="correo" 
              type="email" 
              value={correo} 
              onChange={(e) => setCorreo(e.target.value)} 
            />
            <label htmlFor="correo">Correo Electrónico</label>
          </div>

          <div className="input-field">
            <input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <label htmlFor="password">Contraseña</label>
          </div>

          <div className="input-field">
            <input 
              id="confirmPassword" 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          </div>

          <div className="center-align" style={{ marginTop: '30px' }}>
            <button className="btn amber darken-3 black-text" type="submit" style={{ width: '100%', fontWeight: 'bold', borderRadius: '4px' }}>
              Crear cuenta
            </button>
          </div>
        </form>

        <div className="center-align" style={{ marginTop: '20px' }}>
          <p className="black-text">
            ¿Ya tienes una cuenta? <Link to="/login" className="amber-text text-darken-4">Inicia Sesión aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
}