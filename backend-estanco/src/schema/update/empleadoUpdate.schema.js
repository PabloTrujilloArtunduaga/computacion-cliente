import { z } from "zod";

export const updateEmpleadoSchema = z.object({
  cargo: z.string().min(2).optional(),

  salario: z.coerce.number().positive().optional(),

  fecha_contratacion: z.string().optional(),
});