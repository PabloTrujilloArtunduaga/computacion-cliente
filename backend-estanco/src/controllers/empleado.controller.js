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
  const user = await User.findById(req.body.usuario_id);

  if (!user) {
    console.log('empleado no existe"')
    return res.status(400).json({ message: "empleado no existe" });
  }

  const empleado = new Empleado(req.body)
  await empleado.save()
  res.json(empleado)
}

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