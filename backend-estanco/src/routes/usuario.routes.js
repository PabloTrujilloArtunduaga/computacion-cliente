import { Router } from "express";
import {
  getUsers,
  createUser,
  getUser,
  deleteUser,
  updateUser
} from "../controllers/usuario.controller.js";

import { createUserSchema } from "../schema/usuario.scheme.js";
import { updateUserSchema } from "../schema/update/usuarioUpdate.schema.js";
import { validateSchema } from "../middlewares/validate.middleware.js";

import { verifyToken, isAdmin, isEmpleado } from "../middlewares/auth.middleware.js";

const router = Router();

// 👀 ADMIN + EMPLEADO pueden ver usuarios
router.get("/", verifyToken, isEmpleado, getUsers);
router.get("/:id", verifyToken, isEmpleado, getUser);

// 🔒 SOLO ADMIN
router.post(
  "/",
  verifyToken,
  isAdmin,
  validateSchema(createUserSchema),
  createUser
);

router.put(
  "/:id",
  verifyToken,
  isAdmin,
  validateSchema(updateUserSchema),
  updateUser
);

router.delete("/:id", verifyToken, isAdmin, deleteUser);

export default router;