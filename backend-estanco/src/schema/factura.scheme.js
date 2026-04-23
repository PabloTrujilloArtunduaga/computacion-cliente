import { z } from "zod";

export const createFacturaSchema = z.object({

  cliente_id: z.string({
    required_error: "El cliente es obligatorio",
    invalid_type_error: "El cliente debe ser un ID válido",
  }),

  empleado_id: z.string({
    required_error: "El empleado es obligatorio",
    invalid_type_error: "El empleado debe ser un ID válido",
  }),

  productos: z.array(
    z.object({
      producto_id: z.string({
        required_error: "El producto es obligatorio",
        invalid_type_error: "Debe ser un ID válido",
      }),

      nombre: z.string({
        required_error: "El nombre del producto es obligatorio",
      }),

      cantidad: z.coerce.number({
        required_error: "La cantidad es obligatoria",
      })
      .int("La cantidad debe ser un número entero")
      .positive("La cantidad debe ser mayor a 0"),

      precio_unitario: z.coerce.number({
        required_error: "El precio unitario es obligatorio",
      })
      .positive("El precio debe ser mayor a 0"),

      subtotal: z.coerce.number({
        required_error: "El subtotal es obligatorio",
      })
      .positive("El subtotal debe ser mayor a 0"),
    })
  )
  .min(1, "Debe haber al menos un producto en la factura"),

  total: z.coerce.number({
    required_error: "El total es obligatorio",
  })
  .positive("El total debe ser mayor a 0"),

  metodo_pago: z.enum(["efectivo", "tarjeta"], {
    errorMap: () => ({ message: "Método de pago inválido" }),
  }),

  estado: z.enum(["pendiente", "pagada", "cancelada"], {
    errorMap: () => ({ message: "Estado inválido" }),
  }).optional(),

});