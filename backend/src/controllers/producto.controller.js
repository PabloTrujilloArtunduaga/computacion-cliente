import Product from '../models/producto.model.js';
import Category from '../models/categorias.model.js';
import { badRequest, notFound } from '../utils/errors.js';

// GET /api/products
export const getProducts = async (req, res) => {
  const filtro = { deleted: false };

  if (req.query.estado === 'true') filtro.estado = true;
  if (req.query.estado === 'false') filtro.estado = false;

  const products = await Product.find(filtro)
    .populate('categoria_id')
    .sort({ createdAt: -1 });

  res.json(products);
};

// POST /api/products
export const createProduct = async (req, res) => {
  const { categoria_id, nombre } = req.body;

  const categoria = await Category.findById(categoria_id);
  if (!categoria) throw badRequest('La categoría no existe');

  const existe = await Product.findOne({ nombre, deleted: false });
  if (existe) throw badRequest('El producto ya existe');

  const product = await Product.create(req.body);
  res.status(201).json(product);
};

// GET /api/products/:id
export const getProduct = async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    deleted: false,
  }).populate('categoria_id');

  if (!product) throw notFound('Producto no encontrado');

  res.json(product);
};

// DELETE /api/products/:id (borrado lógico)
export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { deleted: true },
    { new: true }
  );

  if (!product) throw notFound('Producto no encontrado');

  res.json({ message: 'Producto eliminado', product });
};

// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  const { categoria_id, nombre } = req.body;

  if (categoria_id) {
    const categoria = await Category.findById(categoria_id);
    if (!categoria) throw badRequest('La categoría no existe');
  }

  if (nombre) {
    const existe = await Product.findOne({
      nombre,
      _id: { $ne: req.params.id },
      deleted: false,
    });

    if (existe) throw badRequest('Ya existe un producto con ese nombre');
  }

  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, deleted: false },
    req.body,
    { new: true, runValidators: true }
  ).populate('categoria_id');

  if (!product) throw notFound('Producto no encontrado');

  res.json(product);
};
