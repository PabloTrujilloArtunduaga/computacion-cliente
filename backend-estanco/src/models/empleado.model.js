import mongoose from "mongoose";

const EmpleadoSchema = new mongoose.Schema({
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  cargo: String,
  salario: Number,
  fecha_contratacion: Date,
  estado: {
    type: Boolean,
    default: true
  }
})


export default mongoose.model("Empleado", EmpleadoSchema, "empleados");