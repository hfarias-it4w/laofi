    
"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BsFillExclamationOctagonFill } from "react-icons/bs";

type PedidoProducto = {
  nombre: string;
  cantidad: number;
  precio: number;
};
type Pedido = {
  _id: string;
  user?: { name?: string; email?: string };
  productos: PedidoProducto[];
  metodoPago: string;
  total: number;
  estado: string;
  createdAt: string;
};
const METODOS_PAGO = [
  { value: "mercadopago", label: "Mercado Pago" },
  { value: "efectivo", label: "Efectivo" },
];

export default function HistorialPedidos() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status !== "authenticated") return;
    setLoading(true);
    fetch("/api/pedidos")
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo obtener el historial");
        return res.json();
      })
      .then(setPedidos)
      .catch(() => setError("No se pudo obtener el historial"))
      .finally(() => setLoading(false));
  }, [status]);

  if (status === "loading") return <div className="text-center mt-10 text-gray-500">Cargando sesión...</div>;
  if (!session) return (
    <div className="flex flex-col items-center mt-10">
      <div className="text-red-600 text-4xl mb-6"><BsFillExclamationOctagonFill /></div>
      <div className="text-red-600 text-xl mb-6">Debes iniciar sesión para ver tu historial.</div>
      <button
        className="bg-[#13B29F] hover:bg-[#119e8d] text-white rounded-xl py-3 px-6 text-lg font-semibold transition-colors"
        onClick={() => router.push("/login")}
      >
        Ir al login
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Historial de pedidos</h2>
      {loading ? (
        <div className="text-gray-500">Cargando...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : pedidos.length === 0 ? (
        <div className="text-gray-500">No tienes pedidos registrados.</div>
      ) : (
        <ul>
          {pedidos
            .slice()
            .reverse()
            .map((p) => {
              const item = p.productos[0];
              const totalPrecio = typeof item?.precio === "number" && typeof item?.cantidad === "number"
                ? item.precio * item.cantidad
                : item?.precio;
              const metodoPagoLabel = METODOS_PAGO.find((m) => m.value === p.metodoPago)?.label || p.metodoPago;
              return (
                <li key={p._id} className="border-b py-2">
                  <span className="font-semibold">{p.user?.name || p.user?.email || "-"}</span> pidió {item?.cantidad} x {item?.nombre}
                  {typeof item?.precio === "number" && <span> (${totalPrecio})</span>}
                  <span className="ml-2 text-sm text-gray-700">[Pagó con: {metodoPagoLabel}]</span>
                  <span className="ml-2 text-xs text-gray-500">
                    ({new Date(p.createdAt).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })} {new Date(p.createdAt).toLocaleTimeString()})
                  </span>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}