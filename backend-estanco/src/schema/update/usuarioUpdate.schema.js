import { z } from "zod";

export const updateUserSchema = z.object({
  nombre: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre es muy largo")
    .optional(),

  email: z.string()
    .email("Email inválido")
    .toLowerCase()
    .optional(),

  password: z.string()
    .min(6, "Mínimo 6 caracteres")
    .max(100)
    .regex(/[A-Z]/, "Debe tener al menos una mayúscula")
    .regex(/[a-z]/, "Debe tener minúscula")
    .regex(/[0-9]/, "Debe tener un número")
    .regex(/[@$!%*?&]/, "Debe tener un símbolo")
    .optional(),

  rol: z.enum(["admin", "empleado", "cliente"], {
    errorMap: () => ({ message: "Rol inválido" }),
  }).optional(),

  estado: z.boolean().optional(),
});