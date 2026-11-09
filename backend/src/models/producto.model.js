import mongoose from 'mongoose';

const ProductoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
      default: '',
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    stock: {
      type: Number,
      required: [true, 'El stock es obligatorio'],
      min: [0, 'El stock no puede ser negativo'],
    },
    categoria_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categoria',
      required: [true, 'La categoría es obligatoria'],
    },
    codigo_barras: {
      type: String,
      trim: true,
      default: '',
    },
    imagen: {
      type: String,
      trim: true,
      default: '',
    },
    estado: {
      type: Boolean,
      default: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

ProductoSchema.index({ nombre: 1, deleted: 1 });
ProductoSchema.index({ categoria_id: 1 });

export default mongoose.model('Producto', ProductoSchema, 'productos');
