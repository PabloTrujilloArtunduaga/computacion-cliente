import { z } from "zod";

// Validar datos en el backend
export const createProductSchema = z.object({
  nombre: z.string({
    required_error: "El nombre es obligatorio",
    invalid_type_error: "El nombre debe ser texto",
  }).min(2, "El nombre debe tener al menos 2 caracteres"),

  descripcion: z.string().optional(),

  precio: z.coerce.number({
    required_error: "El precio es obligatorio",
    invalid_type_error: "El precio debe ser un número",
  }).positive("El precio debe ser mayor a 0"),

  stock: z.coerce.number({
    required_error: "El stock es obligatorio",
    invalid_type_error: "El stock debe ser un número",
  }).int("El stock debe ser un número entero").nonnegative("El stock no puede ser negativo"),

  categoria_id: z.string({
    required_error: "La categoría es obligatoria",
    invalid_type_error: "La categoría debe ser un ID válido",
  }),

  codigo_barras: z.string().optional(),

  imagen: z.string().url("La imagen debe ser una URL válida").optional(),

  estado: z.boolean().optional(),
});