import { z } from 'zod';

export const createCategoriaSchema = z.object({
  nombre: z
    .string({ error: 'El nombre es obligatorio' })
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede superar los 50 caracteres')
    .transform((value) => value.toLowerCase()),

  descripcion: z
    .string({ error: 'La descripción debe ser texto' })
    .trim()
    .max(200, 'La descripción no puede superar los 200 caracteres')
    .optional(),

  estado: z.boolean({ error: 'El estado debe ser booleano' }).optional(),
});
