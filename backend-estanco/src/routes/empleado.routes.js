import { Router } from "express";
import {
  getEmpleados,
  createEmpleado,
  getEmpleado,
  deleteEmpleado,
  updateEmpleado
} from "../controllers/empleado.controller.js";

import { createEmpleadoSchema } from "../schema/empleado.scheme.js";
import { updateEmpleadoSchema } from "../schema/update/empleadoUpdate.schema.js";
import { validateSchema } from "../middlewares/validate.middleware.js";

import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// 🔒 SOLO ADMIN
router.get("/", verifyToken, isAdmin, getEmpleados);

router.post(
  "/",
  verifyToken,
  isAdmin,
  validateSchema(createEmpleadoSchema),
  createEmpleado
);

router.get("/:id", verifyToken, isAdmin, getEmpleado);

router.put(
  "/:id",
  verifyToken,
  isAdmin,
  validateSchema(updateEmpleadoSchema),
  updateEmpleado
);

router.delete("/:id", verifyToken, isAdmin, deleteEmpleado);

export default router;