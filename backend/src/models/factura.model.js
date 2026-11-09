import mongoose from 'mongoose';

const FacturaProductoSchema = new mongoose.Schema(
  {
    producto_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto',
      required: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    cantidad: {
      type: Number,
      required: true,
      min: 1,
    },
    precio_unitario: {
      type: Number,
      required: true,
      min: 0,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const FacturaSchema = new mongoose.Schema(
  {
    cliente_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    empleado_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Empleado',
      default: null,
    },
    productos: {
      type: [FacturaProductoSchema],
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: 'La factura debe tener al menos un producto',
      },
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    metodo_pago: {
      type: String,
      enum: ['Efectivo', 'Tarjeta', 'Transferencia'],
      required: true,
    },
    estado: {
      type: String,
      enum: ['pendiente', 'pagada', 'cancelada'],
      default: 'pagada',
    },
    eliminado: {
      type: Boolean,
      default: false,
    },
    eliminadoEn: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// El total siempre se calcula en servidor a partir de los subtotales.
FacturaSchema.pre('save', function calculateTotal() {
  this.total = this.productos.reduce((acc, item) => acc + item.subtotal, 0);
});

FacturaSchema.index({ cliente_id: 1, eliminado: 1 });
FacturaSchema.index({ createdAt: -1 });

export default mongoose.model('Factura', FacturaSchema, 'facturas');
