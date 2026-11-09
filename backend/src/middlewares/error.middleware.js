import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { HttpError } from '../utils/errors.js';
import { config } from '../config/config.js';

/** Convierte errores conocidos en respuestas HTTP consistentes. */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (err, _req, res, _next) => {
  // Errores de validación de Zod
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Error de validación',
      error: err.issues.map((issue) => ({
        field: issue.path.join('.') || 'body',
        message: issue.message,
      })),
    });
  }

  // Errores de Mongoose
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      message: 'Datos inválidos',
      error: Object.values(err.errors).map((item) => ({
        field: item.path,
        message: item.message,
      })),
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      message: `Identificador inválido: ${err.value}`,
    });
  }

  if (err?.code === 11000) {
    return res.status(409).json({
      message: 'Ya existe un registro con esos datos',
      error: Object.keys(err.keyValue || {}),
    });
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.message,
      ...(err.details ? { error: err.details } : {}),
    });
  }

  // Body JSON mal formado
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'JSON inválido en la petición' });
  }

  if (err.status && err.status < 500) {
    return res.status(err.status).json({ message: err.message });
  }

  // Error inesperado: registrar completo, no filtrar detalles en producción
  console.error('❌ Error global:', err);

  return res.status(500).json({
    message: 'Error interno del servidor',
    ...(config.isProduction ? {} : { error: err.message }),
  });
};
