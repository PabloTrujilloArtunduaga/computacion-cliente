import User from '../models/usuario.model.js';
import Empleado from '../models/empleado.model.js';
import { conflict, notFound } from '../utils/errors.js';

const POPULATE_USUARIO = { path: 'usuario_id', select: '_id nombre email rol estado' };

// Buscar empleados activos
export const getEmpleados = async (req, res) => {
  const filtro = {};

  if (req.query.estado === 'false') filtro.estado = false;
  else if (req.query.estado === 'true') filtro.estado = true;

  const empleados = await Empleado.find(filtro)
    .populate(POPULATE_USUARIO)
    .sort({ createdAt: -1 });

  res.json(empleados);
};

// Crear (o reactivar) empleado
export const createEmpleado = async (req, res) => {
  const { usuario_id, cargo, salario, fecha_contratacion } = req.body;

  const user = await User.findById(usuario_id);
  if (!user) throw notFound('El usuario no existe');

  const empleadoExistente = await Empleado.findOne({ usuario_id });

  if (empleadoExistente) {
    if (empleadoExistente.estado) {
      throw conflict('Este usuario ya está registrado como empleado');
    }

    empleadoExistente.estado = true;
    empleadoExistente.cargo = cargo;
    empleadoExistente.salario = Number(salario);
    if (fecha_contratacion) {
      empleadoExistente.fecha_contratacion = fecha_contratacion;
    }

    await empleadoExistente.save();

    const empleadoReactivado = await Empleado.findById(empleadoExistente._id)
      .populate(POPULATE_USUARIO);

    return res.status(200).json(empleadoReactivado);
  }

  const empleado = await Empleado.create({
    usuario_id,
    cargo,
    salario: Number(salario),
    fecha_contratacion,
  });

  const empleadoCreado = await Empleado.findById(empleado._id)
    .populate(POPULATE_USUARIO);

  res.status(201).json(empleadoCreado);
};

// Buscar un empleado
export const getEmpleado = async (req, res) => {
  const empleado = await Empleado.findById(req.params.id)
    .populate(POPULATE_USUARIO);

  if (!empleado) throw notFound('Empleado no encontrado');

  res.json(empleado);
};

// Buscar empleado por id de usuario
export const getEmpleadoByUsuario = async (req, res) => {
  const empleado = await Empleado.findOne({ usuario_id: req.params.usuarioId })
    .populate(POPULATE_USUARIO);

  if (!empleado) throw notFound('El usuario no tiene registro de empleado');

  res.json(empleado);
};

// Empleado autenticado
export const getMiEmpleado = async (req, res) => {
  const empleado = await Empleado.findOne({ usuario_id: req.user.id })
    .populate(POPULATE_USUARIO);

  if (!empleado) throw notFound('El usuario no tiene registro de empleado');

  res.json(empleado);
};

// Eliminación lógica
export const deleteEmpleado = async (req, res) => {
  const empleado = await Empleado.findByIdAndUpdate(
    req.params.id,
    { estado: false },
    { new: true }
  );

  if (!empleado) throw notFound('Empleado no encontrado');

  res.json({ message: 'Empleado desactivado correctamente', empleado });
};

// Actualizar empleado
export const updateEmpleado = async (req, res) => {
  const empleado = await Empleado.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate(POPULATE_USUARIO);

  if (!empleado) throw notFound('Empleado no encontrado');

  res.json(empleado);
};
