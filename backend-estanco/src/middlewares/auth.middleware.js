import jwt from "jsonwebtoken";

const SECRET = "secreto123";

// 🔐 Verificar token
export const verifyToken = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({ mensaje: "Token requerido" });
  }

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // { id, rol }
    next();
  } catch (error) {
    return res.status(403).json({ mensaje: "Token inválido" });
  }
};

// 🔒 SOLO ADMIN
export const isAdmin = (req, res, next) => {
  if (req.user.rol !== "admin") {
    return res.status(403).json({ mensaje: "Solo admin" });
  }
  next();
};

// 👷 ADMIN + EMPLEADO
export const isEmpleado = (req, res, next) => {
  if (!["admin", "empleado"].includes(req.user.rol)) {
    return res.status(403).json({ mensaje: "Solo empleado o admin" });
  }
  next();
};