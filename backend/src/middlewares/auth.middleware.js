import { verifyAccessToken } from '../lib/jwt.js';
import User from '../models/usuario.model.js';

/**
 * Verifica el token Bearer, comprueba que el usuario siga activo
 * y deja sus datos en req.user.
 */
export const verifyToken = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  try {
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.id).select('_id nombre email rol estado');

    if (!user) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    if (!user.estado) {
      return res.status(403).json({ message: 'La cuenta está desactivada' });
    }

    req.user = {
      id: String(user._id),
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
    };

    next();
  } catch (error) {
    const expired = error?.name === 'TokenExpiredError';
    return res.status(401).json({
      message: expired ? 'Sesión expirada' : 'Token inválido',
    });
  }
};

/** Exige uno de los roles indicados. Debe usarse después de verifyToken. */
export const hasRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'No autenticado' });
  }

  if (!roles.includes(req.user.rol)) {
    return res.status(403).json({ message: 'No tienes permisos para esta acción' });
  }

  next();
};

export const isAdmin = hasRole('admin');
export const isEmpleado = hasRole('admin', 'empleado');

/** Permite al propio cliente o a un empleado/admin. */
export const isSelfOrStaff = (param = 'clienteId') => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'No autenticado' });
  }

  const ownerId = req.params[param];
  const isStaff = ['admin', 'empleado'].includes(req.user.rol);

  if (!isStaff && String(req.user.id) !== String(ownerId)) {
    return res.status(403).json({ message: 'No puedes acceder a estos datos' });
  }

  next();
};
