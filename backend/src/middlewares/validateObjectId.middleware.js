import mongoose from 'mongoose';
import { badRequest } from '../utils/errors.js';

/** Valida que el parámetro :id sea un ObjectId antes de llegar a Mongo. */
export const validateObjectId = (param = 'id') => (req, _res, next) => {
  const value = req.params[param];

  if (!mongoose.Types.ObjectId.isValid(value)) {
    return next(badRequest(`Identificador inválido: ${value}`));
  }

  next();
};
