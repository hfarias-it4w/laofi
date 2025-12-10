import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Pedido from "@/models/Pedido";

type WebhookBody = {
  type?: string;
  data?: {
    id?: string;
  };
};

type MercadoPagoPayment = {
  external_reference?: string;
  status?: string;
  [key: string]: unknown;
};

// Procesa notificaciones de Mercado Pago
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as WebhookBody;
    // Log para debug en entornos no productivos
    if (process.env.NODE_ENV !== "production") {
      console.log("Webhook Mercado Pago:", JSON.stringify(body));
    }
    const { type, data } = body;
    if (type === "payment" && data?.id) {
      // Consultar el pago a la API de Mercado Pago para obtener detalles
      const paymentId = data.id;
      const accessToken = process.env.MP_ACCESS_TOKEN ?? process.env.MERCADOPAGO_ACCESS_TOKEN;
      if (!accessToken) {
        return NextResponse.json({ error: "Token de Mercado Pago no configurado" }, { status: 500 });
      }
      const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!paymentResponse.ok) {
        const errorText = await paymentResponse.text();
        console.error("Error consultando pago de Mercado Pago", errorText);
        return NextResponse.json({ error: "No se pudo verificar el pago" }, { status: 502 });
      }
      const payment = (await paymentResponse.json()) as MercadoPagoPayment;
      // Buscar el pedido por external_reference
      const externalReference = payment.external_reference;
      if (externalReference) {
        await dbConnect();
        await Pedido.findOneAndUpdate(
          { _id: externalReference },
          { estado: payment.status === "approved" ? "pagado" : "pendiente" }
        );
      }
    }
    // Siempre responde 200 para evitar reintentos
    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error en webhook";
    console.error("Error en webhook de Mercado Pago", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
