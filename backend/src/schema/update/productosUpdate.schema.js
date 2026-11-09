import { createProductSchema } from '../producto.schema.js';

/**
 * Actualización parcial: permite cambiar solo estado, stock, etc.
 * sin exigir todos los campos del producto.
 */
export const productoSchema = createProductSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debes enviar al menos un campo para actualizar',
  });
