import { Router } from 'express';
import {
  getUsers,
  createUser,
  getUser,
  deleteUser,
  updateUser,
} from '../controllers/usuario.controller.js';

import { createUserSchema, updateUserSchema } from '../schema/usuario.schema.js';
import { validateSchema } from '../middlewares/validate.middleware.js';
import { validateObjectId } from '../middlewares/validateObjectId.middleware.js';
import { verifyToken, isAdmin, isEmpleado } from '../middlewares/auth.middleware.js';

const router = Router();

// Admin + empleado pueden consultar usuarios
router.get('/', verifyToken, isEmpleado, getUsers);
router.get('/:id', verifyToken, isEmpleado, validateObjectId(), getUser);

// Solo admin
router.post('/', verifyToken, isAdmin, validateSchema(createUserSchema), createUser);

router.put(
  '/:id',
  verifyToken,
  isAdmin,
  validateObjectId(),
  validateSchema(updateUserSchema),
  updateUser
);

router.delete('/:id', verifyToken, isAdmin, validateObjectId(), deleteUser);

export default router;
