import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #2563eb 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* EFECTOS DECORATIVOS */}
      <div
        style={{
          position: "absolute",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "rgba(59,130,246,0.25)",
          top: "-100px",
          left: "-100px",
          filter: "blur(40px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "rgba(168,85,247,0.20)",
          bottom: "-100px",
          right: "-100px",
          filter: "blur(40px)",
        }}
      />

      {/* CARD */}
      <div
        style={{
          width: "100%",
          maxWidth: "650px",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "28px",
          padding: "60px 40px",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* ICONO */}
        <div
          style={{
            width: "110px",
            height: "110px",
            margin: "0 auto 30px",
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 30px rgba(37,99,235,0.45)",
          }}
        >
          <span
            className="material-icons"
            style={{
              fontSize: "55px",
              color: "#fff",
            }}
          >
            error_outline
          </span>
        </div>

        {/* TITULO */}
        <h1
          style={{
            fontSize: "110px",
            fontWeight: "900",
            margin: 0,
            lineHeight: 1,
            color: "#ffffff",
            letterSpacing: "4px",
            textShadow: "0 10px 25px rgba(0,0,0,0.35)",
          }}
        >
          404
        </h1>

        <h2
          style={{
            marginTop: "18px",
            marginBottom: "15px",
            fontSize: "36px",
            fontWeight: "700",
            color: "#f8fafc",
          }}
        >
          Página no encontrada
        </h2>

        <p
          style={{
            color: "#cbd5e1",
            fontSize: "18px",
            lineHeight: "1.8",
            maxWidth: "500px",
            margin: "0 auto 40px",
          }}
        >
          La página que intentas visitar no existe,
          fue movida o la URL ingresada es incorrecta.
        </p>

        {/* BOTONES */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "18px",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "15px 28px",
              borderRadius: "14px",
              background:
                "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              color: "#fff",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "16px",
              boxShadow: "0 10px 25px rgba(37,99,235,0.35)",
              transition: "0.3s ease",
            }}
          >
            <span className="material-icons">
              home
            </span>

            Volver al inicio
          </Link>

          <button
            onClick={() => window.history.back()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "15px 28px",
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.08)",
              color: "#fff",
              fontWeight: "700",
              fontSize: "16px",
              cursor: "pointer",
              backdropFilter: "blur(10px)",
            }}
          >
            <span className="material-icons">
              arrow_back
            </span>

            Regresar
          </button>
        </div>
      </div>
    </div>
  );
}