import { NextResponse } from "next/server";
import Pedido from "@/models/Pedido";
import { dbConnect } from "@/lib/mongodb";

type ProductoPayload = {
  nombre: string;
  cantidad: number;
  precio: number;
  producto?: string;
};

type CreatePreferenceBody = {
  productos?: ProductoPayload[];
  external_reference?: string;
  metodoPago?: string;
  total?: number;
  userId?: string;
};

type MercadoPagoPreferenceResponse = {
  id?: string;
  init_point?: string;
  sandbox_init_point?: string;
  [key: string]: unknown;
};

type MercadoPagoErrorResponse = {
  message?: string;
  error?: string;
  cause?: Array<{ description?: string }>;
  [key: string]: unknown;
};

const MP_API_URL = "https://api.mercadopago.com/checkout/preferences";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreatePreferenceBody;
    const {
      productos,
      external_reference: externalReference,
      metodoPago = "mercadopago",
      total,
      userId,
    } = body;

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return NextResponse.json({ error: "Productos requeridos" }, { status: 400 });
    }

    // Crear el pedido en la base de datos con estado pendiente
    if (externalReference && userId) {
      await dbConnect();
      await Pedido.create({
        user: userId,
        productos,
        metodoPago,
        total:
          typeof total === "number"
            ? total
            : productos.reduce((acc, producto) => acc + producto.cantidad * producto.precio, 0),
        estado: "pendiente",
        external_reference: externalReference,
      });
    }

    const items = productos.map((item) => ({
      title: item.nombre,
      quantity: item.cantidad,
      currency_id: "ARS",
      unit_price: item.precio,
    }));

    // Asegurarse de que la URL de success esté bien formada y no vacía
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") || "https://laofi.co";
    const payload = {
      items,
      external_reference: externalReference,
      back_urls: {
        success: `${baseUrl}/pedidos/pago-exitoso`,
        failure: `${baseUrl}/pedidos/pago-cancelado`,
        pending: `${baseUrl}/pedidos/pago-pendiente`,
      },
      auto_return: "approved" as const,
    };

    const accessToken = process.env.MP_ACCESS_TOKEN ?? process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json({ error: "Token de Mercado Pago no configurado" }, { status: 500 });
    }

    const response = await fetch(MP_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });
    const data = (await response.json()) as MercadoPagoPreferenceResponse | MercadoPagoErrorResponse;
    if (!response.ok) {
      const defaultError = "Error al crear preferencia";
      const errorMessage =
        "message" in data && typeof data.message === "string"
          ? data.message
          : "error" in data && typeof data.error === "string"
          ? data.error
          : Array.isArray(data.cause) && data.cause[0]?.description
          ? data.cause[0].description
          : defaultError;
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
    return NextResponse.json({ preference: data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
