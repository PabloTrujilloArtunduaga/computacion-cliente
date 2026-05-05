import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config/config.js";

export const verifyToken = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({ mensaje: "Token requerido" });
  }

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ mensaje: "Token inválido" });
  }
};

export const isAdmin = (req, res, next) => {
  console.log("ROL:", req.user.rol);

  if (req.user.rol !== "admin") {
    return res.status(403).json({ mensaje: "Solo admin" });
  }
  next();
};

export const isEmpleado = (req, res, next) => {
  if (!["admin", "empleado"].includes(req.user.rol)) {
    return res.status(403).json({ mensaje: "Solo empleado o admin" });
  }
  next();
};