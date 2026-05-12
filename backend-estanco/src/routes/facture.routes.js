import { Router } from "express";

import {
  getFacturas,
  createFactura,
  getFactura,
  deleteFactura,
  createFacturaCliente,
  getFacturasByCliente,
} from "../controllers/factura.controller.js";

import { createFacturaSchema } from "../schema/factura.scheme.js";

import { validateSchema } from "../middlewares/validate.middleware.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

// ======================================
// FACTURAS ADMIN
// ======================================

router.get("/", getFacturas);

router.post(
  "/",
  validateSchema(createFacturaSchema),
  createFactura
);

router.get("/:id", getFactura);

router.delete("/:id", deleteFactura);

// ======================================
// FACTURAS CLIENTE
// ======================================

router.post(
  "/cliente",
  verifyToken,
  createFacturaCliente
);

router.get(
  "/cliente/:clienteId",
  verifyToken,
  getFacturasByCliente
);

export default router;