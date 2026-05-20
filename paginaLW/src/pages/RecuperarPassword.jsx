import React, {
  useRef,
  useEffect,
  useState,
} from "react";

import gsap from "gsap";

import M from "materialize-css";
import { API } from "../constants/api";

import "../styles/RecuperarPassword.css";

export default function RecuperarPassword() {

  const [email, setEmail] =
    useState("");

  const cardRef =
    useRef(null);

  useEffect(() => {

    gsap.fromTo(
      cardRef.current,
      {
        opacity: 0,
        y: 60,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power4.out"
      }
    );

  }, []);

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (!email.trim()) {

        M.toast({
          html:
            "Ingrese un correo",
          classes:
            "red"
        });

        return;
      }

      try {

        const res =
          await fetch(
            `${API}/users/forgot-password`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json"
              },
              body:
                JSON.stringify({
                  email
                })
            }
          );

        const data =
          await res.json();

        if (!res.ok) {

          M.toast({
            html:
              data.message ||
              "Error",
            classes:
              "red"
          });

          return;
        }

        M.toast({
          html:
            "📩 Revisa tu correo",
          classes:
            "green"
        });

      } catch (error) {

        console.error(error);

        M.toast({
          html:
            "Error servidor",
          classes:
            "red"
        });
      }
    };

  return (

    <div className="recover-container">

      <div
        ref={cardRef}
        className="
          card-panel
          recover-card
          z-depth-5
        "
      >

        <h4 className="center-align">
          Recuperar Contraseña
        </h4>

        <p className="center-align grey-text">
          Ingresa tu correo y
          te enviaremos un enlace.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="input-field">

            <i
              className="
                material-icons
                prefix
              "
            >
              email
            </i>

            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

            <label htmlFor="email">
              Correo electrónico
            </label>

          </div>

          <button
            className="
              btn
              amber
              darken-2
              black-text
              waves-effect
              waves-light
              recover-btn
            "
            type="submit"
          >

            Enviar enlace

          </button>

        </form>

      </div>

    </div>
  );
}