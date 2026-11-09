import bcrypt from 'bcrypt';
import User from '../models/usuario.model.js';
import Empleado from '../models/empleado.model.js';
import { badRequest, notFound } from '../utils/errors.js';

const SALT_ROUNDS = 10;

// Obtener usuarios (por defecto todos, para poder gestionar activos e inactivos)
export const getUsers = async (req, res) => {
  const filtro = {};

  if (req.query.estado === 'true') filtro.estado = true;
  if (req.query.estado === 'false') filtro.estado = false;
  if (req.query.rol) filtro.rol = req.query.rol;

  const users = await User.find(filtro).sort({ createdAt: -1 });
  res.json(users);
};

// Crear usuario
export const createUser = async (req, res) => {
  const { nombre, email, password, rol, estado } = req.body;

  const existe = await User.findOne({ email });
  if (existe) throw badRequest('El correo electrónico ya está registrado');

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    nombre,
    email,
    password: hashedPassword,
    rol: rol || 'cliente',
    estado: estado !== undefined ? estado : true,
  });

  res.status(201).json(user);
};

// Obtener un usuario por ID
export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) throw notFound('Usuario no encontrado');

  res.json(user);
};

// Eliminación lógica
export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { estado: false },
    { new: true }
  );

  if (!user) throw notFound('Usuario no encontrado');

  // Desactivar también su registro de empleado, si existe.
  await Empleado.updateOne({ usuario_id: user._id }, { estado: false });

  res.json({ message: 'Usuario desactivado correctamente', user });
};

// Actualizar usuario
export const updateUser = async (req, res) => {
  const { nombre, email, password, rol, estado } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) throw notFound('Usuario no encontrado');

  if (email && email !== user.email) {
    const existe = await User.findOne({ email, _id: { $ne: user._id } });
    if (existe) throw badRequest('El correo electrónico ya está registrado');
  }

  if (nombre !== undefined) user.nombre = nombre;
  if (email !== undefined) user.email = email;
  if (rol !== undefined) user.rol = rol;
  if (estado !== undefined) user.estado = estado;

  if (password !== undefined && password.trim() !== '') {
    user.password = await bcrypt.hash(password, SALT_ROUNDS);
  }

  await user.save();

  if (estado === false) {
    await Empleado.updateOne({ usuario_id: user._id }, { estado: false });
  }

  res.json(user);
};
