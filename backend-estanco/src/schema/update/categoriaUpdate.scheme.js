import { z } from "zod";

export const categoriaSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(50, "Máximo 50 caracteres")
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/, "El nombre no puede contener números"),

  descripcion: z
    .string()
    .max(200, "Máximo 200 caracteres")
    .optional(),

  estado: z.boolean().optional()
});