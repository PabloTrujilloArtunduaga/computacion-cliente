import Usuario from "../models/usuario.model.js";
import Empleado from "../models/empleado.model.js";
import Producto from "../models/producto.model.js";
import Factura from "../models/factura.model.js";


// Crear una factura
export const createFactura = async (req, res) => {
  try {
    const { cliente_id, empleado_id, productos, metodo_pago, estado } = req.body;

    // 1. Validar cliente
    const cliente = await Usuario.findById(cliente_id);
    if (!cliente) {
      return res.status(400).json({ message: "Cliente no existe" });
    }

    // 2. Validar empleado
    const empleado = await Empleado.findById(empleado_id);
    if (!empleado) {
      return res.status(400).json({ message: "Empleado no existe" });
    }

    // 3. Validar productos y calcular totales
    let total = 0;

    const productosProcesados = [];

    for (const item of productos) {
      const producto = await Producto.findById(item.producto_id);

      if (!producto) {
        return res.status(400).json({
          message: `Producto no existe: ${item.producto_id}`
        });
      }

      const subtotal = item.cantidad * item.precio_unitario;
      total += subtotal;

      productosProcesados.push({
        producto_id: item.producto_id,
        nombre: producto.nombre,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        subtotal
      });
    }

    // 4. Crear factura
    const factura = new Factura({
      cliente_id,
      empleado_id,
      productos: productosProcesados,
      total,
      metodo_pago,
      estado: estado || "pendiente"
    });

    await factura.save();

    res.status(201).json(factura);

  } catch (error) {
    res.status(500).json({
      message: "Error creando factura",
      error: error.message
    });
  }}

// Mostrar todas las facturas
export const getFacturas = async (req, res) => {
  try {
    const facturas = await Factura.find()
      .populate("cliente_id")
      .populate("empleado_id")
      .populate("productos.producto_id");

    res.json(facturas);
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo facturas",
      error: error.message
    });
  }
};


// Obtener una factura
export const getFactura = async (req, res) => {
  try {
    const factura = await Factura.findById(req.params.id)
      .populate("cliente_id")
      .populate("empleado_id")
      .populate("productos.producto_id");

    if (!factura) {
      return res.status(404).json({ message: "Factura no encontrada" });
    }

    res.json(factura);
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo factura",
      error: error.message
    });
  }
};


// Borrar soft
export const deleteFactura = async (req, res) => {
  try {
    const factura = await Factura.findByIdAndDelete(req.params.id);

    if (!factura) {
      return res.status(404).json({ message: "Factura no encontrada" });
    }

    res.json({ message: "Factura eliminada", factura });
  } catch (error) {
    res.status(500).json({
      message: "Error eliminando factura",
      error: error.message
    });
  }
};