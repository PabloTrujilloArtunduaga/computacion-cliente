import mongoose from "mongoose";

const CategoriaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: String,
  estado: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

export default mongoose.model("Categoria", CategoriaSchema, "categorias");