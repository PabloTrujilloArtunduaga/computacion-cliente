import User from '../models/usuario.model.js';
import bcrypt from 'bcrypt';
/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { usuario, password } = req.body;

    const user = await User.findOne({ nombre: usuario });

    if (!user) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // 🔐 COMPARAR HASH
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    return res.json({
      mensaje: "Login exitoso",
      rol: user.rol,
      id: user._id
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensaje: "Error del servidor" });
  }
};


/* ================= REGISTER ================= */
export const register = async (req, res) => {
  try {
    const { usuario, email, password, rol } = req.body;

    const rolesValidos = ["admin", "empleado", "cliente"];

    if (rol && !rolesValidos.includes(rol)) {
      return res.status(400).json({ mensaje: "Rol inválido" });
    }

    const existeUsuario = await User.findOne({ nombre: usuario });
    const existeEmail = await User.findOne({ email });

    if (existeUsuario) {
      return res.status(400).json({ mensaje: "El usuario ya existe" });
    }

    if (existeEmail) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    // 🔐 HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoUsuario = new User({
      nombre: usuario,
      email,
      password: hashedPassword, // 🔥 guardamos hash
      rol: rol || "cliente"
    });

    await nuevoUsuario.save();

    return res.json({
      mensaje: "Usuario registrado correctamente"
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensaje: "Error del servidor" });
  }
};