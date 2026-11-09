import { Router } from 'express';
import { login, register, forgotPassword } from '../controllers/user.controller.js';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
} from '../schema/usuario.schema.js';
import { validateSchema } from '../middlewares/validate.middleware.js';

const router = Router();

router.post('/login', validateSchema(loginSchema), login);
router.post('/register', validateSchema(registerSchema), register);
router.post('/forgot-password', validateSchema(forgotPasswordSchema), forgotPassword);

export default router;
