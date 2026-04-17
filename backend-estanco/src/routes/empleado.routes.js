import { Router } from "express";
import {
  getEmpleados,
  createEmpleado,
  getEmpleado,
  deleteEmpleado,
  updateEmpleado
} from "../controllers/empleado.controller.js";

const router = Router();

router.get("/empleados", getEmpleados);
router.post("/empleados", createEmpleado);
router.get("/empleados/:id", getEmpleado);
router.delete("/empleados/:id", deleteEmpleado);
router.put("/empleados/:id", updateEmpleado);

export default router;