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

import "../styles/Registro.css";

export default function Registro() {

  /*
    ======================================
    STATES
    ======================================
  */

  const [nombre, setNombre] =
    useState("");

  const [correo, setCorreo] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword
  ] = useState("");

  const [
    loading,
    setLoading
  ] = useState(false);

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
    GSAP ONLY FOR REGISTRO
    ======================================
  */

  useEffect(() => {

    /*
      CONTEXT:
      evita afectar otros componentes
      y limpia automáticamente
    */

    const ctx =
      gsap.context(() => {

        const tl =
          gsap.timeline();

        /*
          PAGE FADE
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
          FLOATING BG
        */

        circlesRef.current.forEach(
          (circle, index) => {

            if (!circle) return;

            gsap.to(
              circle,
              {
                y:
                  index % 2 === 0
                    ? -25
                    : 25,

                x:
                  index % 2 === 0
                    ? 20
                    : -20,

                duration:
                  5 + index,

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
            y: 60,
            scale: 0.88
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
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
            y: -20
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7
          },
          "-=0.5"
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
          INPUTS
        */

        .fromTo(
          formRef.current?.children,
          {
            opacity: 0,
            y: 25
          },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.7,
            ease:
              "power3.out"
          },
          "-=0.3"
        );

        /*
          BUTTON GLOW
        */

        gsap.to(
          buttonRef.current,
          {
            boxShadow:
              "0 0 22px rgba(245,158,11,0.45)",

            repeat: -1,

            yoyo: true,

            duration: 1.4,

            ease:
              "sine.inOut"
          }
        );

      }, containerRef);

    /*
      CLEANUP:
      elimina TODAS las animaciones
      al desmontar el componente
    */

    return () => {

      ctx.revert();

    };

  }, []);

  /*
    ======================================
    REGISTER
    ======================================
  */

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (
        !nombre.trim() ||
        !correo.trim() ||
        !password.trim() ||
        !confirmPassword.trim()
      ) {

        alert(
          "❌ No puedes dejar campos vacíos."
        );

        return;
      }

      if (
        !correo.includes("@")
      ) {

        alert(
          "❌ Correo inválido"
        );

        return;
      }

      if (
        password.length < 6
      ) {

        alert(
          "❌ La contraseña debe tener al menos 6 caracteres"
        );

        return;
      }

      if (
        password !==
        confirmPassword
      ) {

        alert(
          "❌ Las contraseñas no coinciden."
        );

        return;
      }

      try {

        setLoading(true);

        const res =
          await fetch(
            "http://localhost:3000/api/users/register",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify({
                  usuario: nombre,
                  email: correo,
                  password
                })
            }
          );

        const data =
          await res.json();

        /*
          SUCCESS
        */

        if (res.ok) {

          localStorage.setItem(
            "token",
            data.token
          );

          localStorage.setItem(
            "rol",
            data.usuario.rol
          );

          localStorage.setItem(
            "user",
            JSON.stringify(
              data.usuario
            )
          );

          /*
            EXIT
          */

          gsap.to(
            cardRef.current,
            {
              scale: 1.08,
              opacity: 0,
              y: -40,
              duration: 0.8,
              ease:
                "power4.in",
              onComplete: () => {
                navigate("/");
              }
            }
          );

        } else {

          /*
            ERROR SHAKE
          */

          gsap.fromTo(
            cardRef.current,
            {
              x: -8
            },
            {
              x: 8,
              repeat: 5,
              yoyo: true,
              duration: 0.07
            }
          );

          alert(
            data.mensaje ||
            "Error al registrar"
          );

        }

      } catch (error) {

        console.error(error);

        alert(
          "❌ Error al conectar con el servidor"
        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <div
      ref={containerRef}
      className="registro-container"
    >

      {/* ======================================
          BACKGROUND
      ====================================== */}

      <div
        ref={(el) =>
          (
            circlesRef.current[0] = el
          )
        }
        className="
          registro-circle
          registro-circle-1
        "
      />

      <div
        ref={(el) =>
          (
            circlesRef.current[1] = el
          )
        }
        className="
          registro-circle
          registro-circle-2
        "
      />

      <div
        ref={(el) =>
          (
            circlesRef.current[2] = el
          )
        }
        className="
          registro-circle
          registro-circle-3
        "
      />

      {/* ======================================
          CARD
      ====================================== */}

      <div
        ref={cardRef}
        className="
          card-panel
          registro-card
          z-depth-5
        "
      >

        <h3
          ref={titleRef}
          className="
            center-align
            registro-title
          "
        >
          Crear Cuenta
        </h3>

        <p
          ref={textRef}
          className="
            center-align
            registro-subtitle
          "
        >

          Regístrate en
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
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) =>
                setNombre(
                  e.target.value
                )
              }
            />

            <label htmlFor="nombre">
              Nombre de Usuario
            </label>

          </div>

          {/* EMAIL */}

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
              id="correo"
              type="email"
              value={correo}
              onChange={(e) =>
                setCorreo(
                  e.target.value
                )
              }
            />

            <label htmlFor="correo">
              Correo Electrónico
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
              id="password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

            <label htmlFor="password">
              Contraseña
            </label>

          </div>

          {/* CONFIRM */}

          <div className="input-field">

            <i
              className="
                material-icons
                prefix
              "
            >
              verified_user
            </i>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
            />

            <label htmlFor="confirmPassword">
              Confirmar Contraseña
            </label>

          </div>

          {/* BUTTON */}

          <div
            className="
              center-align
              registro-btn-wrapper
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
                registro-btn
              "
              type="submit"
              disabled={loading}
            >

              {
                loading ? (
                  <>
                    <i className="material-icons left">
                      autorenew
                    </i>

                    Creando...
                  </>
                ) : (
                  <>
                    <i className="material-icons left">
                      person_add
                    </i>

                    Crear Cuenta
                  </>
                )
              }

            </button>

          </div>

        </form>

        {/* ======================================
            LINKS
        ====================================== */}

        <div
          className="
            center-align
            registro-links
          "
        >

          <p
            className="
              grey-text
              text-darken-2
            "
          >

            ¿Ya tienes una cuenta?
            {" "}

            <Link
              to="/login"
              className="
                amber-text
                text-darken-4
                registro-link-bold
              "
            >
              Inicia sesión
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}