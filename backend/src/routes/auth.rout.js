import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = Router();
// Se usa el post para guardar datos
// Registrar
router.post('/register', register)
// Login
router.post('/login', login)

export default  router;
