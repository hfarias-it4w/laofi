import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/mongodb';
import Pedido from '../../../../models/Pedido';

// Procesa notificaciones de Mercado Pago
export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Log para debug
    console.log('Webhook Mercado Pago:', JSON.stringify(body));
    const { type, data } = body;
    if (type === 'payment' && data && data.id) {
      // Consultar el pago a la API de Mercado Pago para obtener detalles
      const paymentId = data.id;
      const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer APP_USR-8796834111021805-072921-c1c14761358477bf24e24ad1adc69294-169299039`,
          },
        }
      );
      const payment = await mpRes.json();
      // Buscar el pedido por external_reference
      const externalReference = payment.external_reference;
      if (externalReference) {
        await dbConnect();
        await Pedido.findOneAndUpdate(
          { _id: externalReference },
          { estado: 'pagado' }
        );
      }
    }
    // Siempre responde 200 para evitar reintentos
    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error en webhook' }, { status: 400 });
  }
}

export async function GET(req: Request) {
  return NextResponse.json({ status: 'ok' });
}
