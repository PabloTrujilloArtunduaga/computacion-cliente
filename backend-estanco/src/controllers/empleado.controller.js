import User from '../models/usuario.model.js'
import Empleado from '../models/empleado.model.js'


// Buscar muchos empleado
export const getEmpleados = async (req, res) => {
  const empleado = await Empleado.find({ estado: true })
    .populate("usuario_id");
  console.log(empleado);
  res.json(empleado)
}

// Crear
export const createEmpleado = async (req, res) => {
  try {
    const { usuario_id } = req.body;

    // 1. Verificar que el usuario exista
    const user = await User.findById(usuario_id);
    if (!user) {
      return res.status(400).json({ message: "El usuario no existe" });
    }

    // 2. Verificar que NO exista ya un empleado con ese usuario
    const empleadoExistente = await Empleado.findOne({ usuario_id });

    if (empleadoExistente) {
      return res.status(400).json({
        message: "Este usuario ya está registrado como empleado",
      });
    }

    // 3. Crear empleado
    const empleado = new Empleado(req.body);
    await empleado.save();

    res.status(201).json(empleado);

  } catch (error) {
    res.status(500).json({
      message: "Error al crear empleado",
      error: error.message,
    });
  }
};

// Buscar un solo empleado
export const getEmpleado = async (req, res) => {
    const empleado = await Empleado.findById(req.params.id)
    if(!empleado) return res.status(404).json({ message: "empleado not found" })
    res.json(empleado)
}


// Borrar soft
export const deleteEmpleado = async (req, res) => {
  const empleado = await Empleado.findByIdAndUpdate(
    req.params.id,
    { estado: false },
    { new: true }
  );

  if (!empleado) {
    return res.status(404).json({ message: "empleado not found for deleted" });
  }

  res.json({ message: "empleado soft deleted", empleado });
};


// Actualizar
export const updateEmpleado = async (req, res) => {
    const empleado = await Empleado.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })
    if(!empleado) return res.status(404).json({ message: "empleado not found for update" })
    res.json(empleado)
}