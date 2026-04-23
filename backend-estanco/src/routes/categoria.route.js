import { Router } from "express";
import {
  getCategoria,
  createCategoria,
  getCategorias,
  deleteCategoria,
  updateCategoria
} from "../controllers/categoria.controller.js";
import { createCategoriaSchema } from '../schema/categoria.scheme.js'
import { validateSchema } from '../middlewares/validate.middleware.js'
const router = Router();

router.get("/categories", getCategorias);
router.post("/category", validateSchema(createCategoriaSchema), createCategoria);
router.get("/category/:id", getCategoria);
router.delete("/category/:id", deleteCategoria);
router.put("/category/:id", updateCategoria);

export default router;