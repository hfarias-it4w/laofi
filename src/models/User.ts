import mongoose, { Schema, models, model } from "mongoose";


const UserSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // name ya está definido arriba como requerido
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

export const User = models.User || model("User", UserSchema);
