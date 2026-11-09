import { Router } from 'express';
import {
  getEmpleados,
  createEmpleado,
  getEmpleado,
  getEmpleadoByUsuario,
  getMiEmpleado,
  deleteEmpleado,
  updateEmpleado,
} from '../controllers/empleado.controller.js';

import { createEmpleadoSchema } from '../schema/empleado.schema.js';
import { updateEmpleadoSchema } from '../schema/update/empleadoUpdate.schema.js';
import { validateSchema } from '../middlewares/validate.middleware.js';
import { validateObjectId } from '../middlewares/validateObjectId.middleware.js';
import { verifyToken, isAdmin, isEmpleado } from '../middlewares/auth.middleware.js';

const router = Router();

// Empleado autenticado (/me debe ir antes que /:id)
router.get('/me', verifyToken, isEmpleado, getMiEmpleado);

// Solo admin
router.get('/', verifyToken, isAdmin, getEmpleados);

router.post(
  '/',
  verifyToken,
  isAdmin,
  validateSchema(createEmpleadoSchema),
  createEmpleado
);

router.get(
  '/usuario/:usuarioId',
  verifyToken,
  isAdmin,
  validateObjectId('usuarioId'),
  getEmpleadoByUsuario
);

router.get('/:id', verifyToken, isAdmin, validateObjectId(), getEmpleado);

router.put(
  '/:id',
  verifyToken,
  isAdmin,
  validateObjectId(),
  validateSchema(updateEmpleadoSchema),
  updateEmpleado
);

router.delete('/:id', verifyToken, isAdmin, validateObjectId(), deleteEmpleado);

export default router;
