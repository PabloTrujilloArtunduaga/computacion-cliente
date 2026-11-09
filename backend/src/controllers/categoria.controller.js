import Categoria from '../models/categorias.model.js';
import { badRequest, notFound } from '../utils/errors.js';

// Buscar categorías (opcionalmente filtradas por estado)
export const getCategorias = async (req, res) => {
  const filtro = {};

  if (req.query.estado === 'true') filtro.estado = true;
  if (req.query.estado === 'false') filtro.estado = false;

  const categorias = await Categoria.find(filtro).sort({ nombre: 1 });
  res.json(categorias);
};

// Buscar una categoría
export const getCategoria = async (req, res) => {
  const categoria = await Categoria.findById(req.params.id);

  if (!categoria) throw notFound('Categoría no encontrada');

  res.json(categoria);
};

// Crear categoría
export const createCategoria = async (req, res) => {
  const { nombre } = req.body;

  const existe = await Categoria.findOne({ nombre });
  if (existe) throw badRequest('La categoría ya existe');

  const categoria = await Categoria.create(req.body);
  res.status(201).json(categoria);
};

// Borrado lógico
export const deleteCategoria = async (req, res) => {
  const categoria = await Categoria.findByIdAndUpdate(
    req.params.id,
    { estado: false },
    { new: true }
  );

  if (!categoria) throw notFound('Categoría no encontrada');

  res.json({ message: 'Categoría desactivada', categoria });
};

// Actualizar
export const updateCategoria = async (req, res) => {
  const { nombre } = req.body;

  if (nombre) {
    const existe = await Categoria.findOne({
      nombre,
      _id: { $ne: req.params.id },
    });

    if (existe) throw badRequest('Ya existe una categoría con ese nombre');
  }

  const categoria = await Categoria.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!categoria) throw notFound('Categoría no encontrada');

  res.json(categoria);
};
