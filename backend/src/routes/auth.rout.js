import { Router } from "express";
import { register, 
         login, 
         logout,
         profile } from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();
// Se usa el post para guardar datos
// Registrar
router.post('/register', register)
// Login
router.post('/login', login)
// Logout
router.post('/logout', logout)
// Profile, se usa el metod GET para obtener el perfil
// authRequired -> Para la autenticacion de la persona.
router.get('/profile', authRequired, profile)


export default  router;
