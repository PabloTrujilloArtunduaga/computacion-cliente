import { z } from 'zod';
import { createCategoriaSchema } from '../categoria.schema.js';

export const categoriaSchema = createCategoriaSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debes enviar al menos un campo para actualizar',
  });
