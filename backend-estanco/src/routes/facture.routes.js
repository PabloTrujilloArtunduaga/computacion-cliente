import { Router } from "express";
import {
  getFacturas,
  createFactura,
  getFactura,
  deleteFactura,
} from "../controllers/factura.controller.js";
import { createFacturaSchema } from '../schema/factura.scheme.js'
import { validateSchema } from '../middlewares/validate.middleware.js'
const router = Router();

router.get("/facturas", getFacturas);
router.post("/facturas", validateSchema(createFacturaSchema), createFactura);
router.get("/facturas/:id", getFactura);
router.delete("/facturas/:id", deleteFactura);

export default router;