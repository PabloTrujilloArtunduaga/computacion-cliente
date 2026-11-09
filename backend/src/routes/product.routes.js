import { Router } from 'express';
import {
  getProducts,
  createProduct,
  getProduct,
  deleteProduct,
  updateProduct,
} from '../controllers/producto.controller.js';

import { createProductSchema } from '../schema/producto.schema.js';
import { productoSchema } from '../schema/update/productosUpdate.schema.js';
import { validateSchema } from '../middlewares/validate.middleware.js';
import { validateObjectId } from '../middlewares/validateObjectId.middleware.js';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Público (catálogo)
router.get('/', getProducts);
router.get('/:id', validateObjectId(), getProduct);

// Solo admin
router.post('/', verifyToken, isAdmin, validateSchema(createProductSchema), createProduct);

router.put(
  '/:id',
  verifyToken,
  isAdmin,
  validateObjectId(),
  validateSchema(productoSchema),
  updateProduct
);

router.delete('/:id', verifyToken, isAdmin, validateObjectId(), deleteProduct);

export default router;
