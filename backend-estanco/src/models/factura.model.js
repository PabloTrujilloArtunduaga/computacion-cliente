import mongoose from "mongoose";

const FacturaSchema = new mongoose.Schema({

  cliente_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },

  // ✅ OPCIONAL PARA COMPRAS ONLINE
  empleado_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Empleado",
    required: false,
    default: null
  },

  productos: [
    {
      producto_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Producto",
        required: true
      },

      nombre: {
        type: String,
        required: true
      },

      cantidad: {
        type: Number,
        required: true
      },

      precio_unitario: {
        type: Number,
        required: true
      },

      subtotal: {
        type: Number,
        required: true
      }
    }
  ],

  total: {
    type: Number,
    required: true
  },

  metodo_pago: {
    type: String,
    enum: [
      "efectivo",
      "tarjeta"
    ],
    required: true
  },

  estado: {
    type: String,
    enum: [
      "pendiente",
      "pagada",
      "cancelada"
    ],
    default: "pagada"
  }

}, {
  timestamps: true
});

export default mongoose.model(
  "Factura",
  FacturaSchema
);