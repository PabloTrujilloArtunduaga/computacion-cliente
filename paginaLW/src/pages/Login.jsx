import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usuario.trim() || !password.trim()) {
      alert('⚠️ Usuario y contraseña obligatorios');
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          usuario,
          password
        })
      });

      const data = await res.json();

      if (res.ok) {
        // 🔐 guardar sesión
        localStorage.setItem("token", data.token);
        localStorage.setItem("rol", data.rol);

        // 🚀 redirección por rol
        if (data.rol === "admin") {
          navigate("/admin");
        } else if (data.rol === "empleado") {
          navigate("/empleado");
        } else {
          navigate("/cliente");
        }

      } else {
        alert("❌ " + data.mensaje);
      }

    } catch (error) {
      console.error(error);
      alert("❌ Error al conectar con el servidor");
    }
  };

  return (
    <div className="contenedor-formulario">
      <div className="card-panel tarjeta-blanca z-depth-3">
        <h4 className="center-align">Iniciar Sesión</h4>
        <p className="center-align texto-gris">
          Bienvenido a <strong>Estanco MalaCopa</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <input
              id="usuarioLogin"
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
            <label htmlFor="usuarioLogin">Usuario</label>
          </div>

          <div className="input-field">
            <input
              id="passwordLogin"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="passwordLogin">Contraseña</label>
          </div>

          <div className="center-align" style={{ marginTop: '30px' }}>
            <button
              className="btn amber darken-3 black-text"
              type="submit"
              style={{ width: '100%', fontWeight: 'bold', borderRadius: '6px' }}
            >
              Iniciar sesión
            </button>
          </div>
        </form>

        <div className="center-align" style={{ marginTop: '20px' }}>
          <p>
            <a href="#!" className="red-text text-lighten-1">
              ¿Olvidó su contraseña?
            </a>
          </p>
          <p className="black-text">
            Nuevo aquí,{" "}
            <Link to="/register" className="amber-text text-darken-4">
              crear cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}