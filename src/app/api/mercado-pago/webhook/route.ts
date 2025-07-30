
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import { Pedido } from "@/lib/pedido";

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || "";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("[MP Webhook] Notificación recibida:", JSON.stringify(body));

  // Mercado Pago envía el id y el tipo de notificación (topic)
  const { id, topic, type, data } = body;
  let paymentId = id;
  if (type === "payment" && data && data.id) paymentId = data.id;

  if (!paymentId) {
    return NextResponse.json({ error: "No se recibió payment id" }, { status: 400 });
  }

  // Consultar el pago a la API de Mercado Pago para obtener info completa
  try {
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
    });
    if (!mpRes.ok) {
      return NextResponse.json({ error: "No se pudo consultar el pago en Mercado Pago" }, { status: 500 });
    }
    const pago = await mpRes.json();
    // Buscar el pedido por external_reference si lo usas, o por preferencia
    // Aquí asumimos que guardaste el id de preferencia en el pedido (external_reference)
    const externalReference = pago.external_reference;
    if (!externalReference) {
      return NextResponse.json({ error: "No se encontró referencia externa en el pago" }, { status: 400 });
    }

    await connectToDatabase();
    // Buscar y actualizar el pedido
    const pedido = await Pedido.findById(externalReference);
    if (!pedido) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }
    // Solo actualizar si el pago está aprobado
    if (pago.status === "approved") {
      pedido.estado = "pagado";
      await pedido.save();
      return NextResponse.json({ updated: true, status: "pagado" });
    } else {
      return NextResponse.json({ updated: false, status: pago.status });
    }
  } catch (err) {
    return NextResponse.json({ error: "Error al procesar webhook" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Mercado Pago puede hacer un GET para verificar el endpoint
  return NextResponse.json({ status: "ok" });
}
