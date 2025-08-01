    
"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BsFillExclamationOctagonFill } from "react-icons/bs";
import { FaCoffee, FaRedo } from "react-icons/fa";

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
        <div className="flex flex-col gap-6">
          {[...pedidos]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((p) => {
              const metodoPagoLabel = METODOS_PAGO.find((m) => m.value === p.metodoPago)?.label || p.metodoPago;
              const fecha = new Date(p.createdAt);
              const totalPedido = p.productos.reduce((acc, prod) => acc + (typeof prod.precio === "number" && typeof prod.cantidad === "number" ? prod.precio * prod.cantidad : 0), 0);
              let estadoColor = "bg-gray-100 text-gray-600";
              let estadoIcon = null;
              if (p.estado === "pendiente") {
                estadoColor = "bg-yellow-100 text-yellow-800";
                estadoIcon = <FaCoffee className="inline mr-1" />;
              } else if (p.estado === "preparado") {
                estadoColor = "bg-green-100 text-green-800";
                estadoIcon = <FaCoffee className="inline mr-1" />;
              } else if (p.estado === "cancelado") {
                estadoColor = "bg-red-100 text-red-700";
                estadoIcon = <BsFillExclamationOctagonFill className="inline mr-1" />;
              }
              return (
                <div key={p._id} className="rounded-2xl shadow-lg border border-gray-100 bg-gradient-to-br from-[#f7fafc] to-[#e6fffa] p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-3 mb-2">
                    <FaCoffee className="text-[#13B29F] text-2xl" />
                    <span className="font-bold text-lg text-[#13B29F]">{p.user?.name || p.user?.email || "-"}</span>
                    <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${estadoColor}`}>{estadoIcon}{p.estado.charAt(0).toUpperCase() + p.estado.slice(1)}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-gray-700 font-semibold mb-1">Productos</span>
                    <ul className="pl-4 list-disc">
                      {p.productos.map((prod, idx) => (
                        <li key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 text-base">
                          <span className="font-semibold text-[#13B29F]">{prod.cantidad} x {prod.nombre}</span>
                          <span className="text-gray-600">Precio unitario: ${typeof prod.precio === "number" ? prod.precio.toFixed(2) : "-"}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 text-sm">
                    <div className="flex flex-col">
                      <span className="text-gray-600 font-semibold">Método de pago</span>
                      <span className="font-semibold text-[#13B29F]">{metodoPagoLabel}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-600 font-semibold">Total pedido</span>
                      <span className="font-semibold text-[#13B29F]">${totalPedido.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <span className="font-semibold">Fecha:</span>
                    <span>
                      {fecha.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })} &nbsp;
                      {fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <button
                    className="mt-3 self-end flex items-center gap-2 bg-[#13B29F] hover:bg-[#119e8d] text-white rounded-xl py-2 px-4 text-sm font-semibold transition-colors shadow"
                    onClick={() => alert('Funcionalidad de repetir pedido próximamente')}
                  >
                    <FaRedo /> Repetir pedido
                  </button>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}