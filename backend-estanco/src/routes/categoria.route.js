import { Router } from "express";
import {
  getCategoria,
  createCategoria,
  getCategorias,
  deleteCategoria,
  updateCategoria
} from "../controllers/categoria.controller.js";

const router = Router();

router.get("/categories", getCategorias);
router.post("/category", createCategoria);
router.get("/category/:id", getCategoria);
router.delete("/category/:id", deleteCategoria);
router.put("/category/:id", updateCategoria);

export default router;