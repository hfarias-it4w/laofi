    
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
        <ul className="divide-y divide-gray-200">
          {[...pedidos]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((p) => {
              const item = p.productos[0];
              const totalPrecio = typeof item?.precio === "number" && typeof item?.cantidad === "number"
                ? item.precio * item.cantidad
                : item?.precio;
              const metodoPagoLabel = METODOS_PAGO.find((m) => m.value === p.metodoPago)?.label || p.metodoPago;
              const fecha = new Date(p.createdAt);
              return (
                <li key={p._id} className="py-4 px-2 sm:px-3 bg-white rounded-xl shadow-sm mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 flex-wrap w-full">
                      <span className="font-semibold text-[#13B29F] text-base truncate max-w-full">{p.user?.name || p.user?.email || "-"}</span>
                      <span className="text-gray-700 text-base">pidió</span>
                      <span className="font-semibold text-base truncate max-w-full">{item?.cantidad} x {item?.nombre}</span>
                    </div>
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm w-full">
                      <div className="flex justify-between xs:block">
                        <span className="text-gray-600">Precio unitario:</span>
                        <span className="font-semibold text-[#13B29F] ml-2 xs:ml-0">${typeof item?.precio === "number" ? item.precio.toFixed(2) : '-'}</span>
                      </div>
                      <div className="flex justify-between xs:block">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-semibold text-[#13B29F] ml-2 xs:ml-0">${typeof totalPrecio === "number" ? totalPrecio.toFixed(2) : '-'}</span>
                      </div>
                      <div className="flex justify-between xs:block col-span-1 xs:col-span-2">
                        <span className="text-gray-600">Pago:</span>
                        <span className="font-semibold ml-2 xs:ml-0">{metodoPagoLabel}</span>
                      </div>
                      <div className="flex justify-between xs:block col-span-1 xs:col-span-2">
                        <span className="text-gray-500">{fecha.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })}</span>
                        <span className="text-gray-500 ml-2 xs:ml-0">{fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="sm:mt-0 mt-2 sm:ml-4 flex items-center self-end sm:self-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      p.estado === 'pendiente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : p.estado === 'preparado'
                        ? 'bg-green-100 text-green-800'
                        : p.estado === 'cancelado'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {p.estado.charAt(0).toUpperCase() + p.estado.slice(1)}
                    </span>
                  </div>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}