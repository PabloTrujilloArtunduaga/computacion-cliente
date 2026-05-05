import { Router } from "express";
import {
  getCategorias,
  createCategoria,
  getCategoria,
  deleteCategoria,
  updateCategoria
} from "../controllers/categoria.controller.js";

import { createCategoriaSchema } from "../schema/categoria.scheme.js";
import { categoriaSchema } from "../schema/update/categoriaUpdate.scheme.js";
import { validateSchema } from "../middlewares/validate.middleware.js";

import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// 🌐 VER CATEGORÍAS (todos autenticados o público si quieres)
router.get("/", getCategorias);
router.get("/:id", getCategoria);

// 🔒 SOLO ADMIN
router.post(
  "/",
  verifyToken,
  isAdmin,
  validateSchema(createCategoriaSchema),
  createCategoria
);

router.put(
  "/:id",
  verifyToken,
  isAdmin,
  validateSchema(categoriaSchema),
  updateCategoria
);

router.delete("/:id", verifyToken, isAdmin, deleteCategoria);

export default router;