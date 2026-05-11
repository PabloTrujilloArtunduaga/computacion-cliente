const Factura = require("../models/factura.model");
const Producto = require("../models/producto.model");

// Crear factura física desde el tablero del empleado
const crearFacturaFisica = async (req, res) => {
  try {
    const { productos, metodo_pago } = req.body;

    if (!productos || productos.length === 0) {
      return res.status(400).json({
        mensaje: "Debe agregar productos a la factura"
      });
    }

    let productosFactura = [];
    let total = 0;

    for (const item of productos) {
      const productoId = item.producto_id || item.producto || item.id;

      const productoBD = await Producto.findById(productoId);

      if (!productoBD) {
        return res.status(404).json({
          mensaje: "Producto no encontrado"
        });
      }

      const precioUnitario = productoBD.precio || item.precio_unitario || item.precio || 0;
      const subtotal = precioUnitario * item.cantidad;

      productosFactura.push({
        producto_id: productoBD._id,
        nombre: productoBD.nombre,
        cantidad: item.cantidad,
        precio_unitario: precioUnitario,
        subtotal
      });

      total += subtotal;
    }

    const nuevaFactura = new Factura({
      empleado_id: req.usuario ? req.usuario.id : null,
      productos: productosFactura,
      total,
      metodo_pago: metodo_pago || "EFECTIVO",
      tipo_venta: "FISICA",
      estado: "PAGADO",
      activo: true
    });

    await nuevaFactura.save();

    return res.status(201).json({
      mensaje: "Factura física creada correctamente",
      factura: nuevaFactura
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al crear la factura física",
      error: error.message
    });
  }
};

// Crear factura virtual desde el carrito del cliente
const crearFacturaVirtual = async (req, res) => {
  try {
    const { productos, metodo_pago } = req.body;

    if (!req.usuario) {
      return res.status(401).json({
        mensaje: "Debe estar registrado para comprar."
      });
    }

    if (!productos || productos.length === 0) {
      return res.status(400).json({
        mensaje: "El carrito está vacío"
      });
    }

    let productosFactura = [];
    let total = 0;

    for (const item of productos) {
      const productoId = item.producto_id || item.producto || item.id;

      const productoBD = await Producto.findById(productoId);

      if (!productoBD) {
        return res.status(404).json({
          mensaje: "Producto no encontrado"
        });
      }

      const precioUnitario = productoBD.precio || item.precio_unitario || item.precio || 0;
      const subtotal = precioUnitario * item.cantidad;

      productosFactura.push({
        producto_id: productoBD._id,
        nombre: productoBD.nombre,
        cantidad: item.cantidad,
        precio_unitario: precioUnitario,
        subtotal
      });

      total += subtotal;
    }

    const nuevaFactura = new Factura({
      cliente_id: req.usuario.id,
      productos: productosFactura,
      total,
      metodo_pago: metodo_pago || "TARJETA",
      tipo_venta: "VIRTUAL",
      estado: "PENDIENTE",
      activo: true
    });

    await nuevaFactura.save();

    return res.status(201).json({
      mensaje: "Pedido creado correctamente. Queda pendiente de validación.",
      factura: nuevaFactura
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al crear la factura virtual",
      error: error.message
    });
  }
};

// Listar todas las facturas activas
const listarFacturas = async (req, res) => {
  try {
    const facturas = await Factura.find({ activo: true })
      .populate("cliente_id", "nombre usuario rol estado")
      .populate("empleado_id", "nombre usuario rol estado")
      .populate("productos.producto_id")
      .sort({ createdAt: -1 });

    return res.json(facturas);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al listar facturas",
      error: error.message
    });
  }
};

// Listar solo facturas pendientes para el tablero del empleado
const listarFacturasPendientes = async (req, res) => {
  try {
    const facturas = await Factura.find({
      estado: "PENDIENTE",
      activo: true
    })
      .populate("cliente_id", "nombre usuario rol estado")
      .populate("productos.producto_id")
      .sort({ createdAt: -1 });

    return res.json(facturas);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al listar pedidos pendientes",
      error: error.message
    });
  }
};

// Obtener una factura por ID
const obtenerFacturaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const factura = await Factura.findById(id)
      .populate("cliente_id", "nombre usuario rol estado")
      .populate("empleado_id", "nombre usuario rol estado")
      .populate("productos.producto_id");

    if (!factura) {
      return res.status(404).json({
        mensaje: "Factura no encontrada"
      });
    }

    return res.json(factura);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener factura",
      error: error.message
    });
  }
};

// Actualizar estado de factura
const actualizarEstadoFactura = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosPermitidos = ["PENDIENTE", "PAGADO", "ANULADO", "ENTREGADO"];

    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({
        mensaje: "Estado no válido"
      });
    }

    const factura = await Factura.findByIdAndUpdate(
      id,
      { estado },
      { new: true }
    );

    if (!factura) {
      return res.status(404).json({
        mensaje: "Factura no encontrada"
      });
    }

    return res.json({
      mensaje: "Estado de la factura actualizado correctamente",
      factura
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al actualizar estado de factura",
      error: error.message
    });
  }
};

// Soft delete de factura
const eliminarFactura = async (req, res) => {
  try {
    const { id } = req.params;

    const factura = await Factura.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    );

    if (!factura) {
      return res.status(404).json({
        mensaje: "Factura no encontrada"
      });
    }

    return res.json({
      mensaje: "Factura eliminada correctamente",
      factura
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al eliminar factura",
      error: error.message
    });
  }
};

module.exports = {
  crearFacturaFisica,
  crearFacturaVirtual,
  listarFacturas,
  listarFacturasPendientes,
  obtenerFacturaPorId,
  actualizarEstadoFactura,
  eliminarFactura,

  // Alias por si alguna ruta vieja usa estos nombres
  createFactura: crearFacturaVirtual,
  getFacturas: listarFacturas,
  getFactura: obtenerFacturaPorId,
  deleteFactura: eliminarFactura
};