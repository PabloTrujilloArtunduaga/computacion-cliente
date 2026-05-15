import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import M from "materialize-css";

import AdminNavbar from "../admin/AdminNavbar";

import { API } from "../../constants/api";

import { fetchConToken } from "../../utils/api";

import "../../styles/FacturasPage.css";

export default function FacturasPage() {

  /*
    =====================================
    STATES
    =====================================
  */

  const [facturas, setFacturas] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [busqueda, setBusqueda] =
    useState("");

  const [filtroEstado, setFiltroEstado] =
    useState("todos");

  const [
    facturaSeleccionada,
    setFacturaSeleccionada
  ] = useState(null);

  /*
    =====================================
    INIT MATERIALIZE
    =====================================
  */

  useEffect(() => {

    const selects =
      document.querySelectorAll("select");

    M.FormSelect.init(selects);

  }, [filtroEstado]);

  /*
    =====================================
    FETCH FACTURAS
    =====================================
  */

  useEffect(() => {

    const fetchFacturas =
      async () => {

        try {

          setLoading(true);

          const res =
            await fetchConToken(
              `${API}/facturas`
            );

          const data =
            await res.json();

          if (!res.ok) {

            throw new Error(
              data?.message ||
              "Error obteniendo facturas"
            );
          }

          let facturasArray = [];

          if (
            Array.isArray(data)
          ) {

            facturasArray = data;

          } else if (
            Array.isArray(
              data?.facturas
            )
          ) {

            facturasArray =
              data.facturas;

          } else if (
            Array.isArray(
              data?.data
            )
          ) {

            facturasArray =
              data.data;
          }

          setFacturas(
            facturasArray
          );

        } catch (error) {

          console.error(
            "ERROR FACTURAS:",
            error
          );

          setFacturas([]);

          M.toast({
            html:
              "❌ Error cargando facturas",
            classes:
              "red darken-2 rounded"
          });

        } finally {

          setLoading(false);
        }
      };

    fetchFacturas();

  }, []);

  /*
    =====================================
    HELPERS
    =====================================
  */

  const normalizarEstado =
    (estado = "") =>
      String(estado)
        .toLowerCase()
        .trim();

  const formatMoney =
    (value) =>
      `$${Number(
        value || 0
      ).toLocaleString(
        "es-CO"
      )}`;

  const formatDate =
    (date) => {

      if (!date)
        return "—";

      const fecha =
        new Date(date);

      if (
        isNaN(
          fecha.getTime()
        )
      ) {
        return "—";
      }

      return fecha.toLocaleDateString(
        "es-CO",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
    };

  /*
    =====================================
    FILTRAR FACTURAS
    =====================================
  */

  const facturasFiltradas =
    useMemo(() => {

      return facturas.filter(
        (factura) => {

          const numero =
            factura?._id
              ?.slice(-6)
              ?.toUpperCase() || "";

          const cliente =
            factura?.cliente_id
              ?.nombre || "";

          const empleado =
            factura?.empleado_id
              ?.usuario_id
              ?.nombre || "";

          const estado =
            normalizarEstado(
              factura?.estado
            );

          const textoBusqueda =
            busqueda
              .toLowerCase()
              .trim();

          const coincideBusqueda =

            numero.includes(
              busqueda.toUpperCase()
            ) ||

            cliente
              .toLowerCase()
              .includes(
                textoBusqueda
              ) ||

            empleado
              .toLowerCase()
              .includes(
                textoBusqueda
              );

          const coincideEstado =
            filtroEstado ===
            "todos"
              ? true
              : estado ===
                filtroEstado;

          return (
            coincideBusqueda &&
            coincideEstado
          );
        }
      );

    }, [
      facturas,
      busqueda,
      filtroEstado
    ]);

  /*
    =====================================
    ESTADISTICAS
    =====================================
  */

  const totalFacturas =
    facturas.length;

  const pagadas =
    facturas.filter(
      (f) =>
        normalizarEstado(
          f.estado
        ) === "pagada"
    ).length;

  const pendientes =
    facturas.filter(
      (f) =>
        normalizarEstado(
          f.estado
        ) === "pendiente"
    ).length;

  const canceladas =
    facturas.filter(
      (f) =>
        normalizarEstado(
          f.estado
        ) === "cancelada"
    ).length;

const totalVentas =
  facturas.reduce(
    (
      acc,
      factura
    ) => {

      const estado =
        normalizarEstado(
          factura.estado
        );

      /*
        NO SUMAR
        FACTURAS CANCELADAS
      */

      if (
        estado === "cancelada"
      ) {
        return acc;
      }

      return (
        acc +
        Number(
          factura.total || 0
        )
      );

    },
    0
  );

  /*
    =====================================
    COLOR ESTADO
    =====================================
  */

  const getEstadoColor =
    (estado) => {

      switch (
        normalizarEstado(
          estado
        )
      ) {

        case "pagada":
          return "green";

        case "pendiente":
          return "orange";

        case "cancelada":
          return "red";

        default:
          return "grey";
      }
    };

  /*
    =====================================
    MODAL
    =====================================
  */

  const cerrarModal =
    () =>
      setFacturaSeleccionada(
        null
      );

  /*
    =====================================
    VIEW
    =====================================
  */

  return (

    <div className="facturas-page">

      <AdminNavbar />

      <div className="container facturas-container">

        {/* =====================================
            HEADER
        ===================================== */}

        <div
          className="
            card-panel
            facturas-header
            z-depth-1
          "
          style={{
            borderRadius: 22,
            padding: "32px",
            background:
              "linear-gradient(135deg, #1565C0 0%, #283593 100%)",
            color: "#fff",
            marginTop: 25,
          }}
        >

          <div className="row valign-wrapper no-margin">

            <div className="col s12">

              <h4
                className="facturas-title"
                style={{
                  fontWeight: 800,
                  marginBottom: 10,
                }}
              >
                🧾 Gestión de Facturas
              </h4>

              <p
                className="facturas-subtitle"
                style={{
                  margin: 0,
                  opacity: 0.92,
                  fontSize: 16,
                }}
              >
                Consulta detalladamente
                todas las facturas
                registradas por clientes
                y empleados del sistema.
              </p>

            </div>

          </div>

        </div>

        {/* =====================================
            CARDS
        ===================================== */}

        <div className="row">

          {/* TOTAL */}

          <div className="col s12 m6 l3">

            <div
              className="
                card
                facturas-stat-card
                white-text
              "
              style={{
                borderRadius: 20,
                overflow: "hidden",
                background:
                  "linear-gradient(135deg, #2196F3 0%, #1565C0 100%)",
              }}
            >

              <div
                className="
                  card-content
                  center-align
                "
              >

                <i
                  className="
                    material-icons
                    stat-icon
                  "
                  style={{
                    fontSize: 55,
                    marginBottom: 10,
                  }}
                >
                  receipt_long
                </i>

                <h4>
                  {
                    loading
                      ? "-"
                      : totalFacturas
                  }
                </h4>

                <p>
                  Total Facturas
                </p>

              </div>

            </div>

          </div>

          {/* PAGADAS */}

          <div className="col s12 m6 l3">

            <div
              className="
                card
                facturas-stat-card
                white-text
              "
              style={{
                borderRadius: 20,
                overflow: "hidden",
                background:
                  "linear-gradient(135deg, #43A047 0%, #2E7D32 100%)",
              }}
            >

              <div
                className="
                  card-content
                  center-align
                "
              >

                <i
                  className="
                    material-icons
                    stat-icon
                  "
                  style={{
                    fontSize: 55,
                    marginBottom: 10,
                  }}
                >
                  paid
                </i>

                <h4>
                  {
                    loading
                      ? "-"
                      : pagadas
                  }
                </h4>

                <p>
                  Pagadas
                </p>

              </div>

            </div>

          </div>

          {/* PENDIENTES */}

          <div className="col s12 m6 l3">

            <div
              className="
                card
                facturas-stat-card
                white-text
              "
              style={{
                borderRadius: 20,
                overflow: "hidden",
                background:
                  "linear-gradient(135deg, #FB8C00 0%, #EF6C00 100%)",
              }}
            >

              <div
                className="
                  card-content
                  center-align
                "
              >

                <i
                  className="
                    material-icons
                    stat-icon
                  "
                  style={{
                    fontSize: 55,
                    marginBottom: 10,
                  }}
                >
                  schedule
                </i>

                <h4>
                  {
                    loading
                      ? "-"
                      : pendientes
                  }
                </h4>

                <p>
                  Pendientes
                </p>

              </div>

            </div>

          </div>

          {/* VENTAS */}

          <div className="col s12 m6 l3">

            <div
              className="
                card
                facturas-stat-card
                white-text
              "
              style={{
                borderRadius: 20,
                overflow: "hidden",
                background:
                  "linear-gradient(135deg, #8E24AA 0%, #5E35B1 100%)",
              }}
            >

              <div
                className="
                  card-content
                  center-align
                "
              >

                <i
                  className="
                    material-icons
                    stat-icon
                  "
                  style={{
                    fontSize: 55,
                    marginBottom: 10,
                  }}
                >
                  attach_money
                </i>

                <h5
                  style={{
                    fontWeight: 700,
                  }}
                >
                  {
                    loading
                      ? "-"
                      : formatMoney(
                          totalVentas
                        )
                  }
                </h5>

                <p>
                  Ventas Totales
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =====================================
            TABLA
        ===================================== */}

        <div
          className="
            card
            facturas-table-card
          "
          style={{
            borderRadius: 22,
            overflow: "hidden",
          }}
        >

          <div
            className="card-content"
            style={{
              padding: 28,
            }}
          >

            {/* FILTROS */}

            <div className="row facturas-filters">

              {/* BUSQUEDA */}

              <div className="col s12 m8">

                <div className="input-field">

                  <i
                    className="
                      material-icons
                      prefix
                    "
                  >
                    search
                  </i>

                  <input
                    id="busqueda"
                    type="text"
                    value={busqueda}
                    onChange={(e) =>
                      setBusqueda(
                        e.target.value
                      )
                    }
                  />

                  <label
                    htmlFor="busqueda"
                    className="active"
                  >
                    Buscar factura,
                    cliente o empleado
                  </label>

                </div>

              </div>

              {/* FILTRO */}

              <div className="col s12 m4">

                <div className="input-field">

                  <select
                    value={
                      filtroEstado
                    }
                    onChange={(e) =>
                      setFiltroEstado(
                        e.target.value
                      )
                    }
                  >

                    <option value="todos">
                      Todos
                    </option>

                    <option value="pagada">
                      Pagadas
                    </option>

                    <option value="pendiente">
                      Pendientes
                    </option>

                    <option value="cancelada">
                      Canceladas
                    </option>

                  </select>

                  <label>
                    Filtrar Estado
                  </label>

                </div>

              </div>

            </div>

            {/* TABLA */}

            <div
              className="table-responsive"
              style={{
                borderRadius: 18,
                overflow: "hidden",
              }}
            >

              <table
                className="
                  highlight
                  responsive-table
                  centered
                "
              >

                <thead
                  style={{
                    background:
                      "#f4f6f9",
                  }}
                >

                  <tr>

                    <th>
                      Factura
                    </th>

                    <th>
                      Cliente
                    </th>

                    <th>
                      Empleado
                    </th>

                    <th>
                      Fecha
                    </th>

                    <th>
                      Productos
                    </th>

                    <th>
                      Total
                    </th>

                    <th>
                      Estado
                    </th>

                    <th>
                      Ver
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {loading ? (

                    <tr>

                      <td colSpan="8">
                        Cargando facturas...
                      </td>

                    </tr>

                  ) : facturasFiltradas.length === 0 ? (

                    <tr>

                      <td colSpan="8">
                        No hay facturas registradas
                      </td>

                    </tr>

                  ) : (

                    facturasFiltradas.map(
                      (
                        factura
                      ) => (

                        <tr
                          key={
                            factura._id
                          }
                        >

                          {/* FACTURA */}

                          <td>

                            <strong
                              style={{
                                color:
                                  "#1565C0",
                              }}
                            >

                              #
                              {
                                factura?._id
                                  ?.slice(-6)
                                  ?.toUpperCase()
                              }

                            </strong>

                          </td>

                          {/* CLIENTE */}

                          <td>

                            {
                              factura
                                ?.cliente_id
                                ?.nombre ||
                              "—"
                            }

                          </td>

                          {/* EMPLEADO */}

                          <td>

                            {
                              factura
                                ?.empleado_id
                                ?.usuario_id
                                ?.nombre ||
                              "Compra online"
                            }

                          </td>

                          {/* FECHA */}

                          <td>

                            {
                              formatDate(
                                factura.createdAt
                              )
                            }

                          </td>

                          {/* PRODUCTOS */}

                          <td>

                            <span
                              style={{
                                fontWeight: 700,
                              }}
                            >
                              {
                                factura
                                  ?.productos
                                  ?.length || 0
                              }
                            </span>

                          </td>

                          {/* TOTAL */}

                          <td>

                            <strong
                              style={{
                                color:
                                  "#2E7D32",
                              }}
                            >

                              {
                                formatMoney(
                                  factura.total
                                )
                              }

                            </strong>

                          </td>

                          {/* ESTADO */}

                          <td>

                            <span
                              className={`
                                new
                                badge
                                ${getEstadoColor(
                                  factura.estado
                                )}
                              `}
                              data-badge-caption=""
                            >

                              {
                                factura.estado ||
                                "—"
                              }

                            </span>

                          </td>

                          {/* VER */}

                          <td>

                            <button
                              className="
                                btn-small
                                blue
                                waves-effect
                                waves-light
                                facturas-action-btn
                              "
                              title="Ver factura"
                              style={{
                                borderRadius: 10,
                              }}
                              onClick={() =>
                                setFacturaSeleccionada(
                                  factura
                                )
                              }
                            >

                              <i className="material-icons">
                                visibility
                              </i>

                            </button>

                          </td>

                        </tr>
                      )
                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================
          MODAL FACTURA
      ===================================== */}

      {
        facturaSeleccionada && (

          <div
            className="modal-overlay-custom"
            onClick={cerrarModal}
            style={{
              position: "fixed",
              inset: 0,
              background:
                "rgba(0,0,0,0.6)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
              backdropFilter:
                "blur(4px)",
            }}
          >

            <div
              className="modal-factura-custom"
              onClick={(e) =>
                e.stopPropagation()
              }
              style={{
                width: "100%",
                maxWidth: 1000,
                maxHeight: "92vh",
                overflowY: "auto",
                borderRadius: 24,
                background: "#fff",
                boxShadow:
                  "0 15px 50px rgba(0,0,0,0.25)",
                animation:
                  "fadeFactura 0.25s ease",
              }}
            >

              {/* HEADER */}

              <div
                className="modal-header-factura"
                style={{
                  padding:
                    "24px 30px",
                  background:
                    "linear-gradient(135deg, #1565C0 0%, #1E88E5 100%)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "space-between",
                }}
              >

                <div>

                  <h4
                    style={{
                      margin: 0,
                      fontWeight: 800,
                    }}
                  >
                    Factura #
                    {
                      facturaSeleccionada?._id
                        ?.slice(-6)
                        ?.toUpperCase()
                    }
                  </h4>

                  <p
                    style={{
                      marginTop: 8,
                      opacity: 0.9,
                    }}
                  >
                    Detalle completo
                    de la compra
                  </p>

                </div>

                <button
                  className="
                    btn-flat
                    white-text
                  "
                  onClick={cerrarModal}
                >

                  <i
                    className="material-icons"
                    style={{
                      fontSize: 32,
                    }}
                  >
                    close
                  </i>

                </button>

              </div>

              {/* BODY */}

              <div
                className="modal-body-factura"
                style={{
                  padding: 30,
                }}
              >

                {/* TOP INFO */}

                <div className="row">

                  {/* CLIENTE */}

                  <div className="col s12 m6">

                    <div
                      className="factura-info-card"
                      style={{
                        borderRadius: 18,
                        padding: 24,
                        background:
                          "#f5f9ff",
                        border:
                          "1px solid #d6e9ff",
                        height: "100%",
                      }}
                    >

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          marginBottom: 18,
                        }}
                      >

                        <div
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius:
                              "50%",
                            background:
                              "#1565C0",
                            display: "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            color: "#fff",
                          }}
                        >

                          <i className="material-icons">
                            person
                          </i>

                        </div>

                        <div>

                          <h6
                            style={{
                              margin: 0,
                              fontWeight: 700,
                            }}
                          >
                            Cliente
                          </h6>

                          <span
                            style={{
                              color:
                                "#666",
                              fontSize: 13,
                            }}
                          >
                            Información
                            del comprador
                          </span>

                        </div>

                      </div>

                      <p>
                        <strong>
                          Nombre:
                        </strong>{" "}
                        {
                          facturaSeleccionada
                            ?.cliente_id
                            ?.nombre ||
                          "—"
                        }
                      </p>

                      <p>
                        <strong>
                          Email:
                        </strong>{" "}
                        {
                          facturaSeleccionada
                            ?.cliente_id
                            ?.email ||
                          "—"
                        }
                      </p>

                    </div>

                  </div>

                  {/* INFO */}

                  <div className="col s12 m6">

                    <div
                      className="factura-info-card"
                      style={{
                        borderRadius: 18,
                        padding: 24,
                        background:
                          "#faf7ff",
                        border:
                          "1px solid #e7dcff",
                        height: "100%",
                      }}
                    >

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          marginBottom: 18,
                        }}
                      >

                        <div
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius:
                              "50%",
                            background:
                              "#7B1FA2",
                            display: "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            color: "#fff",
                          }}
                        >

                          <i className="material-icons">
                            description
                          </i>

                        </div>

                        <div>

                          <h6
                            style={{
                              margin: 0,
                              fontWeight: 700,
                            }}
                          >
                            Información
                          </h6>

                          <span
                            style={{
                              color:
                                "#666",
                              fontSize: 13,
                            }}
                          >
                            Datos de la
                            factura
                          </span>

                        </div>

                      </div>

                      <p>
                        <strong>
                          Fecha:
                        </strong>{" "}
                        {
                          formatDate(
                            facturaSeleccionada.createdAt
                          )
                        }
                      </p>

                      <p>
                        <strong>
                          Estado:
                        </strong>{" "}

                        <span
                          className={`
                            new
                            badge
                            ${getEstadoColor(
                              facturaSeleccionada.estado
                            )}
                          `}
                          data-badge-caption=""
                        >
                          {
                            facturaSeleccionada.estado
                          }
                        </span>

                      </p>

                      <p>
                        <strong>
                          Empleado:
                        </strong>{" "}
                        {
                          facturaSeleccionada
                            ?.empleado_id
                            ?.usuario_id
                            ?.nombre ||
                          "Compra online"
                        }
                      </p>

                    </div>

                  </div>

                </div>

               {/* PRODUCTOS */}

<div
  className="factura-productos"
  style={{
    marginTop: 15,
  }}
>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent:
        "space-between",
      marginBottom: 18,
    }}
  >

    <h5
      style={{
        fontWeight: 700,
        margin: 0,
      }}
    >
      🛒 Productos
    </h5>

    <span
      style={{
        background:
          "#e3f2fd",
        color: "#1565C0",
        padding:
          "6px 14px",
        borderRadius: 20,
        fontWeight: 700,
        fontSize: 13,
      }}
    >
      {
        facturaSeleccionada
          ?.productos
          ?.length || 0
      }{" "}
      productos
    </span>

  </div>

  <div
    style={{
      borderRadius: 18,
      overflow: "hidden",
      border:
        "1px solid #eee",
    }}
  >

    <table className="highlight responsive-table">

      <thead
        style={{
          background:
            "#f7f8fa",
        }}
      >

        <tr>

          <th>
            Producto
          </th>

          <th>
            Cantidad
          </th>

          <th>
            Precio Unitario
          </th>

          <th>
            Total
          </th>

        </tr>

      </thead>

      <tbody>

        {
          facturaSeleccionada
            ?.productos
            ?.length > 0 ? (

            facturaSeleccionada.productos.map(
  (
    producto,
    index
  ) => {

    /*
      =====================================
      DEBUG PRODUCTO
      =====================================
    */

    console.log(
      "🧾 PRODUCTO FACTURA:",
      producto
    );

    console.log(
      "📦 producto_id:",
      producto?.producto_id
    );

    console.log(
      "💲 precio directo:",
      producto?.precio
    );

    console.log(
      "💲 precio populate:",
      producto?.producto_id?.precio
    );

    /*
      =====================================
      CANTIDAD
      =====================================
    */

    const cantidad =
      Number(
        producto?.cantidad || 0
      );

    /*
      =====================================
      PRECIO UNITARIO
      =====================================

      PRIORIDAD:

      1. producto.precio
      2. producto.producto_id.precio
      3. 0

    =====================================
    */

    const precio =
      Number(
        producto?.precio ??
        producto?.producto_id?.precio ??
        0
      );

    /*
      =====================================
      DEBUG PRECIO
      =====================================
    */

    if (
      !producto?.precio &&
      !producto?.producto_id?.precio
    ) {

      console.warn(
        "⚠️ NO SE ENCONTRÓ PRECIO",
        {
          producto
        }
      );
    }

    /*
      =====================================
      TOTAL PRODUCTO
      =====================================
    */

    const totalProducto =
      cantidad * precio;

    /*
      =====================================
      DEBUG TOTAL
      =====================================
    */

    console.log(
      "🧮 CALCULO:",
      {
        cantidad,
        precio,
        totalProducto
      }
    );

    return (

      <tr
        key={index}
      >

        {/* PRODUCTO */}

        <td>

          <div
            style={{
              display:
                "flex",
              alignItems:
                "center",
              gap: 12,
            }}
          >

            <div
              style={{
                width: 42,
                height: 42,
                borderRadius:
                  12,
                background:
                  "#E3F2FD",
                display:
                  "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                color:
                  "#1565C0",
              }}
            >

              <i className="material-icons">
                inventory_2
              </i>

            </div>

            <div>

              <strong>
                {
                  producto
                    ?.producto_id
                    ?.nombre ||

                  producto
                    ?.nombre ||

                  "Producto"
                }
              </strong>

            </div>

          </div>

        </td>

        {/* CANTIDAD */}

        <td>

          <span
            style={{
              fontWeight: 700,
              background:
                "#f1f3f4",
              padding:
                "6px 12px",
              borderRadius: 12,
            }}
          >
            x{cantidad}
          </span>

        </td>

        {/* PRECIO UNITARIO */}

        <td>

          <span
            style={{
              color: "#555",
              fontWeight: 600,
            }}
          >

            {
              precio > 0
                ? formatMoney(
                    precio
                  )
                : "Sin precio"
            }

          </span>

        </td>

        {/* TOTAL */}

        <td>

          <strong
            style={{
              color:
                "#2E7D32",
              fontSize: 16,
            }}
          >

            {
              formatMoney(
                totalProducto
              )
            }

          </strong>

        </td>

      </tr>
    );
  }
)
          ) : (

            <tr>

              <td colSpan="4">
                Sin productos
              </td>

            </tr>
          )
        }

      </tbody>

    </table>

  </div>

</div>

                {/* TOTAL */}

                <div
                  className="factura-total-box"
                  style={{
                    marginTop: 28,
                    borderRadius: 22,
                    padding:
                      "22px 28px",
                    background:
                      "linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "space-between",
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >

                  <div>

                    <p
                      style={{
                        margin: 0,
                        opacity: 0.9,
                        fontSize: 14,
                      }}
                    >
                      Valor total
                      de la factura
                    </p>

                    <h4
                      style={{
                        margin:
                          "8px 0 0 0",
                        fontWeight: 800,
                      }}
                    >

                      {
                        formatMoney(
                          facturaSeleccionada.total
                        )
                      }

                    </h4>

                  </div>

                  <div
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius:
                        "50%",
                      background:
                        "rgba(255,255,255,0.15)",
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
                      }}
                    >
                      payments
                    </i>

                  </div>

                </div>

              </div>

            </div>

          </div>
        )
      }

      {/* =====================================
          ANIMACIONES
      ===================================== */}

      <style>
        {`
          @keyframes fadeFactura {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .facturas-table-card table tbody tr:hover {
            background: #f8fbff;
          }

          .facturas-table-card table td,
          .facturas-table-card table th {
            padding-top: 16px;
            padding-bottom: 16px;
          }

          @media (max-width: 768px) {

            .modal-factura-custom {
              max-height: 95vh !important;
              border-radius: 18px !important;
            }

            .modal-body-factura {
              padding: 18px !important;
            }

            .modal-header-factura {
              padding: 18px 20px !important;
            }

          }
        `}
      </style>

    </div>
  );
}