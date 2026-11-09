import { z } from 'zod';
import mongoose from 'mongoose';

export const objectId = z
  .string({ error: 'El identificador es obligatorio' })
  .refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: 'El identificador no es válido',
  });

export const idParam = z.object({
  id: objectId,
});

export const ROLE_ENUM = z.enum(['admin', 'empleado', 'cliente'], {
  error: 'Rol inválido',
});

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;
export const PASSWORD_MESSAGE =
  'La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un símbolo';
