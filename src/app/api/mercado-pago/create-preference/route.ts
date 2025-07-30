import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import { Producto } from "@/lib/producto";
import { Pedido } from "@/lib/pedido";
import { MercadoPagoConfig, Preference } from "mercadopago";


const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || "";
const mpClient = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });

export async function POST(req: NextRequest) {
  if (!MP_ACCESS_TOKEN) {
    return NextResponse.json({ error: "Falta access token de Mercado Pago" }, { status: 500 });
  }
  const body = await req.json();
  const { items, usuarioId } = body;
  if (!items || !Array.isArray(items) || items.length === 0 || !usuarioId) {
    return NextResponse.json({ error: "Datos de items o usuario inválidos" }, { status: 400 });
  }

  await connectToDatabase();

  // Buscar productos y mapear items
  const mpItems = [];
  for (const item of items) {
    const prod = await Producto.findById(item.productoId);
    if (!prod) {
      return NextResponse.json({ error: `Producto no encontrado: ${item.productoId}` }, { status: 404 });
    }
    mpItems.push({
      id: prod._id.toString(),
      title: prod.nombre + (item.comentario ? ` (${item.comentario})` : ""),
      quantity: item.cantidad,
      unit_price: prod.precio,
      currency_id: "ARS",
    });
  }

  // Crear el pedido en la base de datos (estado: pendiente, metodoPago: mercadopago)
  const pedido = await Pedido.create({
    usuarioId,
    items,
    metodoPago: "mercadopago",
    estado: "pendiente",
    notificado: false,
  });

  try {
    const preference = new Preference(mpClient);
    const result = await preference.create({
      body: {
        items: mpItems,
        external_reference: pedido._id.toString(),
        back_urls: {
          success: process.env.NEXT_PUBLIC_MP_SUCCESS_URL || "http://localhost:3000/pago-exitoso",
          failure: process.env.NEXT_PUBLIC_MP_FAILURE_URL || "http://localhost:3000/",
          pending: process.env.NEXT_PUBLIC_MP_PENDING_URL || "http://localhost:3000/",
        },
        auto_return: "approved",
      }
    });
    if (!result.init_point) {
      return NextResponse.json({ error: "No se pudo crear preferencia de pago", mpError: result }, { status: 500 });
    }
    return NextResponse.json({ init_point: result.init_point });
  } catch (err: any) {
    return NextResponse.json({ error: "Error al conectar con Mercado Pago", details: err?.message || err }, { status: 500 });
  }
}
