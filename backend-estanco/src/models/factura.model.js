const mongoose = require('mongoose')

const FacturaSchema = new mongoose.Schema({
  cliente_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  empleado_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empleado',
    required: true
  },
  productos: [
    {
      producto_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto'
      },
      nombre: String,
      cantidad: Number,
      precio_unitario: Number,
      subtotal: Number
    }
  ],
  total: Number,
  metodo_pago: String,
  estado: String
}, {
  timestamps: true
})

module.exports = mongoose.model('Factura', FacturaSchema)