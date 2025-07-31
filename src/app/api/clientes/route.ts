
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { User } from "@/models/User";
import { dbConnect } from "@/lib/mongodb";

// Helper para verificar admin
async function isAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { role?: string } | undefined;
  return user?.role === "admin";
}

// GET: Obtener todos los usuarios
export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }
  await dbConnect();
  const users = await User.find({}, "-password");
  return NextResponse.json(users);
}

// PUT: Editar usuario (requiere body: { _id, ...campos })
export async function PUT(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }
  await dbConnect();
  const data = await req.json();
  const { _id, ...update } = data;
  if (!_id) {
    return NextResponse.json({ error: "Falta el _id del usuario" }, { status: 400 });
  }
  // No permitir cambiar password aquí
  delete update.password;
  const user = await User.findByIdAndUpdate(_id, update, { new: true, select: "-password" });
  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }
  return NextResponse.json(user);
}

// DELETE: Eliminar usuario (requiere body: { _id })
export async function DELETE(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }
  await dbConnect();
  const data = await req.json();
  const { _id } = data;
  if (!_id) {
    return NextResponse.json({ error: "Falta el _id del usuario" }, { status: 400 });
  }
  const user = await User.findByIdAndDelete(_id);
  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
