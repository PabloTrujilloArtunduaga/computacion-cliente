import React, {
  useEffect,
  useRef,
} from "react";

import gsap from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(
  ScrollTrigger
);

export default function Nosotros() {
  const tituloRef =
    useRef(null);

  const subtituloRef =
    useRef(null);

  const historiaRef =
    useRef(null);

  const misionRef =
    useRef(null);

  const visionRef =
    useRef(null);

  const lineaRef =
    useRef(null);

  useEffect(() => {
    /*
      =========================
      HERO TITLE
      =========================
    */

    gsap.fromTo(
      tituloRef.current,
      {
        opacity: 0,
        y: 120,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,

        duration: 1.5,

        ease: "power4.out",

        scrollTrigger: {
          trigger:
            tituloRef.current,

          start:
            "top 90%",

          end:
            "top 40%",

          scrub: 1.5,
        },
      }
    );

    /*
      SUBTITLE
    */

    gsap.fromTo(
      subtituloRef.current,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,

        duration: 1.2,

        ease: "power3.out",

        scrollTrigger: {
          trigger:
            subtituloRef.current,

          start:
            "top 92%",

          end:
            "top 55%",

          scrub: 1,
        },
      }
    );

    /*
      GOLD LINE
    */

    gsap.fromTo(
      lineaRef.current,
      {
        width: 0,
        opacity: 0,
      },
      {
        width: "120px",
        opacity: 1,

        duration: 1.3,

        ease: "power3.out",

        scrollTrigger: {
          trigger:
            lineaRef.current,

          start:
            "top 90%",

          scrub: 1,
        },
      }
    );

    /*
      =========================
      CARDS
      =========================
    */

    const cards = [
      historiaRef.current,
      misionRef.current,
      visionRef.current,
    ];

    cards.forEach(
      (card, index) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 140,
            scale: 0.9,
            rotateX: 8,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,

            duration: 1.5,

            ease:
              "power4.out",

            scrollTrigger: {
              trigger: card,

              start:
                "top 92%",

              end:
                "top 45%",

              scrub: 1.4,
            },

            delay:
              index * 0.15,
          }
        );
      }
    );

    /*
      =========================
      HOVER PREMIUM
      =========================
    */

    cards.forEach((card) => {
      if (!card) return;

      card.addEventListener(
        "mouseenter",
        () => {
          gsap.to(card, {
            y: -14,

            scale: 1.025,

            duration: 0.4,

            boxShadow:
              "0 25px 50px rgba(0,0,0,0.18)",

            borderColor:
              "rgba(212,175,55,0.35)",

            ease:
              "power3.out",
          });
        }
      );

      card.addEventListener(
        "mouseleave",
        () => {
          gsap.to(card, {
            y: 0,

            scale: 1,

            duration: 0.4,

            boxShadow:
              "0 10px 25px rgba(0,0,0,0.10)",

            borderColor:
              "rgba(212,175,55,0.15)",

            ease:
              "power3.out",
          });
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(
        (trigger) =>
          trigger.kill()
      );
    };
  }, []);

  return (
    <section
      style={{
        background:
          "linear-gradient(180deg,#fafafa 0%,#f3f3f3 45%,#ededed 100%)",

        padding:
          "140px 0",

        position:
          "relative",

        overflow:
          "hidden",
      }}
    >
      {/* BLUR LIGHT */}

      <div
        style={{
          position:
            "absolute",

          top: "-120px",
          left: "-120px",

          width: "320px",
          height: "320px",

          borderRadius:
            "50%",

          background:
            "rgba(212,175,55,0.08)",

          filter:
            "blur(80px)",
        }}
      />

      <div
        className="container"
        style={{
          maxWidth:
            "1050px",

          position:
            "relative",

          zIndex: 2,
        }}
      >
        {/* =========================
            HEADER
        ========================= */}

        <h2
          ref={tituloRef}
          style={{
            fontFamily:
              "'Playfair Display', serif",

            fontSize:
              "clamp(3rem, 6vw, 5rem)",

            fontWeight:
              "800",

            textAlign:
              "center",

            color:
              "#d4af37",

            marginBottom:
              "20px",

            letterSpacing:
              "1px",

            opacity: 0,

            textShadow:
              "0 5px 25px rgba(0,0,0,0.08)",
          }}
        >
          Sobre Nosotros
        </h2>

        <div
          ref={lineaRef}
          style={{
            width: "0px",
            height: "4px",

            borderRadius:
              "999px",

            margin:
              "0 auto 35px",

            background:
              "linear-gradient(90deg,#d4af37,#f4d76a)",

            opacity: 0,
          }}
        />

        <p
          ref={subtituloRef}
          style={{
            maxWidth:
              "760px",

            margin:
              "0 auto 90px",

            textAlign:
              "center",

            fontSize:
              "1.15rem",

            lineHeight:
              "2",

            color:
              "#555",

            opacity: 0,
          }}
        >
          Somos mucho más que un
          estanco. Creamos una
          experiencia elegante,
          moderna y cercana para
          quienes disfrutan la
          calidad, los buenos
          momentos y el servicio
          premium.
        </p>

        {/* =========================
            HISTORIA
        ========================= */}

        <div
          ref={historiaRef}
          style={cardStyle}
        >
          <span
            style={
              cardTitleStyle
            }
          >
            Nuestra Historia
          </span>

          <p style={paragraphStyle}>
            Nuestro estanco nació
            con el propósito de
            ofrecer un espacio
            diferente: elegante,
            moderno y confiable.
            Desde nuestros primeros
            días, entendimos que la
            experiencia del cliente
            debía sentirse cercana,
            exclusiva y memorable.

            <br />
            <br />

            Con el paso del tiempo,
            hemos construido una
            identidad basada en la
            calidad de nuestros
            productos, la atención
            personalizada y la
            pasión por crear un
            ambiente sofisticado.

            <br />
            <br />

            Cada detalle de nuestro
            espacio ha sido pensado
            para transmitir estilo,
            comodidad y confianza,
            convirtiéndonos en un
            referente local dentro
            de la región.
          </p>
        </div>

        {/* =========================
            MISION
        ========================= */}

        <div
          ref={misionRef}
          style={cardStyle}
        >
          <span
            style={
              cardTitleStyle
            }
          >
            Misión
          </span>

          <p style={paragraphStyle}>
            Brindar una experiencia
            moderna y responsable,
            ofreciendo productos de
            alta calidad acompañados
            de una atención cálida,
            cercana y profesional.

            <br />
            <br />

            Buscamos crear un lugar
            donde nuestros clientes
            puedan disfrutar con
            tranquilidad, estilo y
            confianza, manteniendo
            siempre un compromiso
            con la excelencia y el
            consumo responsable.
          </p>
        </div>

        {/* =========================
            VISION
        ========================= */}

        <div
          ref={visionRef}
          style={cardStyle}
        >
          <span
            style={
              cardTitleStyle
            }
          >
            Visión
          </span>

          <p style={paragraphStyle}>
            Convertirnos en el
            estanco líder de la
            región, reconocido por
            su innovación, servicio
            premium y experiencia
            diferenciadora.

            <br />
            <br />

            Aspiramos a seguir
            evolucionando junto a
            las nuevas tendencias,
            fortaleciendo nuestra
            presencia digital y
            ofreciendo espacios cada
            vez más modernos,
            exclusivos y seguros
            para nuestros clientes.
          </p>
        </div>
      </div>
    </section>
  );
}

/*
  ================================
  ESTILOS
  ================================
*/

const cardStyle = {
  marginBottom: "55px",

  padding: "45px",

  borderRadius: "28px",

  background:
    "rgba(255,255,255,0.92)",

  backdropFilter:
    "blur(12px)",

  border:
    "1px solid rgba(212,175,55,0.15)",

  boxShadow:
    "0 10px 25px rgba(0,0,0,0.10)",

  opacity: 0,

  transition:
    "all .35s ease",
};

const cardTitleStyle = {
  display: "block",

  marginBottom: "28px",

  fontFamily:
    "'Playfair Display', serif",

  fontSize: "2.2rem",

  fontWeight: "800",

  color: "#d4af37",
};

const paragraphStyle = {
  fontFamily:
    "'Lato', sans-serif",

  fontSize: "1.12rem",

  lineHeight: "2",

  color: "#4a4340",

  textAlign: "justify",
};