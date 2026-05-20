import React, { useEffect, useState } from "react";
import ClienteNavbar from "./ClienteNavbar";
import Footer from "../../components/Footer";
import { API } from "../../constants/api";

/* =========================================
   MODAL DE FACTURA
========================================= */
function FacturaModal({ factura, onClose }) {
  if (!factura) return null;

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "pagada":   return { bg: "#dcfce7", color: "#15803d", border: "#bbf7d0" };
      case "pendiente":return { bg: "#fef9c3", color: "#a16207", border: "#fde68a" };
      case "anulada":  return { bg: "#fee2e2", color: "#b91c1c", border: "#fecaca" };
      default:         return { bg: "#f3f4f6", color: "#374151", border: "#e5e7eb" };
    }
  };

  const estadoColor = getEstadoColor(factura.estado);
  const subtotal = factura.productos?.reduce((acc, p) => acc + (p.precio * p.cantidad), 0) || 0;

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContainerStyle} onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div style={modalHeaderStyle}>
          <div>
            <p style={modalEtiquetaStyle}>FACTURA</p>
            <h2 style={modalTitleStyle}>#{factura._id?.slice(-8).toUpperCase()}</h2>
          </div>
          <button style={closeBtnStyle} onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        <div style={modalBodyStyle}>

          {/* ESTADO + FECHA */}
          <div style={modalMetaRowStyle}>
            <span style={{
              ...estadoBadgeModalStyle,
              background: estadoColor.bg,
              color: estadoColor.color,
              border: `1px solid ${estadoColor.border}`,
            }}>
              {factura.estado?.toUpperCase()}
            </span>
            <span style={modalFechaStyle}>
              📅 {new Date(factura.createdAt).toLocaleDateString("es-CO", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </span>
          </div>

          <div style={modalDividerStyle} />

          {/* CLIENTE */}
          <div style={modalSectionStyle}>
            <p style={modalSectionTitleStyle}>Cliente</p>
            <div style={modalInfoGridStyle}>
              <div style={modalInfoItemStyle}>
                <span style={modalLabelStyle}>Método de pago</span>
                <span style={modalValueStyle}>{factura.metodo_pago || "—"}</span>
              </div>
              <div style={modalInfoItemStyle}>
                <span style={modalLabelStyle}>ID completo</span>
                <span style={{ ...modalValueStyle, fontSize: "0.75rem", color: "#9ca3af", fontFamily: "monospace" }}>
                  {factura._id}
                </span>
              </div>
            </div>
          </div>

          <div style={modalDividerStyle} />

          {/* PRODUCTOS */}
          <div style={modalSectionStyle}>
            <p style={modalSectionTitleStyle}>Productos</p>
            <div style={productosListStyle}>
              {factura.productos?.map((p, i) => (
                <div key={i} style={productoRowStyle}>
                  <div style={productoInfoStyle}>
                    <span style={productoNombreStyle}>{p.nombre}</span>
                    <span style={productoCantidadStyle}>× {p.cantidad}</span>
                  </div>
                  <span style={productoPrecioStyle}>
                    ${(p.precio * p.cantidad)?.toLocaleString("es-CO")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={modalDividerStyle} />

          {/* TOTAL */}
          <div style={totalRowStyle}>
            <div>
              <span style={totalLabelStyle}>Total de la factura</span>
            </div>
            <span style={totalAmountStyle}>
              ${factura.total?.toLocaleString("es-CO")}
            </span>
          </div>

        </div>

        {/* FOOTER */}
        <div style={modalFooterStyle}>
          <button style={closeModalBtnStyle} onClick={onClose}>
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}

/* =========================================
   DASHBOARD PRINCIPAL
========================================= */
export default function ClienteDashboard() {
  const [usuario, setUsuario]           = useState(null);
  const [facturas, setFacturas]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [facturaModal, setFacturaModal] = useState(null);

  /* USER */
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setUsuario(user);
    } catch (error) {
      console.error("Error obteniendo usuario", error);
    }
  }, []);

  /* FACTURAS */
  useEffect(() => {
    const cargarFacturas = async () => {
      try {
        const user  = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");
        if (!user || !token) { setLoading(false); return; }

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
          `${API}/facturas/cliente/${user._id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setFacturas(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error cargando facturas", error);
      } finally {
        setLoading(false);
      }
    };
    cargarFacturas();
  }, []);

  /* ESTADO BADGE */
  const getEstadoStyles = (estado) => {
    switch (estado) {
      case "pagada":   return { background: "#dcfce7", color: "#15803d", border: "1px solid #bbf7d0" };
      case "pendiente":return { background: "#fef9c3", color: "#a16207", border: "1px solid #fde68a" };
      case "anulada":  return { background: "#fee2e2", color: "#b91c1c", border: "1px solid #fecaca" };
      default:         return { background: "#f3f4f6", color: "#374151", border: "1px solid #e5e7eb" };
    }
  };

  const pagadas   = facturas.filter(f => f.estado === "pagada").length;
  const pendientes = facturas.filter(f => f.estado === "pendiente").length;

  return (
    <div style={pageStyle}>

      {facturaModal && (
        <FacturaModal factura={facturaModal} onClose={() => setFacturaModal(null)} />
      )}

      <ClienteNavbar />

      {/* HERO */}
      <section style={heroStyle}>
        <div style={heroGlowStyle} />
        <div style={heroContentStyle}>
          <span style={heroTagStyle}>Panel del Cliente</span>
          <h1 style={heroTitleStyle}>
            Hola, <span style={{ color: "#f4d76a" }}>{usuario?.nombre || "Cliente"}</span>
          </h1>
          <p style={heroTextStyle}>
            Aquí puedes consultar tus compras, facturas y actividad reciente.
          </p>
        </div>
      </section>

      {/* MAIN */}
      <main style={mainStyle}>

        {/* STATS ROW */}
        <div style={statsRowStyle}>
          <StatCard icon="🧾" label="Total compras" value={facturas.length} color="#4f46e5" />
          <StatCard icon="✅" label="Pagadas"        value={pagadas}         color="#15803d" />
          <StatCard icon="⏳" label="Pendientes"     value={pendientes}      color="#a16207" />
          <div style={userSummaryCardStyle}>
            <div style={userAvatarStyle}>
              {usuario?.nombre?.charAt(0)?.toUpperCase() || "C"}
            </div>
            <div>
              <p style={userNameStyle}>{usuario?.nombre || "—"}</p>
              <p style={userEmailStyle}>{usuario?.email || "—"}</p>
              <span style={activeBadgeStyle}>● Cuenta activa</span>
            </div>
          </div>
        </div>

        {/* TABLA DE FACTURAS */}
        <div style={tableCardStyle}>
          <div style={tableCardHeaderStyle}>
            <div>
              <h2 style={tableTitleStyle}>Mis Compras</h2>
              <p style={tableSubtitleStyle}>Historial completo de facturas y pedidos</p>
            </div>
          </div>

          {loading ? (
            <div style={emptyStateStyle}>
              <span style={emptyIconStyle}>⏳</span>
              <p>Cargando tus compras...</p>
            </div>
          ) : facturas.length === 0 ? (
            <div style={emptyStateStyle}>
              <span style={emptyIconStyle}>🛒</span>
              <p>Aún no tienes compras registradas.</p>
            </div>
          ) : (
            <div style={tableWrapperStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr style={tableHeadRowStyle}>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Productos</th>
                    <th style={thStyle}>Total</th>
                    <th style={thStyle}>Método</th>
                    <th style={thStyle}>Fecha</th>
                    <th style={thStyle}>Estado</th>
                    <th style={{ ...thStyle, textAlign: "center" }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {facturas.map((factura, idx) => (
                    <tr
                      key={factura._id}
                      style={{ ...trStyle, background: idx % 2 === 0 ? "#fff" : "#fafafa" }}
                    >
                      <td style={{ ...tdStyle, ...idCellStyle }}>
                        #{factura._id?.slice(-8).toUpperCase()}
                      </td>
                      <td style={tdStyle}>
                        <div style={productTagsStyle}>
                          {factura.productos?.slice(0, 2).map((p, i) => (
                            <span key={i} style={productTagStyle}>
                              {p.nombre} ×{p.cantidad}
                            </span>
                          ))}
                          {factura.productos?.length > 2 && (
                            <span style={{ ...productTagStyle, background: "#e5e7eb", color: "#6b7280" }}>
                              +{factura.productos.length - 2} más
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ ...tdStyle, ...totalCellStyle }}>
                        ${factura.total?.toLocaleString("es-CO")}
                      </td>
                      <td style={tdStyle}>{factura.metodo_pago}</td>
                      <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                        {new Date(factura.createdAt).toLocaleDateString("es-CO", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </td>
                      <td style={tdStyle}>
                        <span style={{ ...estadoBadgeStyle, ...getEstadoStyles(factura.estado) }}>
                          {factura.estado}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>
                        <button
                          style={verBtnStyle}
                          onClick={() => setFacturaModal(factura)}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = "#4f46e5";
                            e.currentTarget.style.color = "#fff";
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "#4f46e5";
                          }}
                        >
                          Ver factura
                        </button>
                      </td>
                    </tr>
                  ))}
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

/* =========================================
   STAT CARD COMPONENT
========================================= */
function StatCard({ icon, label, value, color }) {
  return (
    <div style={{ ...statCardStyle, "--accent": color }}>
      <span style={statIconStyle}>{icon}</span>
      <p style={statLabelStyle}>{label}</p>
      <p style={{ ...statValueStyle, color }}>{value}</p>
    </div>
  );
}

/* =========================================
   PAGE
========================================= */
const pageStyle = {
  minHeight: "100vh",
  background: "#f5f6fa",
  fontFamily: "'Segoe UI', system-ui, sans-serif",
};

/* =========================================
   HERO
========================================= */
const heroStyle = {
  position: "relative",
  padding: "72px 24px 60px",
  background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
  overflow: "hidden",
};

const heroGlowStyle = {
  position: "absolute",
  top: "-60px", left: "50%",
  transform: "translateX(-50%)",
  width: "600px", height: "300px",
  borderRadius: "50%",
  background: "radial-gradient(ellipse, rgba(79,70,229,0.3), transparent 70%)",
  pointerEvents: "none",
};

const heroContentStyle = {
  position: "relative",
  zIndex: 2,
  maxWidth: "820px",
  margin: "0 auto",
  textAlign: "center",
};

const heroTagStyle = {
  display: "inline-block",
  padding: "6px 16px",
  borderRadius: "999px",
  background: "rgba(79,70,229,0.2)",
  border: "1px solid rgba(79,70,229,0.4)",
  color: "#a5b4fc",
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "2px",
  textTransform: "uppercase",
  marginBottom: "16px",
};

const heroTitleStyle = {
  margin: "0 0 14px",
  fontSize: "clamp(2rem, 4vw, 3.2rem)",
  fontWeight: 800,
  color: "#fff",
  lineHeight: 1.15,
};

const heroTextStyle = {
  margin: 0,
  color: "rgba(255,255,255,0.62)",
  fontSize: "1rem",
  lineHeight: 1.75,
};

/* =========================================
   MAIN
========================================= */
const mainStyle = {
  maxWidth: "1280px",
  margin: "0 auto",
  padding: "36px 20px 72px",
  boxSizing: "border-box",
};

/* =========================================
   STATS ROW
========================================= */
const statsRowStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "16px",
  marginBottom: "28px",
};

const statCardStyle = {
  background: "#fff",
  borderRadius: "16px",
  padding: "22px 20px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const statIconStyle = {
  fontSize: "1.5rem",
  display: "block",
  marginBottom: "10px",
};

const statLabelStyle = {
  margin: "0 0 6px",
  fontSize: "0.82rem",
  color: "#6b7280",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const statValueStyle = {
  margin: 0,
  fontSize: "2.2rem",
  fontWeight: 800,
  lineHeight: 1,
};

const userSummaryCardStyle = {
  background: "#fff",
  borderRadius: "16px",
  padding: "20px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  display: "flex",
  alignItems: "center",
  gap: "14px",
};

const userAvatarStyle = {
  width: "54px",
  height: "54px",
  minWidth: "54px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.3rem",
  fontWeight: 800,
  color: "#fff",
  boxShadow: "0 4px 12px rgba(79,70,229,0.3)",
};

const userNameStyle = {
  margin: "0 0 2px",
  fontWeight: 700,
  fontSize: "0.95rem",
  color: "#111",
};

const userEmailStyle = {
  margin: "0 0 8px",
  fontSize: "0.82rem",
  color: "#6b7280",
  wordBreak: "break-all",
};

const activeBadgeStyle = {
  display: "inline-block",
  padding: "4px 10px",
  borderRadius: "999px",
  background: "#dcfce7",
  color: "#15803d",
  border: "1px solid #bbf7d0",
  fontSize: "0.75rem",
  fontWeight: 700,
};

/* =========================================
   TABLE CARD
========================================= */
const tableCardStyle = {
  background: "#fff",
  borderRadius: "20px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
  overflow: "hidden",
};

const tableCardHeaderStyle = {
  padding: "24px 28px 20px",
  borderBottom: "1px solid #f3f4f6",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "12px",
};

const tableTitleStyle = {
  margin: "0 0 4px",
  fontSize: "1.25rem",
  fontWeight: 800,
  color: "#111",
};

const tableSubtitleStyle = {
  margin: 0,
  fontSize: "0.88rem",
  color: "#6b7280",
};

const tableWrapperStyle = {
  overflowX: "auto",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "860px",
};

const tableHeadRowStyle = {
  background: "#f9fafb",
};

const thStyle = {
  padding: "14px 18px",
  textAlign: "left",
  fontSize: "0.78rem",
  fontWeight: 700,
  color: "#374151",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  borderBottom: "1px solid #e5e7eb",
  whiteSpace: "nowrap",
};

const trStyle = {
  transition: "background 0.15s",
};

const tdStyle = {
  padding: "14px 18px",
  fontSize: "0.9rem",
  color: "#374151",
  borderBottom: "1px solid #f3f4f6",
  verticalAlign: "middle",
};

const idCellStyle = {
  fontFamily: "monospace",
  fontSize: "0.82rem",
  color: "#9ca3af",
  fontWeight: 600,
};

const productTagsStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "6px",
};

const productTagStyle = {
  padding: "4px 10px",
  borderRadius: "8px",
  background: "#f3f4f6",
  fontSize: "0.78rem",
  fontWeight: 600,
  color: "#374151",
};

const totalCellStyle = {
  fontWeight: 800,
  color: "#4f46e5",
  whiteSpace: "nowrap",
};

const estadoBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  padding: "5px 12px",
  borderRadius: "999px",
  fontSize: "0.75rem",
  fontWeight: 700,
  textTransform: "capitalize",
  whiteSpace: "nowrap",
};

const verBtnStyle = {
  padding: "7px 14px",
  borderRadius: "10px",
  border: "1.5px solid #4f46e5",
  background: "transparent",
  color: "#4f46e5",
  fontSize: "0.8rem",
  fontWeight: 700,
  cursor: "pointer",
  transition: "all 0.18s ease",
  whiteSpace: "nowrap",
};

/* =========================================
   EMPTY STATE
========================================= */
const emptyStateStyle = {
  padding: "64px 20px",
  textAlign: "center",
  color: "#9ca3af",
  fontSize: "0.95rem",
};

const emptyIconStyle = {
  display: "block",
  fontSize: "2.5rem",
  marginBottom: "12px",
};

/* =========================================
   MODAL
========================================= */
const modalOverlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  backdropFilter: "blur(4px)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
};

const modalContainerStyle = {
  background: "#fff",
  borderRadius: "24px",
  width: "100%",
  maxWidth: "560px",
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
};

const modalHeaderStyle = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  padding: "28px 28px 0",
};

const modalEtiquetaStyle = {
  margin: "0 0 4px",
  fontSize: "0.72rem",
  fontWeight: 700,
  color: "#9ca3af",
  letterSpacing: "2px",
};

const modalTitleStyle = {
  margin: 0,
  fontSize: "1.6rem",
  fontWeight: 800,
  color: "#111",
  fontFamily: "monospace",
};

const closeBtnStyle = {
  background: "#f3f4f6",
  border: "none",
  borderRadius: "50%",
  width: "36px",
  height: "36px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: "0.9rem",
  color: "#6b7280",
  flexShrink: 0,
};

const modalBodyStyle = {
  padding: "24px 28px",
};

const modalMetaRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "20px",
};

const estadoBadgeModalStyle = {
  display: "inline-flex",
  alignItems: "center",
  padding: "6px 14px",
  borderRadius: "999px",
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "1px",
};

const modalFechaStyle = {
  fontSize: "0.88rem",
  color: "#6b7280",
};

const modalDividerStyle = {
  borderTop: "1px solid #f3f4f6",
  margin: "20px 0",
};

const modalSectionStyle = {
  marginBottom: "4px",
};

const modalSectionTitleStyle = {
  margin: "0 0 12px",
  fontSize: "0.75rem",
  fontWeight: 700,
  color: "#9ca3af",
  textTransform: "uppercase",
  letterSpacing: "1px",
};

const modalInfoGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
};

const modalInfoItemStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "3px",
};

const modalLabelStyle = {
  fontSize: "0.75rem",
  color: "#9ca3af",
  fontWeight: 600,
};

const modalValueStyle = {
  fontSize: "0.92rem",
  color: "#111",
  fontWeight: 600,
};

const productosListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const productoRowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 14px",
  borderRadius: "12px",
  background: "#f9fafb",
  border: "1px solid #f3f4f6",
};

const productoInfoStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const productoNombreStyle = {
  fontWeight: 600,
  fontSize: "0.92rem",
  color: "#111",
};

const productoCantidadStyle = {
  fontSize: "0.82rem",
  color: "#9ca3af",
  background: "#e5e7eb",
  padding: "2px 8px",
  borderRadius: "999px",
};

const productoPrecioStyle = {
  fontWeight: 700,
  fontSize: "0.92rem",
  color: "#4f46e5",
};

const totalRowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 20px",
  borderRadius: "14px",
  background: "linear-gradient(135deg, #ede9fe, #f5f3ff)",
  border: "1px solid #ddd6fe",
};

const totalLabelStyle = {
  fontSize: "0.92rem",
  fontWeight: 700,
  color: "#4c1d95",
};

const totalAmountStyle = {
  fontSize: "1.5rem",
  fontWeight: 800,
  color: "#4f46e5",
};

const modalFooterStyle = {
  padding: "0 28px 28px",
  display: "flex",
  justifyContent: "flex-end",
};

const closeModalBtnStyle = {
  padding: "11px 28px",
  borderRadius: "12px",
  border: "1.5px solid #e5e7eb",
  background: "#fff",
  color: "#374151",
  fontSize: "0.9rem",
  fontWeight: 700,
  cursor: "pointer",
};