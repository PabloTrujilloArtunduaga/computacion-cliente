import { z } from "zod";

export const createUserSchema = z.object({
  nombre: z.string({
    required_error: "El nombre es obligatorio",
    invalid_type_error: "El nombre debe ser texto",
  })
  .min(2, "El nombre debe tener al menos 2 caracteres")
  .max(50, "El nombre no puede tener más de 50 caracteres"),

  email: z.string({
    required_error: "El email es obligatorio",
    invalid_type_error: "El email debe ser texto",
  })
  .email("El email no es válido"),

  password: z.string({
    required_error: "La contraseña es obligatoria",
    invalid_type_error: "La contraseña debe ser texto",
  })
  .min(6, "La contraseña debe tener al menos 6 caracteres")
  .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
  .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
  .regex(/[0-9]/, "Debe contener al menos un número")
  .regex(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial"),

  rol: z.enum(["admin", "empleado", "cliente"], {
    errorMap: () => ({ message: "Rol inválido" }),
  }).optional(),

  estado: z.boolean().optional(),
});