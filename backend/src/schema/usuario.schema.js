import { z } from 'zod';
import {
  objectId,
  ROLE_ENUM,
  PASSWORD_REGEX,
  PASSWORD_MESSAGE,
} from './common.js';

export const createUserSchema = z.object({
  nombre: z
    .string({ error: 'El nombre es obligatorio' })
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres'),

  email: z
    .string({ error: 'El email es obligatorio' })
    .trim()
    .toLowerCase()
    .email('El email no es válido'),

  password: z
    .string({ error: 'La contraseña es obligatoria' })
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña es demasiado larga')
    .regex(PASSWORD_REGEX, PASSWORD_MESSAGE),

  rol: ROLE_ENUM.optional(),

  estado: z.boolean({ error: 'El estado debe ser booleano' }).optional(),
});

export const loginSchema = z.object({
  usuario: z
    .string({ error: 'El usuario es obligatorio' })
    .trim()
    .min(2, 'El usuario es obligatorio'),
  password: z
    .string({ error: 'La contraseña es obligatoria' })
    .min(1, 'La contraseña es obligatoria'),
});

export const registerSchema = z.object({
  usuario: z
    .string({ error: 'El usuario es obligatorio' })
    .trim()
    .min(2, 'El usuario debe tener al menos 2 caracteres')
    .max(50, 'El usuario no puede tener más de 50 caracteres'),

  email: z
    .string({ error: 'El email es obligatorio' })
    .trim()
    .toLowerCase()
    .email('El email no es válido'),

  password: z
    .string({ error: 'La contraseña es obligatoria' })
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña es demasiado larga')
    .regex(PASSWORD_REGEX, PASSWORD_MESSAGE),

  // El registro público siempre crea clientes; se acepta por compatibilidad
  // pero el controlador lo ignora.
  rol: ROLE_ENUM.optional(),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string({ error: 'El correo electrónico es obligatorio' })
    .trim()
    .toLowerCase()
    .email('Correo electrónico inválido'),
});

export const updateUserSchema = z
  .object({
    nombre: z
      .string({ error: 'El nombre debe ser texto' })
      .trim()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(50, 'El nombre es demasiado largo')
      .optional(),

    email: z
      .string({ error: 'El email debe ser texto' })
      .trim()
      .toLowerCase()
      .email('Email inválido')
      .optional(),

    password: z
      .string({ error: 'La contraseña debe ser texto' })
      .min(6, 'Mínimo 6 caracteres')
      .max(100)
      .regex(PASSWORD_REGEX, PASSWORD_MESSAGE)
      .optional(),

    rol: ROLE_ENUM.optional(),

    estado: z.boolean({ error: 'El estado debe ser booleano' }).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debes enviar al menos un campo para actualizar',
  });

// Exportado por compatibilidad con imports existentes
export { objectId };
