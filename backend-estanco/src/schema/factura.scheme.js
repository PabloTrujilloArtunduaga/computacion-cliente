import { z } from "zod";

export const createFacturaSchema = z.object({

  cliente_id: z.string({
    required_error: "El cliente es obligatorio",
    invalid_type_error: "El cliente debe ser un ID válido",
  }),

  // ✅ OPCIONAL
  empleado_id: z.string({
    invalid_type_error: "El empleado debe ser un ID válido",
  }).optional().nullable(),

  productos: z.array(

    z.object({

      producto_id: z.string({
        required_error: "El producto es obligatorio",
        invalid_type_error: "Debe ser un ID válido",
      }),

      nombre: z.string({
        required_error: "El nombre es obligatorio",
      }),

      cantidad: z.coerce.number({
        required_error: "La cantidad es obligatoria",
      })
      .int("Debe ser entero")
      .positive("Debe ser mayor a 0"),

      precio_unitario: z.coerce.number({
        required_error: "El precio es obligatorio",
      })
      .positive("Debe ser mayor a 0"),

      subtotal: z.coerce.number({
        required_error: "El subtotal es obligatorio",
      })
      .positive("Debe ser mayor a 0"),

    })

  )
  .min(1, "Debe haber al menos un producto"),

  total: z.coerce.number({
    required_error: "El total es obligatorio",
  })
  .positive("El total debe ser mayor a 0"),

  // ✅ ENUM IGUAL A MONGOOSE
  metodo_pago: z.enum([
    "Efectivo",
    "Tarjeta",
    "Transferencia"
  ]),

  estado: z.enum([
    "pendiente",
    "pagada",
    "cancelada"
  ]).optional(),

});