import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongo";

const pedidoSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  items: [
    {
      productoId: { type: mongoose.Schema.Types.ObjectId, ref: "Producto", required: true },
      cantidad: { type: Number, required: true },
      comentario: String,
    },
  ],
  metodoPago: { type: String, required: true },
  estado: { type: String, default: "pendiente" },
  notificado: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Pedido = mongoose.models.Pedido || mongoose.model("Pedido", pedidoSchema);
