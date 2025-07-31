import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();
  const { name, email, password } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ message: "Faltan campos obligatorios" }, { status: 400 });
  }
  const exists = await User.findOne({ email });
  if (exists) {
    return NextResponse.json({ message: "Email ya registrado" }, { status: 400 });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed, role: 'user' });
  await user.save();
  return NextResponse.json({ message: "Usuario creado" }, { status: 201 });
}
