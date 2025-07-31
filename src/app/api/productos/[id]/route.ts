import { dbConnect } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const { name, price, description } = await req.json();
  const product = await Product.findByIdAndUpdate(
    params.id,
    { name, price, description },
    { new: true }
  );
  if (!product) {
    return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const product = await Product.findByIdAndDelete(params.id);
  if (!product) {
    return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 });
  }
  return NextResponse.json({ message: "Producto eliminado" });
}
