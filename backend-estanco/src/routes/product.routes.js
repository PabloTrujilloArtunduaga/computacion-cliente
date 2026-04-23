import { Router } from "express";
import {
  getProducts,
  createProduct,
  getProduct,
  deleteProduct,
  updateProduct
} from "../controllers/producto.controller.js";
import { createProductSchema } from '../schema/producto.schema.js'
import { validateSchema } from '../middlewares/validate.middleware.js'
import { productoSchema } from '../schema/update/productosUpdate.schema.js'

const router = Router();

router.get("/products", getProducts);
router.post("/products", validateSchema(createProductSchema), createProduct);
router.get("/products/:id", getProduct);
router.delete("/products/:id", deleteProduct);
router.put("/products/:id", validateSchema(productoSchema), updateProduct);

export default router;