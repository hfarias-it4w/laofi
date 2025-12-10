
// =============================
// PRUEBAS CON POSTMAN:
// 1. Inicia sesión en tu frontend y copia el valor de la cookie 'next-auth.session-token' desde las DevTools (Application > Cookies).
// 2. En Postman, haz una petición a este endpoint (por ejemplo, GET http://localhost:3000/api/pedidos).
// 3. En la pestaña 'Headers', agrega:
//    Key: Cookie
//    Value: next-auth.session-token=VALOR_DE_LA_COOKIE
// 4. Envía la petición. Si la cookie es válida, obtendrás la respuesta protegida.
// =============================
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Pedido from "@/models/Pedido";
import { getSocketServer } from "@/lib/socketServer";
import { dbConnect } from "@/lib/mongodb";

type SessionUser = {
  _id?: string;
  role?: string;
};

type PedidoProductoPayload = {
  producto: string;
  nombre: string;
  cantidad: number;
  precio: number;
};

type PedidoPostBody = {
  productos: PedidoProductoPayload[];
  metodoPago: "mercadopago" | "efectivo";
  total: number;
  comentarios?: string;
  user?: string;
};

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }
  const user = session.user as SessionUser;
  let pedidos;
  if (user.role === "admin") {
    pedidos = await Pedido.find({}).populate("user").sort({ createdAt: -1 });
  } else {
    pedidos = await Pedido.find({ user: user._id }).populate("user").sort({ createdAt: -1 });
  }
  return NextResponse.json(pedidos);
}


// Crear pedido (solo admin puede crear para otros, usuario normal solo para sí mismo)
export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }
  const user = session.user as SessionUser;
  const body = (await req.json()) as Partial<PedidoPostBody>;
  // Si admin, puede especificar user, si no, forzar user propio
  const pedidoData = {
    ...body,
    user: user.role === "admin" && body?.user ? body.user : user._id,
  };
  try {
    const pedido = await Pedido.create(pedidoData);
    // Notificar a admins por socket.io cuando el pedido se crea correctamente
    const io = getSocketServer();
    if (io) {
      io.emit("nuevo-pedido");
    }
    return NextResponse.json(pedido, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al crear pedido";
    return NextResponse.json({ message }, { status: 400 });
  }
}

// Editar pedido (solo admin)
export async function PUT(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }
  const user = session.user as SessionUser;
  if (user.role !== "admin") {
    return NextResponse.json({ message: "Solo admin puede editar pedidos" }, { status: 403 });
  }
  const body = (await req.json()) as Partial<PedidoPostBody> & { _id?: string };
  const { _id, ...update } = body;
  try {
    const pedido = await Pedido.findByIdAndUpdate(_id, update, { new: true });
    if (!pedido) return NextResponse.json({ message: "Pedido no encontrado" }, { status: 404 });
    return NextResponse.json(pedido);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al actualizar pedido";
    return NextResponse.json({ message }, { status: 400 });
  }
}

// Eliminar pedido (solo admin)
export async function DELETE(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }
  const user = session.user as SessionUser;
  if (user.role !== "admin") {
    return NextResponse.json({ message: "Solo admin puede eliminar pedidos" }, { status: 403 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ message: "Falta id" }, { status: 400 });
  try {
    await Pedido.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al eliminar pedido";
    return NextResponse.json({ message }, { status: 400 });
  }
}
