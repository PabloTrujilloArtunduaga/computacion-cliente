import {
  useEffect,
  useRef,
  useState,
  useMemo
} from "react";

import Chart from "chart.js/auto";

import {
  useNavigate
} from "react-router-dom";

import M from "materialize-css";

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
  // NAVIGATION
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

  // GRAFICA USUARIOS ACTIVOS
  const [
    usuariosActivosGrafica,
    setUsuariosActivosGrafica
  ] = useState([]);

  // PRODUCTOS DE LA TIENDA
  const [
    productosTienda,
    setProductosTienda
  ] = useState([]);

  // =========================================
  // INIT MATERIALIZE
  // =========================================

  useEffect(() => {

    M.AutoInit();

  }, []);

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

          setLoading(true);

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
          // DEBUG RESPUESTAS
          // =====================================

          console.log(
            "🟡 RESPUESTA USUARIOS:",
            usuariosRes
          );

          console.log(
            "🟡 RESPUESTA PRODUCTOS:",
            productosRes
          );

          console.log(
            "🟡 RESPUESTA FACTURAS:",
            facturasRes
          );

          // =====================================
          // NORMALIZAR DATOS
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

          // =====================================
          // DEBUGS
          // =====================================

          console.log(
            "✅ USUARIOS NORMALIZADOS:",
            usuariosData
          );

          console.log(
            "✅ PRODUCTOS NORMALIZADOS:",
            productosData
          );

          console.log(
            "✅ FACTURAS NORMALIZADAS:",
            facturasData
          );

          // =====================================
          // SET STATES
          // =====================================

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
          // USUARIOS ACTIVOS
          // =====================================

          const usuariosActivos =
            usuariosData.filter(
              (usuario) => {

                console.log(
                  "👤 VALIDANDO USUARIO:",
                  usuario
                );

                return (
                  usuario?.estado === true
                );

              }
            );

          console.log(
            "✅ USUARIOS ACTIVOS:",
            usuariosActivos
          );

          // =====================================
          // GRAFICA USUARIOS ACTIVOS
          // =====================================

          const agrupados =
            {};

          usuariosActivos.forEach(
            (usuario) => {

              try {

                const fecha =
                  usuario?.createdAt
                    ? new Date(
                        usuario.createdAt
                      )
                    : null;

                if (!fecha) {

                  console.warn(
                    "⚠️ USUARIO SIN FECHA:",
                    usuario
                  );

                  return;
                }

                const mes =
                  fecha.toLocaleString(
                    "es-CO",
                    {
                      month: "short"
                    }
                  );

                agrupados[mes] =
                  (
                    agrupados[
                      mes
                    ] || 0
                  ) + 1;

              } catch (error) {

                console.error(
                  "❌ ERROR GRAFICA USUARIOS:",
                  error
                );

              }

            }
          );

          const usuariosGrafica =
            Object.entries(
              agrupados
            ).map(
              ([mes, total]) => ({

                mes,

                total

              })
            );

          console.log(
            "📊 DATOS GRAFICA:",
            usuariosGrafica
          );

          setUsuariosActivosGrafica(
            usuariosGrafica
          );

          // =====================================
          // PRODUCTOS TIENDA
          // SOLO ACTIVOS
          // =====================================

          const productosActivos =
            productosData.filter(
              (producto) => {

                console.log(
                  "📦 VALIDANDO PRODUCTO:",
                  producto
                );

                return (
                  producto?.estado === true
                );

              }
            );

          console.log(
            "✅ PRODUCTOS ACTIVOS:",
            productosActivos
          );

          setProductosTienda(
            productosActivos
          );

        } catch (error) {

          console.error(
            "❌ ERROR GENERAL DASHBOARD:",
            error
          );

          setUsuarios([]);
          setProductos([]);
          setFacturas([]);
          setUsuariosActivosGrafica([]);
          setProductosTienda([]);

          M.toast({
            html:
              "❌ Error cargando dashboard",
            classes:
              "red rounded"
          });

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
      usuariosActivosGrafica.length === 0
    ) {

      console.warn(
        "⚠️ NO HAY DATOS PARA LA GRAFICA"
      );

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

            type: "bar",

            data: {

              labels:
                usuariosActivosGrafica.map(
                  (item) => item.mes
                ),

              datasets: [

                {

                  label:
                    "Usuarios Activos",

                  data:
                    usuariosActivosGrafica.map(
                      (item) => item.total
                    ),

                  borderRadius: 12,

                  borderWidth: 1,

                  backgroundColor: [
                    "#64B5F6",
                    "#81C784",
                    "#FFB74D",
                    "#BA68C8",
                    "#4DD0E1",
                    "#AED581",
                    "#FFD54F"
                  ]

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
                      "#555",

                    font: {

                      size: 14

                    }

                  }

                }

              },

              scales: {

                x: {

                  ticks: {

                    color:
                      "#666"

                  },

                  grid: {

                    color:
                      "#eeeeee"

                  }

                },

                y: {

                  beginAtZero: true,

                  ticks: {

                    color:
                      "#666"

                  },

                  grid: {

                    color:
                      "#eeeeee"

                  }

                }

              }

            }

          }
        );

    } catch (error) {

      console.error(
        "❌ ERROR CREANDO GRAFICA:",
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

  }, [usuariosActivosGrafica]);

  // =========================================
  // MEMOS
  // =========================================

  const usuariosActivos =
    useMemo(
      () =>
        usuarios.filter(
          (u) =>
            u?.estado === true
        ).length,
      [usuarios]
    );

  const productosActivos =
    useMemo(
      () =>
        productos.filter(
          (p) =>
            p?.estado === true
        ).length,
      [productos]
    );

  const facturasActivas =
    useMemo(
      () =>
        facturas.filter(
          (f) =>
            f?.estado !==
            "cancelada"
        ).length,
      [facturas]
    );

  // =========================================
  // CARDS
  // =========================================

  const cards = [

    {

      title:
        "Usuarios Activos",

      value:
        usuariosActivos,

      icon:
        "people",

      bg:
        "#E3F2FD",

      iconColor:
        "#1E88E5"

    },

    {

      title:
        "Productos Activos",

      value:
        productosActivos,

      icon:
        "inventory_2",

      bg:
        "#E8F5E9",

      iconColor:
        "#43A047"

    },

    {

      title:
        "Facturas Activas",

      value:
        facturasActivas,

      icon:
        "receipt_long",

      bg:
        "#FFF3E0",

      iconColor:
        "#FB8C00"

    }

  ];

  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <div
        className="
          valign-wrapper
          center-align
        "
        style={{
          height: "100vh",
          justifyContent: "center",
          flexDirection: "column",
          gap: 20,
        }}
      >

        <div
          className="
            preloader-wrapper
            big
            active
          "
        >

          <div className="spinner-layer spinner-blue-only">

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

        <h5
          style={{
            color: "#555",
            fontWeight: 600,
          }}
        >
          Cargando dashboard...
        </h5>

      </div>

    );

  }

  // =========================================
  // RENDER
  // =========================================

  return (

    <div
      className="admin-dashboard"
      style={{
        background:
          "#f5f7fb",
        minHeight: "100vh",
      }}
    >

      <AdminNavbar />

      <div
        className="container"
        style={{
          paddingTop: 30,
          paddingBottom: 40,
        }}
      >

        {/* HEADER */}

        <div
          className="card-panel"
          style={{
            borderRadius: 24,
            background:
              "linear-gradient(135deg,#42A5F5,#64B5F6)",
            color: "#fff",
            padding: 30,
            marginBottom: 30,
          }}
        >

          <h4
            style={{
              fontWeight: 800,
              marginTop: 0,
            }}
          >
            📊 Dashboard Administrativo
          </h4>

          <p
            style={{
              marginBottom: 0,
              opacity: 0.95,
              fontSize: 16,
            }}
          >
            Gestión visual de usuarios,
            productos y facturas.
          </p>

        </div>

        {/* CARDS */}

        <div className="row">

          {cards.map(
            (card, index) => (

              <div
                key={index}
                className="col s12 m6 l4"
              >

                <div
                  className="card"
                  style={{
                    borderRadius: 24,
                    background:
                      card.bg,
                    boxShadow:
                      "0 4px 18px rgba(0,0,0,0.06)",
                  }}
                >

                  <div
                    className="card-content"
                    style={{
                      padding: 28,
                    }}
                  >

                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                      }}
                    >

                      <div>

                        <h3
                          style={{
                            margin: 0,
                            fontWeight: 800,
                            color: "#333",
                          }}
                        >
                          {
                            card.value
                          }
                        </h3>

                        <p
                          style={{
                            marginTop: 8,
                            color: "#666",
                            fontWeight: 500,
                          }}
                        >
                          {
                            card.title
                          }
                        </p>

                      </div>

                      <div
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius:
                            "50%",
                          background:
                            "#fff",
                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                        }}
                      >

                        <i
                          className="material-icons"
                          style={{
                            fontSize: 38,
                            color:
                              card.iconColor,
                          }}
                        >
                          {
                            card.icon
                          }
                        </i>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

        {/* GRAFICA + BOTONES */}

        <div className="row">

          {/* GRAFICA */}

          <div className="col s12 l8">

            <div
              className="card"
              style={{
                borderRadius: 24,
                boxShadow:
                  "0 4px 18px rgba(0,0,0,0.05)",
              }}
            >

              <div className="card-content">

                <span
                  className="card-title"
                  style={{
                    fontWeight: 700,
                    color: "#444",
                  }}
                >
                  👥 Usuarios Activos Registrados
                </span>

                <div
                  style={{
                    height: 350,
                    marginTop: 20,
                  }}
                >

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

            <div
              className="card"
              style={{
                borderRadius: 24,
                boxShadow:
                  "0 4px 18px rgba(0,0,0,0.05)",
              }}
            >

              <div className="card-content">

                <span
                  className="card-title"
                  style={{
                    fontWeight: 700,
                    color: "#444",
                  }}
                >
                  Accesos Rápidos
                </span>

                <div
                  style={{
                    display: "flex",
                    flexDirection:
                      "column",
                    gap: 15,
                    marginTop: 25,
                  }}
                >

                  <button
                    className="
                      btn-large
                      waves-effect
                      waves-light
                    "
                    style={{
                      borderRadius: 14,
                      background:
                        "#42A5F5",
                    }}
                    onClick={() =>
                      navigate(
                        "/admin/usuarios"
                      )
                    }
                  >

                    <i className="material-icons left">
                      people
                    </i>

                    Usuarios y empleados

                  </button>

                  <button
                    className="
                      btn-large
                      waves-effect
                      waves-light
                    "
                    style={{
                      borderRadius: 14,
                      background:
                        "#66BB6A",
                    }}
                    onClick={() =>
                      navigate(
                        "/admin/productos"
                      )
                    }
                  >

                    <i className="material-icons left">
                      inventory_2
                    </i>

                    Productos y categorias

                  </button>

                  <button
                    className="
                      btn-large
                      waves-effect
                      waves-light
                    "
                    style={{
                      borderRadius: 14,
                      background:
                        "#FFA726",
                    }}
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

        {/* PRODUCTOS TIENDA */}

        <div className="row">

          <div className="col s12">

            <div
              className="card"
              style={{
                borderRadius: 24,
                boxShadow:
                  "0 4px 18px rgba(0,0,0,0.05)",
              }}
            >

              <div className="card-content">

                <span
                  className="card-title"
                  style={{
                    fontWeight: 700,
                    color: "#444",
                  }}
                >
                  🔥 Productos de la Tienda
                </span>

                <table
                  className="
                    highlight
                    responsive-table
                  "
                >

                  <thead>

                    <tr>

                      <th>
                        Producto
                      </th>

                      <th>
                        Precio
                      </th>

                      <th>
                        Stock
                      </th>

                      <th>
                        Estado
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {
                      productosTienda.length === 0
                        ? (

                          <tr>

                            <td
                              colSpan="4"
                              className="center"
                            >
                              No hay productos activos
                            </td>

                          </tr>

                        )
                        : (

                          productosTienda.map(
                            (
                              producto,
                              index
                            ) => {

                              console.log(
                                "📦 RENDER PRODUCTO:",
                                producto
                              );

                              return (

                                <tr
                                  key={
                                    producto._id ||
                                    index
                                  }
                                >

                                  <td>
                                    {
                                      producto?.nombre ||
                                      "Sin nombre"
                                    }
                                  </td>

                                  <td>
                                    $
                                    {
                                      Number(
                                        producto?.precio || 0
                                      ).toLocaleString(
                                        "es-CO"
                                      )
                                    }
                                  </td>

                                  <td>
                                    {
                                      producto?.stock || 0
                                    }
                                  </td>

                                  <td>

                                    <span
                                      className="
                                        new
                                        badge
                                        green
                                      "
                                      data-badge-caption=""
                                    >
                                      Activo
                                    </span>

                                  </td>

                                </tr>

                              );

                            }
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