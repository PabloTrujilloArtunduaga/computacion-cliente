import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import gsap from "gsap";

import "../styles/Login.css";

export default function Login() {

  /*
    ======================================
    STATES
    ======================================
  */

  const [usuario, setUsuario] =
    useState("");

  const [password, setPassword] =
    useState("");

  const navigate =
    useNavigate();

  /*
    ======================================
    REFS
    ======================================
  */

  const containerRef =
    useRef(null);

  const cardRef =
    useRef(null);

  const titleRef =
    useRef(null);

  const textRef =
    useRef(null);

  const formRef =
    useRef(null);

  const buttonRef =
    useRef(null);

  const circlesRef =
    useRef([]);

  /*
    ======================================
    GSAP ANIMATIONS
    ======================================
  */

  useEffect(() => {

    const tl =
      gsap.timeline();

    /*
      BG
    */

    gsap.fromTo(
      containerRef.current,
      {
        opacity: 0
      },
      {
        opacity: 1,
        duration: 1
      }
    );

    /*
      FLOATING CIRCLES
    */

    circlesRef.current.forEach(
      (circle, index) => {

        gsap.to(
          circle,
          {
            y:
              index % 2 === 0
                ? -30
                : 30,

            x:
              index % 2 === 0
                ? 20
                : -20,

            duration:
              4 + index,

            repeat: -1,

            yoyo: true,

            ease:
              "sine.inOut"
          }
        );
      }
    );

    /*
      CARD
    */

    tl.fromTo(
      cardRef.current,
      {
        opacity: 0,
        scale: 0.8,
        y: 80,
        rotateX: 20
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        rotateX: 0,
        duration: 1.2,
        ease:
          "power4.out"
      }
    )

    /*
      TITLE
    */

    .fromTo(
      titleRef.current,
      {
        opacity: 0,
        y: -25
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.7
      },
      "-=0.6"
    )

    /*
      TEXT
    */

    .fromTo(
      textRef.current,
      {
        opacity: 0,
        y: 20
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.7
      },
      "-=0.4"
    )

    /*
      FORM
    */

    .fromTo(
      formRef.current.children,
      {
        opacity: 0,
        y: 30
      },
      {
        opacity: 1,
        y: 0,
        stagger: 0.18,
        duration: 0.8,
        ease:
          "power3.out"
      },
      "-=0.4"
    );

    /*
      BUTTON PULSE
    */

    gsap.to(
      buttonRef.current,
      {
        boxShadow:
          "0 0 28px rgba(255,193,7,0.55)",

        repeat: -1,

        yoyo: true,

        duration: 1.5,

        ease:
          "sine.inOut"
      }
    );

  }, []);

  /*
    ======================================
    LOGIN
    ======================================
  */

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (
        !usuario.trim() ||
        !password.trim()
      ) {

        alert(
          "Usuario y contraseña obligatorios"
        );

        return;
      }

      try {

        const res =
          await fetch(
            "http://localhost:3000/api/users/login",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify({
                  usuario,
                  password
                })
            }
          );

        const data =
          await res.json();

        /*
          ERROR
        */

        if (!res.ok) {

          gsap.fromTo(
            cardRef.current,
            {
              x: -10
            },
            {
              x: 10,
              repeat: 5,
              yoyo: true,
              duration: 0.07
            }
          );

          alert(
            "❌ " +
            (
              data.mensaje ||
              data.message ||
              "Error en login"
            )
          );

          return;
        }

        /*
          SUCCESS
        */

        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "rol",
          data.rol
        );

        if (
          data.usuario &&
          typeof data.usuario ===
          "object"
        ) {

          localStorage.setItem(
            "user",
            JSON.stringify(
              data.usuario
            )
          );

        } else {

          localStorage.removeItem(
            "user"
          );
        }

        /*
          EXIT ANIMATION
        */

        gsap.to(
          cardRef.current,
          {
            scale: 1.08,
            opacity: 0,
            y: -60,
            duration: 0.8,
            ease:
              "power4.in",
            onComplete: () => {
              navigate("/");
            }
          }
        );

      } catch (error) {

        console.error(error);

        alert(
          "❌ Error al conectar con el servidor"
        );
      }
    };

  return (

    <div
      ref={containerRef}
      className="login-container"
    >

      {/* ======================================
          BACKGROUND EFFECTS
      ====================================== */}

      <div
        ref={(el) =>
          (
            circlesRef.current[0] = el
          )
        }
        className="
          login-circle
          circle-1
        "
      />

      <div
        ref={(el) =>
          (
            circlesRef.current[1] = el
          )
        }
        className="
          login-circle
          circle-2
        "
      />

      <div
        ref={(el) =>
          (
            circlesRef.current[2] = el
          )
        }
        className="
          login-circle
          circle-3
        "
      />

      {/* ======================================
          CARD
      ====================================== */}

      <div
        ref={cardRef}
        className="
          card-panel
          tarjeta-login
          z-depth-5
        "
      >

        <h3
          ref={titleRef}
          className="
            center-align
            login-title
          "
        >
          Iniciar Sesión
        </h3>

        <p
          ref={textRef}
          className="
            center-align
            login-subtitle
          "
        >

          Bienvenido a
          {" "}

          <strong>
            Estanco MalaCopa
          </strong>

        </p>

        {/* ======================================
            FORM
        ====================================== */}

        <form
          ref={formRef}
          onSubmit={handleSubmit}
        >

          {/* USER */}

          <div className="input-field">

            <i
              className="
                material-icons
                prefix
              "
            >
              person
            </i>

            <input
              id="usuarioLogin"
              type="text"
              value={usuario}
              onChange={(e) =>
                setUsuario(
                  e.target.value
                )
              }
            />

            <label htmlFor="usuarioLogin">
              Usuario
            </label>

          </div>

          {/* PASSWORD */}

          <div className="input-field">

            <i
              className="
                material-icons
                prefix
              "
            >
              lock
            </i>

            <input
              id="passwordLogin"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

            <label htmlFor="passwordLogin">
              Contraseña
            </label>

          </div>

          {/* BUTTON */}

          <div
            className="
              center-align
              login-btn-wrapper
            "
          >

            <button
              ref={buttonRef}
              className="
                btn
                waves-effect
                waves-light
                amber
                darken-2
                black-text
                login-btn
              "
              type="submit"
            >

              <i className="material-icons left">
                login
              </i>

              Ingresar

            </button>

          </div>

        </form>

        {/* ======================================
            LINKS
        ====================================== */}

        <div className="center-align login-links">

          <p>

            <Link
            to="/recuperar-password"
            className="
              red-text
              text-lighten-1
              forgot-link
            "
          >
            ¿Olvidó su contraseña?
          </Link>

          </p>

          <p className="grey-text text-darken-2">

            Nuevo aquí,
            {" "}

            <Link
              to="/register"
              className="
                amber-text
                text-darken-4
                bold-link
              "
            >
              crear cuenta
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}