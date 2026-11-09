import { z } from 'zod';
import { objectId } from './common.js';

const fechaOpcional = z.preprocess(
  (value) => (value === '' || value === null ? undefined : value),
  z.coerce
    .date({ error: 'La fecha de contratación debe ser una fecha válida' })
    .optional()
);

export const createEmpleadoSchema = z.object({
  usuario_id: objectId,

  cargo: z
    .string({ error: 'El cargo es obligatorio' })
    .trim()
    .min(3, 'El cargo debe tener al menos 3 caracteres')
    .max(50, 'El cargo no puede superar los 50 caracteres'),

  salario: z.coerce
    .number({ error: 'El salario debe ser un número' })
    .nonnegative('El salario no puede ser negativo'),

  fecha_contratacion: fechaOpcional,

  estado: z.boolean({ error: 'El estado debe ser booleano' }).optional(),
});
