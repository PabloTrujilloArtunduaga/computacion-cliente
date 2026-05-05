import { Router } from "express";
import {
  getProducts,
  createProduct,
  getProduct,
  deleteProduct,
  updateProduct
} from "../controllers/producto.controller.js";

import { createProductSchema } from "../schema/producto.schema.js";
import { productoSchema } from "../schema/update/productosUpdate.schema.js";
import { validateSchema } from "../middlewares/validate.middleware.js";

import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// 🟢 PUBLICO (React clientes)
router.get("/", getProducts);
router.get("/:id", getProduct);

// 🔒 SOLO ADMIN (CRUD)
router.post("/", verifyToken, isAdmin, validateSchema(createProductSchema), createProduct);

router.put("/:id", verifyToken, isAdmin, validateSchema(productoSchema), updateProduct);

router.delete("/:id", verifyToken, isAdmin, deleteProduct);

export default router;