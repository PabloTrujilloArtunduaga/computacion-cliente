import { Router } from "express";
import {
  getEmpleados,
  createEmpleado,
  getEmpleado,
  deleteEmpleado,
  updateEmpleado
} from "../controllers/empleado.controller.js";
import { createEmpleadoSchema } from '../schema/empleado.scheme.js'
import { updateEmpleadoSchema } from '../schema/update/empleadoUpdate.schema.js'
import { validateSchema } from '../middlewares/validate.middleware.js'



const router = Router();

router.get("/empleados", getEmpleados);
router.post("/empleados", validateSchema(createEmpleadoSchema), createEmpleado);
router.get("/empleados/:id", getEmpleado);
router.delete("/empleados/:id", deleteEmpleado);
router.put("/empleados/:id", validateSchema(updateEmpleadoSchema), updateEmpleado);

export default router;