import mongoose from 'mongoose';

const EmpleadoSchema = new mongoose.Schema(
  {
    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'El usuario es obligatorio'],
    },
    cargo: {
      type: String,
      trim: true,
      default: '',
    },
    salario: {
      type: Number,
      min: [0, 'El salario no puede ser negativo'],
      default: 0,
    },
    fecha_contratacion: {
      type: Date,
      default: Date.now,
    },
    estado: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

EmpleadoSchema.index({ usuario_id: 1 }, { unique: true });
EmpleadoSchema.index({ estado: 1 });

export default mongoose.model('Empleado', EmpleadoSchema, 'empleados');
