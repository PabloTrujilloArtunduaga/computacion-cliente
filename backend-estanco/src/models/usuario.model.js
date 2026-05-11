import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    enum: ['admin', 'empleado', 'cliente'],
    default: 'cliente'
  },
  estado: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

export default mongoose.model("Usuario", UsuarioSchema, "usuarios");