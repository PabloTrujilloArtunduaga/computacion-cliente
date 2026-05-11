import { z } from "zod";
import mongoose from "mongoose";

const objectId = z.string().refine(
  (id) => mongoose.Types.ObjectId.isValid(id),
  { message: "ID de categoría inválido" }
);

export const productoSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, "El nombre debe tener mínimo 3 caracteres")
    .max(100, "El nombre es muy largo"),

  descripcion: z
    .string()
    .trim()
    .min(5, "La descripción debe tener mínimo 5 caracteres")
    .optional()
    .or(z.literal("")),

  precio: z.coerce
    .number()
    .positive("El precio debe ser mayor a 0"),

  stock: z.coerce
    .number()
    .int("El stock debe ser entero")
    .min(0, "El stock no puede ser negativo"),

  categoria_id: objectId,

  codigo_barras: z
    .string()
    .trim()
    .min(5, "Código de barras muy corto")
    .optional()
    .or(z.literal("")),

  imagen: z
    .string()
    .url("La imagen debe ser una URL válida")
    .optional()
    .or(z.literal("")),

  estado: z.boolean().optional()
});