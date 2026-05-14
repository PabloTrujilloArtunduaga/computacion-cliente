import {
  useEffect,
  useRef,
  useState
} from "react";

import Chart from "chart.js/auto";

import {
  useNavigate
} from "react-router-dom";

import AdminNavbar from "../admin/AdminNavbar";

import {
  getUsuarios,
  getProductos,
  getFacturas
} from "../../api/admin";

import "../../styles/admin.css";

export default function AdminDashboardMaterialize() {

  // =========================================
  // REFS
  // =========================================

  const salesChartRef =
    useRef(null);

  const chartInstance =
    useRef(null);

  // =========================================
  // NAVIGATE
  // =========================================

  const navigate =
    useNavigate();

  // =========================================
  // STATES
  // =========================================

  const [loading, setLoading] =
    useState(true);

  const [usuarios, setUsuarios] =
    useState([]);

  const [productos, setProductos] =
    useState([]);

  const [facturas, setFacturas] =
    useState([]);

  const [ventasMes, setVentasMes] =
    useState([]);

  const [
    productosMasVendidos,
    setProductosMasVendidos
  ] = useState([]);

  // =========================================
  // LOAD DATA
  // =========================================

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    if (!token) {

      console.error(
        "❌ TOKEN NO ENCONTRADO"
      );

      navigate("/login");

      return;

    }

    const fetchData =
      async () => {

        try {

          console.log(
            "📡 CARGANDO DASHBOARD..."
          );

          const [

            usuariosRes,

            productosRes,

            facturasRes

          ] = await Promise.all([

            getUsuarios(),

            getProductos(),

            getFacturas()

          ]);

          // =====================================
          // NORMALIZAR RESPUESTAS
          // =====================================

          const usuariosData =
            Array.isArray(
              usuariosRes
            )
              ? usuariosRes
              : usuariosRes?.usuarios || [];

          const productosData =
            Array.isArray(
              productosRes
            )
              ? productosRes
              : productosRes?.productos || [];

          const facturasData =
            Array.isArray(
              facturasRes
            )
              ? facturasRes
              : facturasRes?.facturas || [];

          console.log(
            "✅ USUARIOS:",
            usuariosData
          );

          console.log(
            "✅ PRODUCTOS:",
            productosData
          );

          console.log(
            "✅ FACTURAS:",
            facturasData
          );

          setUsuarios(
            usuariosData
          );

          setProductos(
            productosData
          );

          setFacturas(
            facturasData
          );

          // =====================================
          // VENTAS POR MES
          // =====================================

          const ventasAgrupadas =
            {};

          facturasData.forEach(
            (factura) => {

              try {

                const fecha =
                  factura?.createdAt
                    ? new Date(
                        factura.createdAt
                      )
                    : null;

                if (!fecha) return;

                const mes =
                  fecha.toLocaleString(
                    "es-CO",
                    {
                      month: "short"
                    }
                  );

                ventasAgrupadas[
                  mes
                ] =
                  (
                    ventasAgrupadas[
                      mes
                    ] || 0
                  ) +
                  Number(
                    factura?.total || 0
                  );

              } catch (error) {

                console.error(
                  "❌ ERROR FACTURA:",
                  error
                );

              }

            }
          );

          const ventasFormateadas =
            Object.entries(
              ventasAgrupadas
            ).map(
              ([mes, total]) => ({

                mes,

                total

              })
            );

          setVentasMes(
            ventasFormateadas
          );

          // =====================================
          // PRODUCTOS MÁS VENDIDOS
          // =====================================

          const contadorProductos =
            {};

          facturasData.forEach(
            (factura) => {

              factura?.productos?.forEach(
                (prod) => {

                  try {

                    const nombre =
                      prod?.nombre ||
                      prod?.producto_id
                        ?.nombre ||
                      "Sin nombre";

                    if (
                      !contadorProductos[
                        nombre
                      ]
                    ) {

                      contadorProductos[
                        nombre
                      ] = {

                        nombre,

                        ventas: 0,

                        stock:
                          prod
                            ?.producto_id
                            ?.stock || 0

                      };

                    }

                    contadorProductos[
                      nombre
                    ].ventas +=
                      Number(
                        prod?.cantidad || 0
                      );

                  } catch (error) {

                    console.error(
                      "❌ ERROR PRODUCTO:",
                      error
                    );

                  }

                }
              );

            }
          );

          const topProductos =
            Object.values(
              contadorProductos
            )

              .sort(
                (a, b) =>
                  b.ventas -
                  a.ventas
              )

              .slice(0, 10);

          setProductosMasVendidos(
            topProductos
          );

        } catch (error) {

          console.error(
            "❌ ERROR GENERAL:",
            error
          );

          setUsuarios([]);
          setProductos([]);
          setFacturas([]);
          setVentasMes([]);
          setProductosMasVendidos([]);

        } finally {

          setLoading(false);

        }

      };

    fetchData();

  }, [navigate]);

  // =========================================
  // CHART
  // =========================================

  useEffect(() => {

    if (
      !salesChartRef.current ||
      ventasMes.length === 0
    ) {

      return;

    }

    try {

      if (
        chartInstance.current
      ) {

        chartInstance.current.destroy();

      }

      chartInstance.current =
        new Chart(
          salesChartRef.current,
          {

            type: "line",

            data: {

              labels:
                ventasMes.map(
                  (v) => v.mes
                ),

              datasets: [

                {

                  label:
                    "Ventas",

                  data:
                    ventasMes.map(
                      (v) => v.total
                    ),

                  borderWidth: 3,

                  tension: 0.4,

                  fill: true,

                  backgroundColor:
                    "rgba(212,175,55,0.15)",

                  borderColor:
                    "#d4af37",

                  pointBackgroundColor:
                    "#d4af37"

                }

              ]

            },

            options: {

              responsive: true,

              maintainAspectRatio: false,

              plugins: {

                legend: {

                  labels: {

                    color:
                      "#333"

                  }

                }

              },

              scales: {

                x: {

                  ticks: {

                    color:
                      "#555"

                  },

                  grid: {

                    color:
                      "#ececec"

                  }

                },

                y: {

                  ticks: {

                    color:
                      "#555"

                  },

                  grid: {

                    color:
                      "#ececec"

                  }

                }

              }

            }

          }
        );

    } catch (error) {

      console.error(
        "❌ ERROR GRAFICA:",
        error
      );

    }

    return () => {

      if (
        chartInstance.current
      ) {

        chartInstance.current.destroy();

      }

    };

  }, [ventasMes]);

  // =========================================
  // CARDS
  // =========================================

  const cards = [

    {

      title:
        "Usuarios",

      value:
        usuarios.length,

      icon:
        "people",

      color:
        "linear-gradient(135deg,#d4af37,#f4d76a)"

    },

    {

      title:
        "Productos",

      value:
        productos.length,

      icon:
        "inventory_2",

      color:
        "linear-gradient(135deg,#ffffff,#f5f5f5)"

    },

    {

      title:
        "Facturas",

      value:
        facturas.length,

      icon:
        "receipt_long",

      color:
        "linear-gradient(135deg,#111111,#2a2a2a)"

    }

  ];

  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <div className="admin-loading">

        <h4>
          Cargando dashboard...
        </h4>

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

        {/* CARDS */}

        <div className="row">

          {cards.map(
            (card, index) => (

              <div
                key={index}
                className="col s12 m6 l4"
              >

                <div
                  className="card dashboard-card"
                  style={{
                    background:
                      card.color
                  }}
                >

                  <div className="card-content">

                    <div className="dashboard-card-top">

                      <div>

                        <h3>
                          {card.value}
                        </h3>

                        <p>
                          {card.title}
                        </p>

                      </div>

                      <i className="material-icons dashboard-icon">
                        {card.icon}
                      </i>

                    </div>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

        {/* GRAFICA */}

        <div className="row">

          <div className="col s12 l8">

            <div className="card admin-card">

              <div className="card-content">

                <span className="card-title">
                  📈 Resumen de Ventas
                </span>

                <div className="chart-container">

                  <canvas
                    ref={
                      salesChartRef
                    }
                  />

                </div>

              </div>

            </div>

          </div>

          {/* ACCESOS */}

          <div className="col s12 l4">

            <div className="card admin-card">

              <div className="card-content">

                <span className="card-title">
                  ⚡ Accesos Rápidos
                </span>

                <div className="quick-buttons">

                  <button
                    className="quick-access-btn"
                    onClick={() =>
                      navigate(
                        "/admin/usuarios"
                      )
                    }
                  >

                    <i className="material-icons left">
                      people
                    </i>

                    Usuarios

                  </button>

                  <button
                    className="quick-access-btn"
                    onClick={() =>
                      navigate(
                        "/admin/productos"
                      )
                    }
                  >

                    <i className="material-icons left">
                      inventory_2
                    </i>

                    Productos

                  </button>

                  <button
                    className="quick-access-btn"
                    onClick={() =>
                      navigate(
                        "/admin/facturas"
                      )
                    }
                  >

                    <i className="material-icons left">
                      receipt_long
                    </i>

                    Facturas

                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* TABLA */}

        <div className="row">

          <div className="col s12">

            <div className="card admin-card">

              <div className="card-content">

                <span className="card-title">
                  🔥 Productos Más Vendidos
                </span>

                <table className="highlight responsive-table">

                  <thead>

                    <tr>

                      <th>
                        Producto
                      </th>

                      <th>
                        Ventas
                      </th>

                      <th>
                        Stock
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {
                      productosMasVendidos.length === 0
                        ? (

                          <tr>

                            <td
                              colSpan="3"
                              className="center"
                            >
                              No hay datos
                            </td>

                          </tr>

                        )
                        : (

                          productosMasVendidos.map(
                            (
                              prod,
                              index
                            ) => (

                              <tr
                                key={index}
                              >

                                <td>
                                  {
                                    prod.nombre
                                  }
                                </td>

                                <td>
                                  {
                                    prod.ventas
                                  }
                                </td>

                                <td>
                                  {
                                    prod.stock
                                  }
                                </td>

                              </tr>

                            )
                          )

                        )
                    }

                  </tbody>

                </table>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}