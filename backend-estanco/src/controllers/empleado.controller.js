import User from '../models/usuario.model.js';
import Empleado from '../models/empleado.model.js';

// Buscar muchos empleados
export const getEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.find({ estado: true })
      .populate('usuario_id');

    res.json(empleados);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener empleados',
      error: error.message
    });
  }
};

// Crear empleado
export const createEmpleado = async (req, res) => {
  try {
    console.log('BODY RECIBIDO:', req.body);

    const {
      usuario_id,
      cargo,
      salario,
      fecha_contratacion
    } = req.body;

    // Validar usuario
    if (!usuario_id) {
      return res.status(400).json({
        message: 'Debe seleccionar un usuario'
      });
    }

    // Verificar existencia
    const user = await User.findById(usuario_id);

    if (!user) {
      return res.status(404).json({
        message: 'El usuario no existe'
      });
    }

    // Verificar duplicado
    const empleadoExistente = await Empleado.findOne({ usuario_id });

    if (empleadoExistente) {
      return res.status(400).json({
        message: 'Este usuario ya está registrado como empleado'
      });
    }

    // Crear empleado
    const empleado = new Empleado({
      usuario_id,
      cargo,
      salario: Number(salario),
      fecha_contratacion
    });

    await empleado.save();

    const empleadoCreado = await Empleado.findById(empleado._id)
      .populate('usuario_id');

    res.status(201).json(empleadoCreado);

  } catch (error) {
    console.error('ERROR COMPLETO:', error);

    res.status(400).json({
      message: error.message,
      error: error.message,
      detalles: error.errors || null,
      stack: process.env.NODE_ENV === 'development'
        ? error.stack
        : undefined
    });
  }
};

// Buscar un empleado
export const getEmpleado = async (req, res) => {
  try {
    const empleado = await Empleado.findById(req.params.id)
      .populate('usuario_id');

    if (!empleado) {
      return res.status(404).json({
        message: 'Empleado no encontrado'
      });
    }

    res.json(empleado);

  } catch (error) {
    res.status(500).json({
      message: 'Error al buscar empleado',
      error: error.message
    });
  }
};

// Eliminar lógico
export const deleteEmpleado = async (req, res) => {
  try {
    const empleado = await Empleado.findByIdAndUpdate(
      req.params.id,
      { estado: false },
      { new: true }
    );

    if (!empleado) {
      return res.status(404).json({
        message: 'Empleado no encontrado'
      });
    }

    res.json({
      message: 'Empleado eliminado correctamente',
      empleado
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar empleado',
      error: error.message
    });
  }
};

// Actualizar empleado
export const updateEmpleado = async (req, res) => {
  try {
    const empleado = await Empleado.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('usuario_id');

    if (!empleado) {
      return res.status(404).json({
        message: 'Empleado no encontrado para actualizar'
      });
    }

    res.json(empleado);

  } catch (error) {
    res.status(400).json({
      message: 'Error al actualizar empleado',
      error: error.message,
      detalles: error.errors || null
    });
  }
};