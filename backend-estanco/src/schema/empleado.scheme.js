import { z } from "zod";

export const createEmpleadoSchema = z.object({

  usuario_id: z.string({
    required_error: "El usuario es obligatorio",
    invalid_type_error: "El usuario debe ser un ID válido",
  }),

  cargo: z.string({
    required_error: "El cargo es obligatorio",
    invalid_type_error: "El cargo debe ser texto",
  })
  .min(3, "El cargo debe tener al menos 3 caracteres")
  .max(50, "El cargo no puede superar los 50 caracteres"),

  salario: z.coerce.number({
    required_error: "El salario es obligatorio",
    invalid_type_error: "El salario debe ser un número",
  })
  .positive("El salario debe ser mayor a 0"),

  fecha_contratacion: z.coerce.date({
    required_error: "La fecha de contratación es obligatoria",
    invalid_type_error: "Debe ser una fecha válida",
  }),

  estado: z.boolean().optional(),

});