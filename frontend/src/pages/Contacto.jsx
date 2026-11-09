import React, { useEffect } from 'react';
import M from 'materialize-css';
import "../styles/Contacto.css";

export default function Contacto() {

  useEffect(() => {
    M.AutoInit();
    M.updateTextFields();
  }, []);

  const enviarSimulado = (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    if (!nombre || !email || !mensaje) {
      M.toast({ html: 'Por favor completa todos los campos', classes: 'red darken-3 rounded' });
      return;
    }

    M.toast({
      html: `<strong>${nombre}</strong>, tu mensaje ha sido enviado correctamente.`,
      classes: 'green darken-2 rounded'
    });

    document.getElementById('nombre').value = '';
    document.getElementById('email').value = '';
    document.getElementById('mensaje').value = '';
    M.updateTextFields();
  };

  return (
    <section className="contacto-section">
      <div className="container fade-in">

        <h2 className="contacto-titulo center-align">Contáctanos</h2>
        <p className="contacto-sub center-align">
          Tu mensaje es importante para nosotros. Te responderemos lo antes posible.
        </p>

        <div className="card contacto-card z-depth-3">

          <form onSubmit={enviarSimulado}>

            {/* Nombre */}
            <div className="input-field">
              <input id="nombre" type="text" className="validate elegant-input" />
              <label htmlFor="nombre">Nombre completo</label>
            </div>

            {/* Email */}
            <div className="input-field">
              <input id="email" type="email" className="validate elegant-input" />
              <label htmlFor="email">Correo electrónico</label>
            </div>

            {/* Mensaje */}
            <div className="input-field">
              <textarea id="mensaje" className="materialize-textarea elegant-input"></textarea>
              <label htmlFor="mensaje">Tu mensaje</label>
            </div>

            <div className="center">
              <button
                className="btn btn-contacto waves-effect waves-light"
                type="submit"
              >
                Enviar Mensaje ✉️
              </button>
            </div>

          </form>

        </div>
      </div>
    </section>
  );
}
