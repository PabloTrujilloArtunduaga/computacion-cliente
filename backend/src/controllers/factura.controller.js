import Usuario from '../models/usuario.model.js';
import Empleado from '../models/empleado.model.js';
import Producto from '../models/producto.model.js';
import Factura from '../models/factura.model.js';
import { badRequest, conflict, notFound } from '../utils/errors.js';

const POPULATE_CLIENTE = { path: 'cliente_id', select: '_id nombre email rol' };
const POPULATE_EMPLEADO = {
  path: 'empleado_id',
  populate: { path: 'usuario_id', select: '_id nombre email rol' },
};
const POPULATE_PRODUCTO = { path: 'productos.producto_id', select: '_id nombre precio stock' };

const populateFactura = (query) =>
  query
    .populate(POPULATE_CLIENTE)
    .populate(POPULATE_EMPLEADO)
    .populate(POPULATE_PRODUCTO);

/** Agrupa productos repetidos y normaliza cantidades. */
const normalizarItems = (productos) => {
  const mapa = new Map();

  for (const item of productos) {
    const id = String(item.producto_id);
    mapa.set(id, (mapa.get(id) || 0) + Number(item.cantidad));
  }

  return [...mapa.entries()].map(([producto_id, cantidad]) => ({
    producto_id,
    cantidad,
  }));
};

/** Obtiene del catálogo los productos y calcula precios/subtotales en servidor. */
const construirDetalle = async (items, { validarStock = true } = {}) => {
  const ids = items.map((item) => item.producto_id);
  const productos = await Producto.find({ _id: { $in: ids }, deleted: false });
  const porId = new Map(productos.map((p) => [String(p._id), p]));

  let total = 0;

  const detalle = items.map((item) => {
    const producto = porId.get(String(item.producto_id));

    if (!producto) {
      throw badRequest(`Producto no existe: ${item.producto_id}`);
    }

    if (!producto.estado) {
      throw badRequest(`Producto no disponible: ${producto.nombre}`);
    }

    if (validarStock && producto.stock < item.cantidad) {
      throw conflict(`Stock insuficiente para ${producto.nombre}`);
    }

    const subtotal = Number((producto.precio * item.cantidad).toFixed(2));
    total += subtotal;

    return {
      producto_id: producto._id,
      nombre: producto.nombre,
      cantidad: item.cantidad,
      precio_unitario: producto.precio,
      subtotal,
    };
  });

  return { detalle, total };
};

/** Devuelve stock de los movimientos ya aplicados. */
const devolverStock = async (movimientos) => {
  await Promise.all(
    movimientos.map((mov) =>
      Producto.updateOne(
        { _id: mov.producto_id },
        { $inc: { stock: -mov.delta } }
      )
    )
  );
};

/**
 * Aplica movimientos de stock de forma atómica.
 * delta negativo descuenta, positivo devuelve.
 */
const aplicarMovimientos = async (movimientos) => {
  const aplicados = [];

  try {
    for (const mov of movimientos) {
      if (mov.delta === 0) continue;

      const cantidad = Math.abs(mov.delta);

      const filtro =
        mov.delta < 0
          ? { _id: mov.producto_id, deleted: false, stock: { $gte: cantidad } }
          : { _id: mov.producto_id };

      const result = await Producto.updateOne(filtro, {
        $inc: { stock: mov.delta },
      });

      if (result.modifiedCount !== 1) {
        throw conflict(
          mov.delta < 0
            ? `Stock insuficiente para ${mov.nombre || mov.producto_id}`
            : `No se pudo actualizar el stock de ${mov.producto_id}`
        );
      }

      aplicados.push(mov);
    }
  } catch (error) {
    await devolverStock(aplicados);
    throw error;
  }

  return aplicados;
};

/** Resuelve un id de usuario empleado o de registro Empleado al _id de Empleado. */
const resolverEmpleado = async (empleadoId) => {
  if (!empleadoId) return null;

  const empleado = await Empleado.findById(empleadoId);
  if (empleado) return empleado._id;

  const usuario = await Usuario.findOne({ _id: empleadoId, rol: 'empleado' });
  if (!usuario) throw badRequest('El empleado no existe');

  const empleadoPorUsuario = await Empleado.findOne({ usuario_id: usuario._id });
  if (!empleadoPorUsuario) {
    throw badRequest('El usuario no tiene registro de empleado');
  }

  return empleadoPorUsuario._id;
};

const validarCliente = async (clienteId) => {
  const cliente = await Usuario.findById(clienteId);
  if (!cliente) throw badRequest('El cliente no existe');
  return cliente;
};

/** Lógica común de creación de factura. */
const crearFactura = async ({
  clienteId,
  empleadoId,
  productos,
  metodoPago,
  estado = 'pagada',
}) => {
  await validarCliente(clienteId);

  const items = normalizarItems(productos);
  if (items.length === 0) throw badRequest('Debe haber al menos un producto');

  const empleado = await resolverEmpleado(empleadoId);
  const { detalle } = await construirDetalle(items);

  const movimientos = items.map((item) => ({
    producto_id: item.producto_id,
    nombre: detalle.find((d) => String(d.producto_id) === String(item.producto_id))?.nombre,
    delta: -item.cantidad,
  }));

  await aplicarMovimientos(movimientos);

  try {
    const factura = new Factura({
      cliente_id: clienteId,
      empleado_id: empleado,
      productos: detalle,
      total: detalle.reduce((acc, item) => acc + item.subtotal, 0),
      metodo_pago: metodoPago,
      estado,
    });

    await factura.save();

    return populateFactura(Factura.findById(factura._id));
  } catch (error) {
    await devolverStock(movimientos);
    throw error;
  }
};

// =====================================================
// CREAR FACTURA (ADMIN / EMPLEADO)
// =====================================================

export const createFactura = async (req, res) => {
  const { cliente_id, empleado_id, productos, metodo_pago, estado } = req.body;

  const factura = await crearFactura({
    clienteId: cliente_id,
    empleadoId: empleado_id,
    productos,
    metodoPago: metodo_pago,
    estado: estado || 'pagada',
  });

  res.status(201).json(factura);
};

// =====================================================
// CREAR FACTURA CLIENTE
// =====================================================

export const createFacturaCliente = async (req, res) => {
  const { productos, metodo_pago } = req.body;

  // Un cliente solo puede comprar a su propio nombre.
  const clienteId =
    req.user.rol === 'cliente'
      ? req.user.id
      : req.body.cliente_id || req.user.id;

  const factura = await crearFactura({
    clienteId,
    empleadoId: null,
    productos,
    metodoPago: metodo_pago,
    estado: 'pagada',
  });

  res.status(201).json(factura);
};

// =====================================================
// OBTENER FACTURAS
// =====================================================

export const getFacturas = async (_req, res) => {
  const facturas = await populateFactura(
    Factura.find({ eliminado: false }).sort({ createdAt: -1 })
  );

  res.json(facturas);
};

// =====================================================
// FACTURA POR ID
// =====================================================

export const getFactura = async (req, res) => {
  const factura = await populateFactura(
    Factura.findOne({ _id: req.params.id, eliminado: false })
  );

  if (!factura) throw notFound('Factura no encontrada');

  res.json(factura);
};

// =====================================================
// FACTURAS POR CLIENTE
// =====================================================

export const getFacturasByCliente = async (req, res) => {
  const facturas = await populateFactura(
    Factura.find({
      cliente_id: req.params.clienteId,
      eliminado: false,
    }).sort({ createdAt: -1 })
  );

  res.json(facturas);
};

// =====================================================
// ACTUALIZAR
// =====================================================

export const updateFactura = async (req, res) => {
  const factura = await Factura.findOne({
    _id: req.params.id,
    eliminado: false,
  });

  if (!factura) throw notFound('Factura no encontrada');

  if (req.body.cliente_id) {
    await validarCliente(req.body.cliente_id);
    factura.cliente_id = req.body.cliente_id;
  }

  if ('empleado_id' in req.body) {
    factura.empleado_id = await resolverEmpleado(req.body.empleado_id);
  }

  let movimientos = [];

  if (req.body.productos) {
    const itemsNuevos = normalizarItems(req.body.productos);
    if (itemsNuevos.length === 0) throw badRequest('Debe haber al menos un producto');

    // Cantidades actuales de la factura
    const itemsViejos = new Map();
    for (const item of factura.productos) {
      const id = String(item.producto_id);
      itemsViejos.set(id, (itemsViejos.get(id) || 0) + item.cantidad);
    }

    const { detalle } = await construirDetalle(itemsNuevos, { validarStock: false });
    const nuevos = new Map(itemsNuevos.map((i) => [String(i.producto_id), i.cantidad]));
    const ids = new Set([...itemsViejos.keys(), ...nuevos.keys()]);

    movimientos = [...ids]
      .map((id) => {
        const vieja = itemsViejos.get(id) || 0;
        const nueva = nuevos.get(id) || 0;
        return {
          producto_id: id,
          nombre: factura.productos.find((p) => String(p.producto_id) === id)?.nombre,
          // nueva > vieja => consumir stock (delta negativo)
          delta: vieja - nueva,
        };
      })
      .filter((mov) => mov.delta !== 0);

    await aplicarMovimientos(movimientos);
    factura.productos = detalle;
  }

  if (req.body.metodo_pago) factura.metodo_pago = req.body.metodo_pago;
  if (req.body.estado) factura.estado = req.body.estado;

  try {
    await factura.save();
  } catch (error) {
    if (movimientos.length) await devolverStock(movimientos);
    throw error;
  }

  const actualizada = await populateFactura(Factura.findById(factura._id));
  res.json(actualizada);
};

// =====================================================
// ELIMINAR (lógico, devuelve stock)
// =====================================================

export const deleteFactura = async (req, res) => {
  const factura = await Factura.findOneAndUpdate(
    { _id: req.params.id, eliminado: false },
    { eliminado: true, eliminadoEn: new Date() },
    { new: true }
  );

  if (!factura) throw notFound('Factura no encontrada');

  // Devolver stock es best-effort: si un producto ya no existe,
  // la factura igual queda eliminada.
  await Promise.all(
    factura.productos.map((item) =>
      Producto.updateOne(
        { _id: item.producto_id },
        { $inc: { stock: item.cantidad } }
      )
    )
  );

  res.json({ message: 'Factura eliminada correctamente', factura });
};

// =====================================================
// VENTAS POR MES (dashboard admin)
// =====================================================

export const getVentasPorMes = async (_req, res) => {
  const facturas = await Factura.find({
    eliminado: false,
    estado: { $ne: 'cancelada' },
  }).select('total createdAt');

  const meses = {};

  facturas.forEach((f) => {
    const fecha = new Date(f.createdAt);
    const key = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
    const label = fecha.toLocaleString('es-CO', { month: 'short', year: '2-digit' });

    if (!meses[key]) meses[key] = { label, total: 0, cantidad: 0 };
    meses[key].total += Number(f.total || 0);
    meses[key].cantidad += 1;
  });

  const resultado = Object.entries(meses)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([, value]) => value);

  res.json(resultado);
};
