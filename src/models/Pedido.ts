
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPedido extends Document {
  user: Types.ObjectId;
  productos: Array<{
    producto: Types.ObjectId;
    cantidad: number;
    precio: number;
    nombre: string;
  }>;
  metodoPago: "mercadopago" | "efectivo";
  total: number;
  estado: string;
  createdAt: Date;
}

const PedidoSchema = new Schema<IPedido>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  productos: [
    {
      producto: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      cantidad: { type: Number, required: true },
      precio: { type: Number, required: true },
      nombre: { type: String, required: true },
    },
  ],
  metodoPago: { type: String, enum: ['mercadopago', 'efectivo'], required: true },
  total: { type: Number, required: true },
  estado: { type: String, default: "pendiente" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Pedido || mongoose.model<IPedido>("Pedido", PedidoSchema);
