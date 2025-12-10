import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String }, // URL o ruta de la foto
  createdAt: { type: Date, default: Date.now },
});

export const Product = models.Product || model("Product", ProductSchema);
