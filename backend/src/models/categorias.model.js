import mongoose from 'mongoose';

const CategoriaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      lowercase: true,
    },
    descripcion: {
      type: String,
      trim: true,
      default: '',
    },
    estado: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

CategoriaSchema.index({ nombre: 1 }, { unique: true });

export default mongoose.model('Categoria', CategoriaSchema, 'categorias');
