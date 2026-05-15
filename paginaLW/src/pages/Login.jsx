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

  const [
    showPassword,
    setShowPassword
  ] = useState(false);

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

  const logoRef =
    useRef(null);

  const circlesRef =
    useRef([]);

  /*
    ======================================
    GSAP ANIMATIONS
    SOLO LOGIN
    ======================================
  */

  useEffect(() => {

    console.log(
      "🎬 INICIANDO ANIMACIONES LOGIN"
    );

    const ctx =
      gsap.context(() => {

        const tl =
          gsap.timeline();

        /*
          PAGE
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
          BG CIRCLES
        */

        circlesRef.current.forEach(
          (
            circle,
            index
          ) => {

            if (!circle) return;

            gsap.to(
              circle,
              {
                y:
                  index % 2 === 0
                    ? -35
                    : 35,

                x:
                  index % 2 === 0
                    ? 25
                    : -25,

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
          LOGO
        */

        gsap.fromTo(
          logoRef.current,
          {
            scale: 0,
            rotate: -180,
            opacity: 0
          },
          {
            scale: 1,
            rotate: 0,
            opacity: 1,
            duration: 1.1,
            ease:
              "back.out(1.8)"
          }
        );

        /*
          CARD
        */

        tl.fromTo(
          cardRef.current,
          {
            opacity: 0,
            y: 80,
            scale: 0.85,
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
          FORM
        */

        .fromTo(
          formRef.current.children,
          {
            opacity: 0,
            y: 25
          },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.8,
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
              "0 0 24px rgba(37,99,235,0.35)",

            repeat: -1,

            yoyo: true,

            duration: 1.6,

            ease:
              "sine.inOut"
          }
        );

      }, containerRef);

    /*
      CLEAN GSAP
    */

    return () => {

      console.log(
        "🧹 LIMPIANDO GSAP LOGIN"
      );

      ctx.revert();

    };

  }, []);

  /*
    ======================================
    SIMPLE TOAST
    SIN MATERIALIZE JS
    ======================================
  */

  const showToast = (
    message,
    type = "error"
  ) => {

    const toast =
      document.createElement(
        "div"
      );

    toast.className =
      `login-toast ${type}`;

    toast.innerText =
      message;

    document.body.appendChild(
      toast
    );

    gsap.fromTo(
      toast,
      {
        opacity: 0,
        y: -20
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.4
      }
    );

    setTimeout(() => {

      gsap.to(
        toast,
        {
          opacity: 0,
          y: -20,
          duration: 0.4,
          onComplete: () => {
            toast.remove();
          }
        }
      );

    }, 3000);

  };

  /*
    ======================================
    LOGIN
    ======================================
  */

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      console.log(
        "🔐 INTENTANDO LOGIN..."
      );

      console.log(
        "👤 USUARIO:",
        usuario
      );

      if (
        !usuario.trim() ||
        !password.trim()
      ) {

        showToast(
          "❌ Completa todos los campos",
          "error"
        );

        return;

      }

      try {

        setLoading(true);

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

        console.log(
          "📡 STATUS LOGIN:",
          res.status
        );

        const data =
          await res.json();

        console.log(
          "✅ RESPUESTA LOGIN:",
          data
        );

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

          showToast(
            "❌ " +
            (
              data?.mensaje ||
              data?.message ||
              "Error al iniciar sesión"
            ),
            "error"
          );

          return;

        }

        /*
          SAVE
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
          data.usuario
        ) {

          localStorage.setItem(
            "user",
            JSON.stringify(
              data.usuario
            )
          );

        }

        console.log(
          "💾 LOGIN GUARDADO"
        );

        showToast(
          "✅ Bienvenido",
          "success"
        );

        /*
          EXIT
        */

        gsap.to(
          cardRef.current,
          {
            scale: 1.08,
            opacity: 0,
            y: -50,
            duration: 0.7,
            ease:
              "power4.in",
            onComplete: () => {

              console.log(
                "🚀 REDIRECCIONANDO..."
              );

              navigate("/");

            }
          }
        );

      } catch (error) {

        console.error(
          "❌ ERROR LOGIN:",
          error
        );

        showToast(
          "❌ Error conectando con servidor",
          "error"
        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <div
      ref={containerRef}
      className="login-container"
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
          tarjeta-login
        "
      >

        {/* LOGO */}

        <div
          ref={logoRef}
          className="
            login-logo-wrapper
          "
        >

          <div className="login-logo">

            <i className="material-icons">
              storefront
            </i>

          </div>

        </div>

        {/* TITLE */}

        <h3
          ref={titleRef}
          className="
            login-title
          "
        >
          Bienvenido
        </h3>

        <p
          ref={textRef}
          className="
            login-subtitle
          "
        >

          Ingresa a
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
              autoComplete="username"
              onChange={(e) =>
                setUsuario(
                  e.target.value
                )
              }
            />

            <label
              className={
                usuario
                  ? "active"
                  : ""
              }
              htmlFor="usuarioLogin"
            >
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
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={password}
              autoComplete="current-password"
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

            <label
              className={
                password
                  ? "active"
                  : ""
              }
              htmlFor="passwordLogin"
            >
              Contraseña
            </label>

            <button
              type="button"
              className="
                password-toggle-btn
              "
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >

              <i className="material-icons">
                {
                  showPassword
                    ? "visibility_off"
                    : "visibility"
                }
              </i>

            </button>

          </div>

          {/* BUTTON */}

          <div
            className="
              login-btn-wrapper
            "
          >

            <button
              ref={buttonRef}
              className="
                login-btn
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

                    Ingresando...
                  </>
                ) : (
                  <>
                    <i className="material-icons left">
                      login
                    </i>

                    Ingresar
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
            login-links
          "
        >

          <p>

            <Link
              to="/recuperar-password"
              className="
                forgot-link
              "
            >
              ¿Olvidaste tu contraseña?
            </Link>

          </p>

          <p>

            ¿No tienes cuenta?
            {" "}

            <Link
              to="/register"
              className="
                bold-link
              "
            >
              Crear cuenta
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}