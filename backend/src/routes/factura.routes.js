import { Router } from 'express';

import {
  getFacturas,
  createFactura,
  getFactura,
  deleteFactura,
  createFacturaCliente,
  getFacturasByCliente,
  updateFactura,
  getVentasPorMes,
} from '../controllers/factura.controller.js';

import {
  createFacturaSchema,
  createFacturaClienteSchema,
  updateFacturaSchema,
} from '../schema/factura.schema.js';

import { validateSchema } from '../middlewares/validate.middleware.js';
import { validateObjectId } from '../middlewares/validateObjectId.middleware.js';
import {
  verifyToken,
  isEmpleado,
  isSelfOrStaff,
} from '../middlewares/auth.middleware.js';

const router = Router();

// ======================================
// RUTAS ESPECÍFICAS (antes de /:id)
// ======================================

router.get('/ventas-mes', verifyToken, isEmpleado, getVentasPorMes);

// Facturas del cliente autenticado (o staff)
router.get(
  '/cliente/:clienteId',
  verifyToken,
  validateObjectId('clienteId'),
  isSelfOrStaff('clienteId'),
  getFacturasByCliente
);

// Compra del cliente autenticado
router.post(
  '/cliente',
  verifyToken,
  validateSchema(createFacturaClienteSchema),
  createFacturaCliente
);

// ======================================
// FACTURAS ADMIN / EMPLEADO
// ======================================

router.get('/', verifyToken, isEmpleado, getFacturas);

router.post(
  '/',
  verifyToken,
  isEmpleado,
  validateSchema(createFacturaSchema),
  createFactura
);

router.get('/:id', verifyToken, isEmpleado, validateObjectId(), getFactura);

router.put(
  '/:id',
  verifyToken,
  isEmpleado,
  validateObjectId(),
  validateSchema(updateFacturaSchema),
  updateFactura
);

router.delete('/:id', verifyToken, isEmpleado, validateObjectId(), deleteFactura);

export default router;
