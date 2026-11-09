import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import User from '../models/usuario.model.js';
import { createAccessToken } from '../lib/jwt.js';
import { config } from '../config/config.js';
import { conflict, unauthorized } from '../utils/errors.js';

const SALT_ROUNDS = 10;

const buildAuthResponse = (user, token) => ({
  mensaje: 'Login exitoso',
  token,
  rol: user.rol,
  usuario: {
    _id: user._id,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol,
    estado: user.estado,
  },
});

/* ================= LOGIN ================= */

export const login = async (req, res) => {
  const { usuario, password } = req.body;

  const user = await User.findOne({ nombre: usuario }).select('+password');

  // Mensaje genérico para no revelar si el usuario existe.
  if (!user) throw unauthorized('Credenciales inválidas');

  if (!user.estado) {
    return res.status(403).json({ mensaje: 'Tu cuenta está desactivada' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw unauthorized('Credenciales inválidas');

  const token = await createAccessToken({
    id: String(user._id),
    rol: user.rol,
  });

  return res.json(buildAuthResponse(user, token));
};

/* ================= REGISTER (público) ================= */

export const register = async (req, res) => {
  const { usuario, email, password } = req.body;

  const [existeUsuario, existeEmail] = await Promise.all([
    User.findOne({ nombre: usuario }),
    User.findOne({ email }),
  ]);

  if (existeUsuario) throw conflict('El usuario ya existe');
  if (existeEmail) throw conflict('El correo ya está registrado');

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // El registro público SIEMPRE crea clientes.
  const nuevoUsuario = await User.create({
    nombre: usuario,
    email,
    password: hashedPassword,
    rol: 'cliente',
    estado: true,
  });

  const token = await createAccessToken({
    id: String(nuevoUsuario._id),
    rol: nuevoUsuario.rol,
  });

  return res.status(201).json({
    mensaje: 'Usuario registrado correctamente',
    token,
    rol: nuevoUsuario.rol,
    usuario: {
      _id: nuevoUsuario._id,
      nombre: nuevoUsuario.nombre,
      email: nuevoUsuario.email,
      rol: nuevoUsuario.rol,
      estado: nuevoUsuario.estado,
    },
  });
};

/* ================= FORGOT PASSWORD ================= */

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  // Responder siempre igual para no revelar si el email existe.
  if (user) {
    const resetToken = crypto.randomBytes(32).toString('hex');

    // TODO: persistir el hash del token y enviarlo por email.
    if (!config.isProduction) {
      console.log(`🔑 Token de recuperación para ${email}: ${resetToken}`);
    }
  }

  return res.json({
    mensaje: 'Si el correo está registrado, recibirás un enlace de recuperación',
  });
};
