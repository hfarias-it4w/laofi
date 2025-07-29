import mongoose from "mongoose";


const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/laofi";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global._mongoose || { conn: null, promise: null };
if (!global._mongoose) {
  global._mongoose = cached;
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {}).then((mongooseInstance) => {
      cached.conn = mongooseInstance;
      return mongooseInstance;
    });
  }
  await cached.promise;
  return cached.conn;
}

// Usuario Schema (de backend.js)
const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contraseñaHash: { type: String, required: true },
  rol: { type: String, enum: ["cliente", "admin"], default: "cliente" },
  activo: { type: Boolean, default: true }
}, { timestamps: true });

export const Usuario = mongoose.models.Usuario || mongoose.model("Usuario", usuarioSchema);
