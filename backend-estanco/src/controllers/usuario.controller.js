import User from '../models/usuario.model.js';

// Obtener todos los usuarios activos
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ estado: true });
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
};

// Crear usuario
export const createUser = async (req, res) => {
  try {
    console.log('BODY RECIBIDO:', req.body);

    const { nombre, email, password, rol } = req.body;

    // Validar campos obligatorios
    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({
        message: 'Todos los campos son obligatorios'
      });
    }

    // Verificar email duplicado
    const existe = await User.findOne({ email });

    if (existe) {
      return res.status(400).json({
        message: 'El correo electrónico ya está registrado'
      });
    }

    // Crear usuario
    const user = new User({
      nombre,
      email,
      password,
      rol
    });

    await user.save();

    res.status(201).json(user);

  } catch (error) {
    console.error('ERROR AL CREAR USUARIO:', error);

    res.status(400).json({
      message: error.message,
      detalles: error.errors || null,
      stack: process.env.NODE_ENV === 'development'
        ? error.stack
        : undefined
    });
  }
};

// Obtener un usuario por ID
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({
      message: 'Error al buscar usuario',
      error: error.message
    });
  }
};

// Eliminación lógica
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { estado: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      message: 'Usuario eliminado correctamente',
      user
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar usuario',
      error: error.message
    });
  }
};

// Actualizar usuario
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado para actualizar'
      });
    }

    const {
      nombre,
      email,
      password,
      rol,
      estado
    } = req.body;

    // Validar email único al actualizar
    if (email && email !== user.email) {
      const existe = await User.findOne({ email });

      if (existe) {
        return res.status(400).json({
          message: 'El correo electrónico ya está registrado'
        });
      }
    }

    if (nombre !== undefined) user.nombre = nombre;
    if (email !== undefined) user.email = email;
    if (password !== undefined) user.password = password;
    if (rol !== undefined) user.rol = rol;
    if (estado !== undefined) user.estado = estado;

    await user.save();

    res.json(user);

  } catch (error) {
    res.status(400).json({
      message: 'Error al actualizar usuario',
      error: error.message,
      detalles: error.errors || null
    });
  }
};