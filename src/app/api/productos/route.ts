import { dbConnect } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const products = await Product.find().sort({ createdAt: -1 });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  await dbConnect();
  const { name, price, description } = await req.json();
  if (!name || !price) {
    return NextResponse.json({ message: "Nombre y precio son obligatorios" }, { status: 400 });
  }
  const product = new Product({ name, price, description });
  await product.save();
  return NextResponse.json(product, { status: 201 });
}
