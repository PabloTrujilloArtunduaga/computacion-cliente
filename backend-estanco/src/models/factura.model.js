import mongoose from "mongoose";

const FacturaSchema = new mongoose.Schema({
  cliente_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: false
  },

  empleado_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: false
  },

  productos: [
    {
      producto_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
      },

      nombre: {
        type: String,
        required: true
      },

      cantidad: {
        type: Number,
        required: true,
        min: 1
      },

      precio_unitario: {
        type: Number,
        required: true,
        min: 0
      },

      subtotal: {
        type: Number,
        required: true,
        min: 0
      }
    }
  ],

  total: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },

  metodo_pago: {
    type: String,
    enum: ['EFECTIVO', 'NEQUI', 'DAVIPLATA', 'TARJETA', 'TRANSFERENCIA'],
    required: true
  },

  tipo_venta: {
    type: String,
    enum: ['FISICA', 'VIRTUAL'],
    required: true
  },

  estado: {
    type: String,
    enum: ['PENDIENTE', 'PAGADO', 'ANULADO', 'ENTREGADO'],
    default: 'PENDIENTE'
  },

  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

export default mongoose.model("facturas", FacturaSchema);