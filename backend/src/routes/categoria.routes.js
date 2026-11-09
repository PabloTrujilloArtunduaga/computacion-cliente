import { Router } from 'express';
import {
  getCategorias,
  createCategoria,
  getCategoria,
  deleteCategoria,
  updateCategoria,
} from '../controllers/categoria.controller.js';

import { createCategoriaSchema } from '../schema/categoria.schema.js';
import { categoriaSchema } from '../schema/update/categoriaUpdate.schema.js';
import { validateSchema } from '../middlewares/validate.middleware.js';
import { validateObjectId } from '../middlewares/validateObjectId.middleware.js';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Público
router.get('/', getCategorias);
router.get('/:id', validateObjectId(), getCategoria);

// Solo admin
router.post('/', verifyToken, isAdmin, validateSchema(createCategoriaSchema), createCategoria);

router.put(
  '/:id',
  verifyToken,
  isAdmin,
  validateObjectId(),
  validateSchema(categoriaSchema),
  updateCategoria
);

router.delete('/:id', verifyToken, isAdmin, validateObjectId(), deleteCategoria);

export default router;
