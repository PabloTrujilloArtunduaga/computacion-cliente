import { z } from 'zod';

const fechaOpcional = z.preprocess(
  (value) => (value === '' || value === null ? undefined : value),
  z.coerce
    .date({ error: 'La fecha de contratación debe ser una fecha válida' })
    .optional()
);

export const updateEmpleadoSchema = z
  .object({
    cargo: z
      .string({ error: 'El cargo debe ser texto' })
      .trim()
      .min(2, 'El cargo debe tener al menos 2 caracteres')
      .max(50, 'El cargo no puede superar los 50 caracteres')
      .optional(),

    salario: z.coerce
      .number({ error: 'El salario debe ser un número' })
      .nonnegative('El salario no puede ser negativo')
      .optional(),

    fecha_contratacion: fechaOpcional,

    estado: z.boolean({ error: 'El estado debe ser booleano' }).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debes enviar al menos un campo para actualizar',
  });
