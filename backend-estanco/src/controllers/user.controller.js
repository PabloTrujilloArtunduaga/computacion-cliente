const User = require('../models/usuario.model');


const login = async (req, res) => {
    try {
        const { usuario, password } = req.body;

        const user = await User.findOne({ usuario });

        if (!user) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        if (user.password !== password) {
            return res.status(401).json({ mensaje: "Contraseña incorrecta" });
        }

        return res.json({
            mensaje: "Login exitoso",
            rol: user.rol,
            id: user._id
        });

    } catch (error) {
        return res.status(500).json({ mensaje: "Error del servidor" });
    }
};


const register = async (req, res) => {
    try {
        const { usuario, email, password, rol } = req.body;
    const rolesValidos = ["admin", "empleado", "cliente"];

        if (rol && !rolesValidos.includes(rol)) {
        return res.status(400).json({ mensaje: "Rol inválido" });
        }
       
        const existeUsuario = await User.findOne({ usuario });
        const existeEmail = await User.findOne({ email });

        if (existeUsuario) {
            return res.status(400).json({ mensaje: "El usuario ya existe" });
        }

        if (existeEmail) {
            return res.status(400).json({ mensaje: "El correo ya está registrado" });
        }

        const nuevoUsuario = new User({
            usuario,
            email,
            password,
            rol: rol || "cliente"
        });

        await nuevoUsuario.save();

        return res.json({
            mensaje: "Usuario registrado correctamente"
        });

    } catch (error) {
        return res.status(500).json({ mensaje: "Error del servidor" });
    }
};

module.exports = {
    login,
    register
};