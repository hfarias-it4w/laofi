
import { NextResponse } from 'next/server';
import Pedido from '../../../../models/Pedido';
import { dbConnect } from '../../../../lib/mongodb';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productos, external_reference, metodoPago = 'mercadopago', total, userId } = body;
    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return NextResponse.json({ error: 'Productos requeridos' }, { status: 400 });
    }

    // Crear el pedido en la base de datos con estado pendiente
    if (external_reference && userId) {
      await dbConnect();
      await Pedido.create({
        user: userId,
        productos,
        metodoPago,
        total: total || productos.reduce((acc, p) => acc + (p.cantidad * p.precio), 0),
        estado: 'pendiente',
        external_reference,
      });
    }

    const items = productos.map((item: any) => ({
      title: item.nombre,
      quantity: item.cantidad,
      currency_id: 'ARS',
      unit_price: item.precio,
    }));

    const payload: any = { items };
    if (external_reference) {
      payload.external_reference = external_reference;
    }

    const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer APP_USR-8796834111021805-072921-c1c14761358477bf24e24ad1adc69294-169299039`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.message || data.error || 'Error al crear preferencia' }, { status: 500 });
    }
    return NextResponse.json({ preference: data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error interno' }, { status: 500 });
  }
}
