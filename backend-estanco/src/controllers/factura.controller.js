import Usuario from "../models/usuario.model.js";
import Empleado from "../models/empleado.model.js";
import Producto from "../models/producto.model.js";
import Factura from "../models/factura.model.js";

// =====================================================
// CREAR FACTURA CLIENTE
// =====================================================

export const createFacturaCliente = async (req, res) => {

  try {

    const {
      cliente_id,
      productos,
      metodo_pago
    } = req.body;

    // =========================================
    // VALIDAR CLIENTE
    // =========================================

    const cliente =
      await Usuario.findById(cliente_id);

    if (!cliente) {

      return res.status(400).json({
        message: "Cliente no existe"
      });
    }

    // =========================================
    // PRODUCTOS
    // =========================================

    let total = 0;

    const productosProcesados = [];

    for (const item of productos) {

      const producto =
        await Producto.findById(
          item.producto_id
        );

      if (!producto) {

        return res.status(400).json({
          message:
            `Producto no existe: ${item.producto_id}`
        });
      }

      if (producto.stock < item.cantidad) {

        return res.status(400).json({
          message:
            `Stock insuficiente para ${producto.nombre}`
        });
      }

      const subtotal =
        item.cantidad *
        item.precio_unitario;

      total += subtotal;

      productosProcesados.push({

        producto_id:
          producto._id,

        nombre:
          producto.nombre,

        cantidad:
          item.cantidad,

        precio_unitario:
          item.precio_unitario,

        subtotal

      });

      // ✅ DESCONTAR STOCK

      producto.stock -= item.cantidad;

      await producto.save();
    }

    // =========================================
    // CREAR FACTURA
    // =========================================

    const factura = new Factura({

      cliente_id,

      empleado_id: null,

      productos:
        productosProcesados,

      total,

      metodo_pago,

      estado: "pagada"

    });

    await factura.save();

    res.status(201).json(factura);

  } catch (error) {

    console.error(
      "ERROR CREATE FACTURA CLIENTE:",
      error
    );

    res.status(500).json({

      message:
        "Error creando factura",

      error:
        error.message

    });
  }
};

// =====================================================
// CREAR FACTURA EMPLEADO
// =====================================================

export const createFactura = async (req, res) => {

  try {

    const {
      cliente_id,
      empleado_id,
      productos,
      metodo_pago,
      estado
    } = req.body;

    console.log(
      "BODY FACTURA:",
      req.body
    );

    // =========================================
    // VALIDAR CLIENTE
    // =========================================

    const cliente =
      await Usuario.findById(
        cliente_id
      );

    if (!cliente) {

      return res.status(400).json({
        message: "Cliente no existe"
      });
    }

    // =========================================
    // VALIDAR EMPLEADO
    // =========================================

    const empleado = await Usuario.findOne({
  _id: empleado_id,
  rol: "empleado"
});

if (!empleado) {
  return res.status(400).json({
    message: "Empleado no existe"
  });
}

    // =========================================
    // VALIDAR PRODUCTOS
    // =========================================

    let total = 0;

    const productosProcesados = [];

    for (const item of productos) {

      const producto =
        await Producto.findById(
          item.producto_id
        );

      if (!producto) {

        return res.status(400).json({
          message:
            `Producto no existe: ${item.producto_id}`
        });
      }

      // ✅ STOCK

      if (
        producto.stock <
        item.cantidad
      ) {

        return res.status(400).json({
          message:
            `Stock insuficiente para ${producto.nombre}`
        });
      }

      const subtotal =
        item.cantidad *
        item.precio_unitario;

      total += subtotal;

      productosProcesados.push({

        producto_id:
          producto._id,

        nombre:
          producto.nombre,

        cantidad:
          item.cantidad,

        precio_unitario:
          item.precio_unitario,

        subtotal

      });

      // ✅ DESCONTAR STOCK

      producto.stock -= item.cantidad;

      await producto.save();
    }

    // =========================================
    // CREAR FACTURA
    // =========================================

    const factura = new Factura({

      cliente_id,

      empleado_id,

      productos:
        productosProcesados,

      total,

      metodo_pago,

      estado:
        estado || "pagada"

    });

    await factura.save();

    const facturaCreada =
      await Factura.findById(
        factura._id
      )
      .populate("cliente_id")
      .populate({
        path: "empleado_id",
        populate: {
          path: "usuario_id"
        }
      })
      .populate("productos.producto_id");

    res.status(201).json(
      facturaCreada
    );

  } catch (error) {

    console.error(
      "ERROR CREATE FACTURA:",
      error
    );

    res.status(500).json({

      message:
        "Error creando factura",

      error:
        error.message,

      stack:
        process.env.NODE_ENV ===
        "development"
          ? error.stack
          : undefined

    });
  }
};

// =====================================================
// OBTENER FACTURAS
// =====================================================

export const getFacturas = async (req, res) => {

  try {

    const facturas =
      await Factura.find({
        eliminado: false
      })

      .populate("cliente_id")

      .populate({
        path: "empleado_id",
        populate: {
          path: "usuario_id"
        }
      })

      .populate(
        "productos.producto_id"
      );

    res.json(facturas);

  } catch (error) {

    res.status(500).json({

      message:
        "Error obteniendo facturas",

      error:
        error.message

    });
  }
};

// =====================================================
// FACTURA POR ID
// =====================================================

export const getFactura = async (req, res) => {

  try {

    const factura =
      await Factura.findById(
        req.params.id
      )

      .populate("cliente_id")

      .populate({
        path: "empleado_id",
        populate: {
          path: "usuario_id"
        }
      })

      .populate(
        "productos.producto_id"
      );

    if (!factura) {

      return res.status(404).json({
        message:
          "Factura no encontrada"
      });
    }

    res.json(factura);

  } catch (error) {

    res.status(500).json({

      message:
        "Error obteniendo factura",

      error:
        error.message

    });
  }
};

// =====================================================
// FACTURAS CLIENTE
// =====================================================

export const getFacturasByCliente =
  async (req, res) => {

    try {

      const facturas =
        await Factura.find({

          cliente_id:
            req.params.clienteId,

          eliminado: false

        })

        .populate("cliente_id")

        .populate({
          path: "empleado_id",
          populate: {
            path: "usuario_id"
          }
        })

        .populate(
          "productos.producto_id"
        );

      res.json(facturas);

    } catch (error) {

      res.status(500).json({

        message:
          "Error obteniendo facturas",

        error:
          error.message

      });
    }
  };

// =====================================================
// ACTUALIZAR
// =====================================================

export const updateFactura =
  async (req, res) => {

    try {

      const factura =
        await Factura.findByIdAndUpdate(

          req.params.id,

          req.body,

          {
            new: true,
            runValidators: true
          }

        )

        .populate("cliente_id")

        .populate({
          path: "empleado_id",
          populate: {
            path: "usuario_id"
          }
        })

        .populate(
          "productos.producto_id"
        );

      if (!factura) {

        return res.status(404).json({
          message:
            "Factura no encontrada"
        });
      }

      res.json(factura);

    } catch (error) {

      res.status(500).json({

        message:
          "Error actualizando factura",

        error:
          error.message

      });
    }
  };

// =====================================================
// ELIMINAR
// =====================================================

export const deleteFactura =
  async (req, res) => {

    try {

      const factura =
        await Factura.findByIdAndUpdate(

          req.params.id,

          {
            eliminado: true,
            eliminadoEn: new Date()
          },

          {
            new: true
          }

        );

      if (!factura) {

        return res.status(404).json({
          message:
            "Factura no encontrada"
        });
      }

      res.json({

        message:
          "Factura eliminada correctamente",

        factura

      });

    } catch (error) {

      res.status(500).json({

        message:
          "Error eliminando factura",

        error:
          error.message

      });
    }
  };