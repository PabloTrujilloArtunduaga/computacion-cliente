import React, {
  useEffect,
  useState,
} from "react";

import ClienteNavbar from "./ClienteNavbar";
import Footer from "../../components/Footer";

export default function ClienteDashboard() {

  const [usuario, setUsuario] =
    useState(null);

  const [facturas, setFacturas] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  /* =========================================
     USER
  ========================================= */

  useEffect(() => {

    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      setUsuario(user);

    } catch (error) {

      console.error(
        "Error obteniendo usuario",
        error
      );

    }

  }, []);

  /* =========================================
     FACTURAS
  ========================================= */

  useEffect(() => {

    const cargarFacturas = async () => {

      try {

        const user = JSON.parse(
          localStorage.getItem("user")
        );

        const token =
          localStorage.getItem("token");

        if (!user || !token) {

          setLoading(false);
          return;

        }

        const res = await fetch(
          `http://localhost:3000/api/facturas/cliente/${user._id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        setFacturas(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {

        console.error(
          "Error cargando facturas",
          error
        );

      } finally {

        setLoading(false);

      }

    };

    cargarFacturas();

  }, []);

  /* =========================================
     ESTADOS
  ========================================= */

  const getEstadoStyles = (estado) => {

    switch (estado) {

      case "pagada":

        return {
          background:
            "rgba(34,197,94,0.14)",
          color: "#16a34a",
          border:
            "1px solid rgba(34,197,94,0.18)",
        };

      case "pendiente":

        return {
          background:
            "rgba(245,158,11,0.14)",
          color: "#d97706",
          border:
            "1px solid rgba(245,158,11,0.18)",
        };

      case "anulada":

        return {
          background:
            "rgba(239,68,68,0.14)",
          color: "#dc2626",
          border:
            "1px solid rgba(239,68,68,0.18)",
        };

      default:

        return {
          background:
            "rgba(0,0,0,0.05)",
          color: "#444",
          border:
            "1px solid rgba(0,0,0,0.08)",
        };

    }

  };

  return (

    <div style={pageStyle}>

      <ClienteNavbar />

      {/* =========================================
          HERO
      ========================================= */}

      <section style={heroStyle}>

        <div style={heroOverlayStyle}></div>

        <div style={heroContentStyle}>

          <span style={heroTagStyle}>
            PANEL DEL CLIENTE
          </span>

          <h1 style={heroTitleStyle}>
            Bienvenido,
            {" "}
            {usuario?.nombre || "Cliente"}
          </h1>

          <p style={heroTextStyle}>
            Consulta tus compras,
            facturas y actividad
            reciente desde tu panel.
          </p>

        </div>

      </section>

      {/* =========================================
          MAIN
      ========================================= */}

      <main style={mainStyle}>

        {/* =========================================
            TOP GRID
        ========================================= */}

        <div style={topGridStyle}>

          {/* USER CARD */}

          <div style={cardStyle}>

            <div style={cardHeaderStyle}>

              <h3 style={cardTitleStyle}>
                Mi Información
              </h3>

            </div>

            <div style={userInfoStyle}>

              <div style={avatarStyle}>

                {
                  usuario?.nombre
                    ?.charAt(0)
                    ?.toUpperCase() || "C"
                }

              </div>

              <div>

                <p style={infoTextStyle}>

                  <strong>
                    Nombre:
                  </strong>

                  {" "}
                  {usuario?.nombre}

                </p>

                <p style={infoTextStyle}>

                  <strong>
                    Email:
                  </strong>

                  {" "}
                  {usuario?.email}

                </p>

                <span style={activeBadgeStyle}>
                  Activo
                </span>

              </div>

            </div>

          </div>

          {/* STATS */}

          <div style={statsCardStyle}>

            <span style={statsLabelStyle}>
              Compras realizadas
            </span>

            <h2 style={statsNumberStyle}>
              {facturas.length}
            </h2>

          </div>

        </div>

        {/* =========================================
            FACTURAS
        ========================================= */}

        <div style={cardStyle}>

          <div style={cardHeaderStyle}>

            <h3 style={cardTitleStyle}>
              Mis Compras
            </h3>

          </div>

          {loading ? (

            <div style={emptyStateStyle}>
              Cargando compras...
            </div>

          ) : facturas.length === 0 ? (

            <div style={emptyStateStyle}>
              No tienes compras aún
            </div>

          ) : (

            <div style={tableWrapperStyle}>

              <table style={tableStyle}>

                <thead style={tableHeadStyle}>

                  <tr>

                    <th style={thStyle}>
                      ID
                    </th>

                    <th style={thStyle}>
                      Productos
                    </th>

                    <th style={thStyle}>
                      Total
                    </th>

                    <th style={thStyle}>
                      Pago
                    </th>

                    <th style={thStyle}>
                      Fecha
                    </th>

                    <th style={thStyle}>
                      Estado
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {facturas.map(
                    (factura) => (

                      <tr
                        key={factura._id}
                        style={trStyle}
                      >

                        <td style={{
                          ...tdStyle,
                          ...idStyle,
                        }}>

                          {factura._id}

                        </td>

                        <td style={tdStyle}>

                          {
                            factura.productos.map(
                              (p, i) => (

                                <div
                                  key={i}
                                  style={
                                    productItemStyle
                                  }
                                >

                                  {p.nombre}
                                  {" "}
                                  ×
                                  {p.cantidad}

                                </div>

                              )
                            )
                          }

                        </td>

                        <td style={{
                          ...tdStyle,
                          ...totalStyle,
                        }}>

                          $
                          {factura.total?.toLocaleString()}

                        </td>

                        <td style={tdStyle}>
                          {factura.metodo_pago}
                        </td>

                        <td style={tdStyle}>

                          {
                            new Date(
                              factura.createdAt
                            ).toLocaleDateString(
                              "es-CO"
                            )
                          }

                        </td>

                        <td style={tdStyle}>

                          <span
                            style={{
                              ...estadoBadgeStyle,
                              ...getEstadoStyles(
                                factura.estado
                              ),
                            }}
                          >

                            {factura.estado}

                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </main>

      <Footer />

    </div>

  );

}

{/* =========================================
   PAGE
========================================= */}

const pageStyle = {

  minHeight: "100vh",

  background: "#fafafa",

};

/* =========================================
   HERO
========================================= */

const heroStyle = {

  position: "relative",

  padding:
    "70px 20px 60px",

  textAlign: "center",

  overflow: "hidden",

  background:
    "linear-gradient(135deg,#111,#1b1b1b)",

};

const heroOverlayStyle = {

  position: "absolute",
  inset: 0,

  background:
    "radial-gradient(circle at top, rgba(212,175,55,0.14), transparent 65%)",

};

const heroContentStyle = {

  position: "relative",

  zIndex: 2,

  maxWidth: "800px",

  margin: "0 auto",

};

const heroTagStyle = {

  display: "inline-block",

  padding: "7px 16px",

  borderRadius: "999px",

  background:
    "rgba(212,175,55,0.12)",

  color: "#d4af37",

  fontWeight: 700,

  fontSize: "0.78rem",

  letterSpacing: "1.5px",

};

const heroTitleStyle = {

  marginTop: "22px",

  marginBottom: "14px",

  fontSize:
    "clamp(2.3rem,5vw,4rem)",

  color: "#fff",

  fontFamily:
    "'Playfair Display', serif",

  lineHeight: 1.1,

};

const heroTextStyle = {

  maxWidth: "620px",

  margin: "0 auto",

  color:
    "rgba(255,255,255,0.78)",

  fontSize: "1rem",

  lineHeight: 1.7,

};

/* =========================================
   MAIN
========================================= */

const mainStyle = {

  maxWidth: "1250px",

  margin: "0 auto",

  padding:
    "35px 20px 70px",

};

const topGridStyle = {

  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit,minmax(300px,1fr))",

  gap: "22px",

  marginBottom: "28px",

};

/* =========================================
   CARDS
========================================= */

const cardStyle = {

  background: "#fff",

  borderRadius: "20px",

  padding: "26px",

  border:
    "1px solid rgba(0,0,0,0.05)",

  boxShadow:
    "0 4px 18px rgba(0,0,0,0.05)",

};

const cardHeaderStyle = {

  marginBottom: "20px",

};

const cardTitleStyle = {

  margin: 0,

  color: "#111",

  fontSize: "1.5rem",

  fontFamily:
    "'Playfair Display', serif",

};

/* =========================================
   USER
========================================= */

const userInfoStyle = {

  display: "flex",

  alignItems: "center",

  gap: "16px",

};

const avatarStyle = {

  width: "64px",
  height: "64px",

  borderRadius: "50%",

  background:
    "linear-gradient(135deg,#d4af37,#f4d76a)",

  display: "flex",

  alignItems: "center",
  justifyContent: "center",

  color: "#111",

  fontSize: "1.2rem",

  fontWeight: 800,

};

const infoTextStyle = {

  color: "#444",

  marginBottom: "6px",

  fontSize: "0.95rem",

};

const activeBadgeStyle = {

  display: "inline-flex",

  alignItems: "center",

  padding: "6px 12px",

  borderRadius: "999px",

  background:
    "rgba(34,197,94,0.12)",

  color: "#16a34a",

  border:
    "1px solid rgba(34,197,94,0.14)",

  fontSize: "0.78rem",

  fontWeight: 700,

};

/* =========================================
   STATS
========================================= */

const statsCardStyle = {

  borderRadius: "20px",

  padding: "26px",

  background:
    "linear-gradient(135deg,#d4af37,#f4d76a)",

  color: "#111",

  display: "flex",

  flexDirection: "column",

  justifyContent: "center",

  boxShadow:
    "0 6px 20px rgba(212,175,55,0.18)",

};

const statsLabelStyle = {

  fontWeight: 700,

  fontSize: "0.95rem",

};

const statsNumberStyle = {

  margin: "8px 0 0",

  fontSize: "3.4rem",

  lineHeight: 1,

};

/* =========================================
   TABLE
========================================= */

const tableWrapperStyle = {

  width: "100%",

  overflowX: "auto",

};

const tableStyle = {

  width: "100%",

  borderCollapse: "collapse",

};

const tableHeadStyle = {

  background:
    "rgba(212,175,55,0.08)",

};

const thStyle = {

  padding: "15px",

  textAlign: "left",

  color: "#222",

  fontWeight: 700,

  fontSize: "0.92rem",

  borderBottom:
    "1px solid rgba(0,0,0,0.06)",

};

const trStyle = {

  transition: "0.2s ease",

};

const tdStyle = {

  padding: "16px 15px",

  color: "#444",

  fontSize: "0.92rem",

  borderBottom:
    "1px solid rgba(0,0,0,0.05)",

};

const idStyle = {

  fontSize: "0.72rem",

  color: "#888",

  maxWidth: "160px",

};

const productItemStyle = {

  marginBottom: "5px",

  color: "#444",

};

const totalStyle = {

  color: "#b88a12",

  fontWeight: 800,

};

const estadoBadgeStyle = {

  display: "inline-flex",

  alignItems: "center",

  justifyContent: "center",

  padding: "7px 12px",

  borderRadius: "999px",

  fontSize: "0.76rem",

  fontWeight: 700,

  textTransform: "capitalize",

};

/* =========================================
   EMPTY
========================================= */

const emptyStateStyle = {

  padding: "45px 20px",

  textAlign: "center",

  color: "#777",

  fontSize: "0.95rem",

};