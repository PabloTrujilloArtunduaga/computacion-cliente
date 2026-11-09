import { z } from 'zod';
import { objectId } from './common.js';

const facturaProductoItem = z.object({
  producto_id: objectId,
  cantidad: z.coerce
    .number({ error: 'La cantidad debe ser un número' })
    .int('La cantidad debe ser un entero')
    .positive('La cantidad debe ser mayor a 0'),
});

const facturaBase = z.object({
  cliente_id: objectId,
  empleado_id: objectId.optional().nullable(),
  productos: z
    .array(facturaProductoItem, { error: 'Los productos son obligatorios' })
    .min(1, 'Debe haber al menos un producto'),
  metodo_pago: z.enum(['Efectivo', 'Tarjeta', 'Transferencia'], {
    error: 'Método de pago inválido',
  }),
  estado: z
    .enum(['pendiente', 'pagada', 'cancelada'], {
      error: 'Estado de factura inválido',
    })
    .optional(),
});

export const createFacturaSchema = facturaBase;

// El cliente no elige empleado ni estado: el servidor los controla.
export const createFacturaClienteSchema = facturaBase
  .omit({ empleado_id: true, estado: true })
  .extend({
    cliente_id: objectId.optional(),
  });

export const updateFacturaSchema = facturaBase
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debes enviar al menos un campo para actualizar',
  });
