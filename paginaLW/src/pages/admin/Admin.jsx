import { useEffect, useRef, useState, useMemo } from "react";
import Chart from "chart.js/auto";
import { useNavigate } from "react-router-dom";
import M from "materialize-css";
import AdminNavbar from "../admin/AdminNavbar";
import { getUsuarios, getProductos, getFacturas } from "../../api/admin";
import "../../styles/admin.css";

export default function AdminDashboardMaterialize() {
  const salesChartRef = useRef(null);
  const chartInstance = useRef(null);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [facturas, setFacturas] = useState([]);

  useEffect(() => {
    M.AutoInit();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [usuariosRes, productosRes, facturasRes] = await Promise.all([
          getUsuarios(),
          getProductos(),
          getFacturas(),
        ]);

        setUsuarios(Array.isArray(usuariosRes) ? usuariosRes : usuariosRes?.usuarios || []);
        setProductos(Array.isArray(productosRes) ? productosRes : productosRes?.productos || []);
        setFacturas(Array.isArray(facturasRes) ? facturasRes : facturasRes?.facturas || []);
      } catch (error) {
        console.error("❌ ERROR GENERAL DASHBOARD:", error);
        M.toast({
          html: "<span>❌ Error cargando el dashboard</span>",
          classes: "red darken-2 rounded",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // =========================================
  // MEMOS
  // =========================================

  const usuariosActivosLista = useMemo(
    () => usuarios.filter((u) => u?.estado === true),
    [usuarios]
  );

  const productosActivosLista = useMemo(
    () => productos.filter((p) => p?.estado === true),
    [productos]
  );

  const totalUsuariosActivos = usuariosActivosLista.length;
  const totalProductosActivos = productosActivosLista.length;
  const totalFacturasActivas = useMemo(
    () => facturas.filter((f) => f?.estado !== "cancelada").length,
    [facturas]
  );

  const datosGraficaUsuarios = useMemo(() => {
    const agrupados = {};
    usuariosActivosLista.forEach((usuario) => {
      if (!usuario?.createdAt) return;
      try {
        const fecha = new Date(usuario.createdAt);
        const mes = fecha.toLocaleString("es-CO", { month: "short" });
        agrupados[mes] = (agrupados[mes] || 0) + 1;
      } catch (e) {
        console.error("Error parseando fecha:", e);
      }
    });
    return Object.entries(agrupados).map(([mes, total]) => ({ mes, total }));
  }, [usuariosActivosLista]);

  // =========================================
  // CHART
  // =========================================

  useEffect(() => {
    if (!salesChartRef.current || datosGraficaUsuarios.length === 0) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const ctx = salesChartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: datosGraficaUsuarios.map((item) => item.mes),
        datasets: [
          {
            label: "Usuarios Activos",
            data: datosGraficaUsuarios.map((item) => item.total),
            borderRadius: 8,
            borderWidth: 0,
            backgroundColor: "#d4af37",
            hoverBackgroundColor: "#e7c65a",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#111",
            titleColor: "#d4af37",
            bodyColor: "#ffffff",
            borderColor: "#d4af37",
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#888", font: { weight: "600" } },
          },
          y: {
            beginAtZero: true,
            grid: { color: "rgba(212,175,55,0.1)" },
            ticks: { color: "#888" },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [datosGraficaUsuarios]);

  // =========================================
  // HELPERS STOCK
  // =========================================

  /**
   * Devuelve el JSX del badge de stock
   * agotado  → rojo
   * bajo (≤5) → naranja + cantidad
   * normal   → azul + cantidad
   */
  const renderStockBadge = (stock) => {
    const qty = Number(stock ?? 0);
    if (qty === 0) {
      return (
        <span className="admin-badge admin-badge--danger">
          Agotado
        </span>
      );
    }
    if (qty <= 5) {
      return (
        <span className="admin-badge admin-badge--warning">
          {qty} u. — bajo
        </span>
      );
    }
    return (
      <span className="admin-badge admin-badge--info">
        {qty} unidades
      </span>
    );
  };

  /**
   * Devuelve el JSX del chip de estado operativo.
   * Si el stock es 0 → "Sin Stock" en rojo aunque el producto esté activo en BD.
   * Si stock bajo   → "Stock Bajo" en naranja.
   * Normal          → "Activo" en verde.
   */
  const renderEstadoChip = (producto) => {
    const qty = Number(producto?.stock ?? 0);
    if (qty === 0) {
      return (
        <span className="admin-chip admin-chip--danger">
          Sin Stock
        </span>
      );
    }
    if (qty <= 5) {
      return (
        <span className="admin-chip admin-chip--warning">
          Stock Bajo
        </span>
      );
    }
    return (
      <span className="admin-chip admin-chip--success">
        Activo
      </span>
    );
  };

  // CARDS CONFIG
  const cards = [
    {
      title: "Usuarios Activos",
      value: totalUsuariosActivos,
      icon: "people",
      accent: "#2196F3",
      accentLight: "rgba(33,150,243,0.08)",
    },
    {
      title: "Productos Activos",
      value: totalProductosActivos,
      icon: "inventory_2",
      accent: "#d4af37",
      accentLight: "rgba(212,175,55,0.08)",
    },
    {
      title: "Facturas Activas",
      value: totalFacturasActivas,
      icon: "receipt_long",
      accent: "#4CAF50",
      accentLight: "rgba(76,175,80,0.08)",
    },
  ];

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="admin-loading">
        <div style={{ textAlign: "center" }}>
          <div className="preloader-wrapper big active">
            <div className="spinner-layer" style={{ borderColor: "#d4af37" }}>
              <div className="circle-clipper left">
                <div className="circle"></div>
              </div>
              <div className="gap-patch">
                <div className="circle"></div>
              </div>
              <div className="circle-clipper right">
                <div className="circle"></div>
              </div>
            </div>
          </div>
          <h4 style={{ marginTop: "28px" }}>Cargando dashboard...</h4>
        </div>
      </div>
    );
  }

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="admin-dashboard">
      <AdminNavbar />

      <div className="container admin-container">

        {/* HEADER */}
        <div className="admin-hero">
          <div className="admin-hero__icon">
            <i className="material-icons" style={{ fontSize: "36px", color: "#d4af37" }}>
              analytics
            </i>
          </div>
          <div>
            <h4 className="admin-hero__title">Dashboard Administrativo</h4>
            <p className="admin-hero__subtitle">
              Monitoreo en tiempo real — usuarios, inventario y facturación.
            </p>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="row">
          {cards.map((card, i) => (
            <div key={i} className="col s12 m4">
              <div className="dashboard-card" style={{ "--card-accent": card.accent, "--card-accent-light": card.accentLight }}>
                <div className="card-content dashboard-card__content">
                  <div className="dashboard-card-top">
                    <div>
                      <h3 className="dashboard-card__value">{card.value}</h3>
                      <p className="dashboard-card__label">{card.title}</p>
                    </div>
                    <div className="dashboard-card__icon-wrap">
                      <i className="material-icons dashboard-icon">{card.icon}</i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ANALYTICS */}
        <div className="row">
          {/* CHART */}
          <div className="col s12 l8">
            <div className="admin-card">
              <div className="card-content">
                <span className="card-title">
                  <i className="material-icons left" style={{ color: "#d4af37" }}>
                    trending_up
                  </i>
                  Tendencia de usuarios activos
                </span>
                <div className="chart-container">
                  <canvas ref={salesChartRef} />
                </div>
              </div>
            </div>
          </div>

          {/* ACCESOS RÁPIDOS */}
          <div className="col s12 l4">
            <div className="admin-card">
              <div className="card-content">
                <span className="card-title">
                  <i className="material-icons left" style={{ color: "#d4af37" }}>
                    bolt
                  </i>
                  Accesos rápidos
                </span>
                <div className="quick-buttons">
                  <button
                    className="quick-access-btn"
                    onClick={() => navigate("/admin/usuarios")}
                  >
                    <i className="material-icons left">people</i>
                    Módulo de usuarios
                  </button>
                  <button
                    className="quick-access-btn"
                    onClick={() => navigate("/admin/productos")}
                  >
                    <i className="material-icons left">inventory_2</i>
                    Control de productos
                  </button>
                  <button
                    className="quick-access-btn"
                    onClick={() => navigate("/admin/facturas")}
                  >
                    <i className="material-icons left">receipt_long</i>
                    Registro de facturas
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TABLA PRODUCTOS */}
        <div className="row">
          <div className="col s12">
            <div className="admin-card">
              <div className="card-content">
                <span className="card-title">
                  <i className="material-icons left" style={{ color: "#d4af37" }}>
                    shopping_bag
                  </i>
                  Stock de productos activos
                </span>

                <table className="highlight responsive-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Precio unitario</th>
                      <th>Existencias</th>
                      <th>Estado operativo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosActivosLista.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="center-align grey-text">
                          No existen productos activos registrados actualmente.
                        </td>
                      </tr>
                    ) : (
                      productosActivosLista.map((producto, index) => {
                        const sinStock = Number(producto?.stock ?? 0) === 0;
                        return (
                          <tr
                            key={producto._id || index}
                            className={sinStock ? "admin-table-row--agotado" : ""}
                          >
                            <td className="fw-medium">
                              {sinStock && (
                                <i
                                  className="material-icons"
                                  title="Sin stock disponible"
                                  style={{
                                    fontSize: "16px",
                                    verticalAlign: "middle",
                                    marginRight: "6px",
                                    color: "#c62828",
                                  }}
                                >
                                  warning
                                </i>
                              )}
                              {producto?.nombre || "Sin nombre"}
                            </td>
                            <td>
                              $
                              {Number(producto?.precio || 0).toLocaleString("es-CO", {
                                minimumFractionDigits: 0,
                              })}
                            </td>
                            <td>{renderStockBadge(producto?.stock)}</td>
                            <td>{renderEstadoChip(producto)}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>

                {/* LEYENDA */}
                <div className="admin-table-legend">
                  <span className="admin-chip admin-chip--success" style={{ fontSize: "0.78rem" }}>Activo</span>
                  <span style={{ fontSize: "0.82rem", color: "#555" }}>Stock disponible</span>
                  <span className="admin-chip admin-chip--warning" style={{ fontSize: "0.78rem", marginLeft: "12px" }}>Stock Bajo</span>
                  <span style={{ fontSize: "0.82rem", color: "#555" }}>≤ 5 unidades</span>
                  <span className="admin-chip admin-chip--danger" style={{ fontSize: "0.78rem", marginLeft: "12px" }}>Sin Stock</span>
                  <span style={{ fontSize: "0.82rem", color: "#555" }}>0 unidades — no disponible para venta</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}