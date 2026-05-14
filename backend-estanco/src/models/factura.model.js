import mongoose from "mongoose";

const FacturaSchema = new mongoose.Schema(
  {

    cliente_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },

    // ✅ REFERENCIA A EMPLEADO
    empleado_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Empleado",
      default: null,
    },

    productos: [

      {

        producto_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Producto",
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

      }

    ],

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    metodo_pago: {
      type: String,
      enum: [
        "Efectivo",
        "Tarjeta",
        "Transferencia"
      ],
      required: true,
    },

    estado: {
      type: String,
      enum: [
        "pendiente",
        "pagada",
        "cancelada"
      ],
      default: "pagada",
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
  {
    timestamps: true,
  }
);

// ✅ CALCULAR TOTAL AUTOMÁTICO
FacturaSchema.pre("save", async function () {

  this.total = this.productos.reduce(
    (acc, item) => acc + item.subtotal,
    0
  );
});

export default mongoose.model(
  "Factura",
  FacturaSchema
);