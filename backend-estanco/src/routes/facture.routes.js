import { Router } from "express";
import {
  getFacturas,
  createFactura,
  getFactura,
  deleteFactura,
} from "../controllers/factura.controller.js";

const router = Router();

router.get("/facturas", getFacturas);
router.post("/facturas", createFactura);
router.get("/facturas/:id", getFactura);
router.delete("/facturas/:id", deleteFactura);

export default router;