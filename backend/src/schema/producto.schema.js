import { z } from 'zod';
import { objectId } from './common.js';

export const createProductSchema = z.object({
  nombre: z
    .string({ error: 'El nombre es obligatorio' })
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es demasiado largo'),

  descripcion: z
    .string({ error: 'La descripción debe ser texto' })
    .trim()
    .max(500, 'La descripción es demasiado larga')
    .optional(),

  precio: z.coerce
    .number({ error: 'El precio debe ser un número' })
    .positive('El precio debe ser mayor a 0'),

  stock: z.coerce
    .number({ error: 'El stock debe ser un número' })
    .int('El stock debe ser un número entero')
    .nonnegative('El stock no puede ser negativo'),

  categoria_id: objectId,

  codigo_barras: z
    .string({ error: 'El código de barras debe ser texto' })
    .trim()
    .max(100)
    .optional(),

  imagen: z
    .string({ error: 'La imagen debe ser texto' })
    .trim()
    .refine((value) => !value || /^https?:\/\/.+/.test(value), {
      message: 'La imagen debe ser una URL válida',
    })
    .optional(),

  estado: z.boolean({ error: 'El estado debe ser booleano' }).optional(),
});
