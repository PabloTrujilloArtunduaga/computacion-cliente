const Factura = require("../models/factura.model");
const Producto = require("../models/producto.model");

const crearFacturaFisica = async (req, res) => {
  try {
    const { productos, metodoPago } = req.body;

    if (!productos || productos.length === 0) {
      return res.status(400).json({ mensaje: "Debe agregar productos a la factura" });
    }

    let productosFactura = [];
    let total = 0;

    for (const item of productos) {
      const productoBD = await Producto.findById(item.producto);

      if (!productoBD) {
        return res.status(404).json({ mensaje: "Producto no encontrado" });
      }

      const subtotal = productoBD.precio * item.cantidad;

      productosFactura.push({
        producto: productoBD._id,
        nombre: productoBD.nombre,
        cantidad: item.cantidad,
        precio: productoBD.precio,
        subtotal,
      });

      total += subtotal;
    }

   const nuevaFactura = new Factura({
  empleado_id: req.usuario.id,
  productos: productosFactura,
  total,
  metodo_pago: metodo_pago || 'EFECTIVO',
  tipo_venta: 'FISICA',
  estado: 'PAGADO'
});

    await nuevaFactura.save();

    return res.status(201).json({
      mensaje: "Factura física creada correctamente",
      factura: nuevaFactura,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al crear la factura física",
      error: error.message,
    });
  }
};

const crearFacturaVirtual = async (req, res) => {
  try {
    const { productos, metodoPago } = req.body;

    if (!req.usuario) {
      return res.status(401).json({
        mensaje: "No se encuentra registrado para comprar. Debe iniciar sesión o registrarse.",
      });
    }

    if (!productos || productos.length === 0) {
      return res.status(400).json({ mensaje: "El carrito está vacío" });
    }

    let productosFactura = [];
    let total = 0;

    for (const item of productos) {
      const productoBD = await Producto.findById(item.producto);

      if (!productoBD) {
        return res.status(404).json({ mensaje: "Producto no encontrado" });
      }

      const subtotal = productoBD.precio * item.cantidad;

      productosFactura.push({
        producto: productoBD._id,
        nombre: productoBD.nombre,
        cantidad: item.cantidad,
        precio: productoBD.precio,
        subtotal,
      });

      total += subtotal;
    }

const nuevaFactura = new Factura({
  cliente_id: req.usuario.id,
  productos: productosFactura,
  total,
  metodo_pago,
  tipo_venta: 'VIRTUAL',
  estado: 'PENDIENTE'
});

    await nuevaFactura.save();

    return res.status(201).json({
      mensaje: "Pedido creado correctamente. Queda pendiente de validación.",
      factura: nuevaFactura,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al crear la factura virtual",
      error: error.message,
    });
  }
};

const listarFacturas = async (req, res) => {
  try {
    const facturas = await Factura.find({ activo: true })
      .populate("cliente", "nombre usuario rol estado")
      .populate("empleado", "nombre usuario rol estado")
      .sort({ createdAt: -1 });

    return res.json(facturas);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al listar facturas",
      error: error.message,
    });
  }
};

const listarFacturasPendientes = async (req, res) => {
  try {
    const facturas = await Factura.find({
      estado: "PENDIENTE",
      activo: true,
    })
      .populate("cliente", "nombre usuario rol estado")
      .sort({ createdAt: -1 });

    return res.json(facturas);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al listar pedidos pendientes",
      error: error.message,
    });
  }
};

const actualizarEstadoFactura = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosPermitidos = ["PENDIENTE", "PAGADO", "ANULADO", "ENTREGADO"];

    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({ mensaje: "Estado no válido" });
    }

    const factura = await Factura.findByIdAndUpdate(
      id,
      { estado },
      { new: true }
    );

    if (!factura) {
      return res.status(404).json({ mensaje: "Factura no encontrada" });
    }

    return res.json({
      mensaje: "Estado de la factura actualizado correctamente",
      factura,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al actualizar estado de factura",
      error: error.message,
    });
  }
};

const eliminarFactura = async (req, res) => {
  try {
    const { id } = req.params;

    const factura = await Factura.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    );

    if (!factura) {
      return res.status(404).json({ mensaje: "Factura no encontrada" });
    }

    return res.json({
      mensaje: "Factura eliminada correctamente",
      factura,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al eliminar factura",
      error: error.message,
    });
  }
};

module.exports = {
  crearFacturaFisica,
  crearFacturaVirtual,
  listarFacturas,
  listarFacturasPendientes,
  actualizarEstadoFactura,
  eliminarFactura,
};