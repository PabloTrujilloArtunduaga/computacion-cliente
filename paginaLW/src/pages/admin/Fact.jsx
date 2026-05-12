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

  /*
    =====================================
    INIT MATERIALIZE
    =====================================
  */

  useEffect(() => {

    const selects =
      document.querySelectorAll("select");

    M.FormSelect.init(selects);

  }, []);

  /*
    =====================================
    FETCH FACTURAS
    =====================================
  */

  useEffect(() => {

    const fetchFacturas =
      async () => {

        try {

          console.log(
            "================================"
          );

          console.log(
            "OBTENIENDO FACTURAS..."
          );

          const res =
            await fetchConToken(
              `${API}/facturas`
            );

          console.log(
            "STATUS:"
          );

          console.log(
            res.status
          );

          const data =
            await res.json();

          console.log(
            "FACTURAS BACKEND:"
          );

          console.log(data);

          if (
            !Array.isArray(data)
          ) {

            setFacturas([]);

            M.toast({
              html:
                "❌ Error obteniendo facturas",
              classes:
                "red darken-2 rounded"
            });

            return;
          }

          setFacturas(data);

        } catch (error) {

          console.error(
            "ERROR FACTURAS:"
          );

          console.error(error);

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
    NORMALIZAR ESTADO
    =====================================
  */

  const normalizarEstado =
    (estado = "") =>
      estado
        .toLowerCase()
        .trim();

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

          const estado =
            normalizarEstado(
              factura?.estado
            );

          const coincideBusqueda =
            numero.includes(
              busqueda.toUpperCase()
            ) ||
            cliente
              .toLowerCase()
              .includes(
                busqueda.toLowerCase()
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
      (acc, factura) =>
        acc +
        Number(
          factura.total || 0
        ),
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

        <div className="card-panel facturas-header z-depth-1">

          <div className="row valign-wrapper no-margin">

            <div className="col s12 m8">

              <h4 className="facturas-title">
                🧾 Gestión de Facturas
              </h4>

              <p className="facturas-subtitle">
                Panel administrativo
                para visualizar todas
                las ventas del sistema.
              </p>

            </div>

            <div
              className="
                col
                s12
                m4
                right-align
              "
            >

              <button
                className="
                  btn
                  waves-effect
                  waves-light
                  blue darken-2
                  facturas-btn
                "
              >

                <i className="material-icons left">
                  assessment
                </i>

                Reportes

              </button>

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
                blue-gradient
                white-text
              "
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
                green-gradient
                white-text
              "
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
                orange-gradient
                white-text
              "
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
                purple-gradient
                white-text
              "
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
                >
                  attach_money
                </i>

                <h4 className="ventas-total">

                  {
                    loading
                      ? "-"
                      : `$${totalVentas.toLocaleString("es-CO")}`
                  }

                </h4>

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

        <div className="card facturas-table-card">

          <div className="card-content">

            {/* FILTROS */}

            <div className="row facturas-filters">

              {/* BUSQUEDA */}

              <div className="col s12 m6">

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
                    Buscar factura o cliente
                  </label>

                </div>

              </div>

              {/* FILTRO */}

              <div className="col s12 m3">

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

              {/* CANCELADAS */}

              <div className="col s12 m3">

                <div
                  className="
                    card-panel
                    red lighten-5
                    center-align
                    canceladas-panel
                  "
                >

                  <h5
                    className="
                      red-text
                      text-darken-2
                    "
                  >
                    {
                      canceladas
                    }
                  </h5>

                  <p>
                    Canceladas
                  </p>

                </div>

              </div>

            </div>

            {/* TABLA */}

            <div className="table-responsive">

              <table
                className="
                  highlight
                  responsive-table
                  centered
                "
              >

                <thead>

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
                      Acciones
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {loading ? (

                    <tr>

                      <td colSpan="8">
                        Cargando...
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

                            <strong>

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

                            {new Date(
                              factura.createdAt
                            ).toLocaleDateString(
                              "es-CO"
                            )}

                          </td>

                          {/* PRODUCTOS */}

                          <td>

                            {
                              factura
                                ?.productos
                                ?.length || 0
                            }

                          </td>

                          {/* TOTAL */}

                          <td>

                            <strong>

                              $
                              {Number(
                                factura.total || 0
                              ).toLocaleString(
                                "es-CO"
                              )}

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
                                factura.estado
                              }

                            </span>

                          </td>

                          {/* ACTIONS */}

                          <td>

                            <button
                              className="
                                btn-small
                                blue
                                waves-effect
                                waves-light
                                facturas-action-btn
                              "
                            >

                              <i className="material-icons">
                                visibility
                              </i>

                            </button>

                            <button
                              className="
                                btn-small
                                green
                                waves-effect
                                waves-light
                                facturas-action-btn
                              "
                            >

                              <i className="material-icons">
                                print
                              </i>

                            </button>

                            <button
                              className="
                                btn-small
                                purple
                                waves-effect
                                waves-light
                                facturas-action-btn
                              "
                            >

                              <i className="material-icons">
                                download
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

    </div>
  );
}