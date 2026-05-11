import { z } from "zod";

export const createCategoriaSchema = z.object({

  nombre: z.string({
    required_error: "El nombre es obligatorio",
    invalid_type_error: "El nombre debe ser texto",
  })
  .min(3, "El nombre debe tener al menos 3 caracteres")
  .max(50, "El nombre no puede superar los 50 caracteres")
  .transform((val) => val.toLowerCase().trim()),

  descripcion: z.string({
    invalid_type_error: "La descripción debe ser texto",
  })
  .max(200, "La descripción no puede superar los 200 caracteres")
  .optional(),

  estado: z.boolean().optional(),

});