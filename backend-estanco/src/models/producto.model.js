const mongoose = require('mongoose')

const ProductoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: String,
  precio: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  categoria_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria',
    required: true
  },
  codigo_barras: String,
  estado: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Producto', ProductoSchema)