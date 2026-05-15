import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/usuario.model.js";
import { TOKEN_SECRET } from "../config/config.js";

/* ================= LOGIN ================= */

export const login = async (req, res) => {
  try {

    const { usuario, password } = req.body;

    // 🔍 Buscar usuario
    const user = await User.findOne({ nombre: usuario });

    if (!user) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }

    // 🔥 VALIDAR SI LA CUENTA ESTÁ INACTIVA
    if (user.estado === false) {
      return res.status(403).json({
        mensaje: "Tu cuenta está desactivada"
      });
    }

    // 🔐 Validar contraseña
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        mensaje: "Contraseña incorrecta"
      });
    }

    // 🎟️ Crear token
    const token = jwt.sign(
      {
        id: user._id,
        rol: user.rol
      },
      TOKEN_SECRET,
      {
        expiresIn: "1d"
      }
    );

    // ✅ Respuesta
    return res.json({
      mensaje: "Login exitoso",

      token,

      rol: user.rol,

      usuario: {
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        estado: user.estado
      }
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      mensaje: "Error del servidor"
    });
  }
};


/* ================= REGISTER ================= */

export const register = async (req, res) => {
  try {

    const { usuario, email, password, rol } = req.body;

    const rolesValidos = [
      "admin",
      "empleado",
      "cliente"
    ];

    // 🔍 Validar rol
    if (rol && !rolesValidos.includes(rol)) {
      return res.status(400).json({
        mensaje: "Rol inválido"
      });
    }

    // 🔍 Verificar usuario existente
    const existeUsuario = await User.findOne({
      nombre: usuario
    });

    if (existeUsuario) {
      return res.status(400).json({
        mensaje: "El usuario ya existe"
      });
    }

    // 🔍 Verificar email existente
    const existeEmail = await User.findOne({
      email
    });

    if (existeEmail) {
      return res.status(400).json({
        mensaje: "El correo ya está registrado"
      });
    }

    // 🔐 Encriptar contraseña
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    // 👤 Crear usuario
    const nuevoUsuario = new User({
      nombre: usuario,
      email,
      password: hashedPassword,
      rol: rol || "cliente",

      // 🔥 Estado activo por defecto
      estado: true
    });

    await nuevoUsuario.save();

    // 🎟️ Crear token
    const token = jwt.sign(
      {
        id: nuevoUsuario._id,
        rol: nuevoUsuario.rol
      },
      TOKEN_SECRET,
      {
        expiresIn: "1d"
      }
    );

    // ✅ Respuesta
    return res.json({
      mensaje: "Usuario registrado correctamente",

      token,

      rol: nuevoUsuario.rol,

      usuario: {
        _id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
        estado: nuevoUsuario.estado
      }
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      mensaje: "Error del servidor"
    });
  }
};