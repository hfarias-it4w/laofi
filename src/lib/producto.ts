import { connectToDatabase } from "@/lib/mongo";
import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  precio: { type: Number, required: true },
  imagenUrl: String,
  disponible: { type: Boolean, default: true },
}, { timestamps: true });

export const Producto = mongoose.models.Producto || mongoose.model("Producto", productoSchema);
