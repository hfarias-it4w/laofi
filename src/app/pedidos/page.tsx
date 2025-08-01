"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BsFillExclamationOctagonFill } from "react-icons/bs";
import { FaCoffee, FaTrashAlt, FaUser } from "react-icons/fa";


interface Pedido {
  _id: string;
  user?: { name?: string; email?: string };
  productos: Array<{
    nombre: string;
    cantidad: number;
    precio: number;
  }>;
  metodoPago: "mercadopago" | "efectivo";
  total: number;
  estado: string;
  createdAt: string;
}

const METODOS_PAGO = [
  { value: "mercadopago", label: "Mercado Pago" },
  { value: "efectivo", label: "Efectivo" },
];

export default function PedidosPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroPago, setFiltroPago] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  useEffect(() => {
    if (!user) return;
    fetch("/api/pedidos")
      .then((res) => res.json())
      .then(setPedidos);
  }, [user]);


  const actualizarEstado = async (id: string, nuevoEstado: string) => {
    await fetch(`/api/pedidos`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: id, estado: nuevoEstado }),
    });
    fetch("/api/pedidos").then((res) => res.json()).then(setPedidos);
  };

  const eliminarPedido = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este pedido?")) return;
    try {
      const res = await fetch(`/api/pedidos?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.message || "Error al eliminar el pedido");
        return;
      }
      fetch("/api/pedidos").then((res) => res.json()).then(setPedidos);
    } catch (e) {
      alert("Error de red al eliminar el pedido");
    }
  };

  const pedidosFiltrados = pedidos.filter((p) => {
    const coincideEstado = filtroEstado ? p.estado === filtroEstado : true;
    const coincidePago = filtroPago ? p.metodoPago === filtroPago : true;
    const coincideBusqueda = busqueda
      ? (p.user?.name?.toLowerCase().includes(busqueda.toLowerCase()) ||
         p.user?.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
         p.productos.some(item => item.nombre?.toLowerCase().includes(busqueda.toLowerCase())))
      : true;
    const fechaPedido = new Date(p.createdAt);
    const coincideDesde = fechaDesde ? fechaPedido >= new Date(fechaDesde) : true;
    const coincideHasta = fechaHasta ? fechaPedido <= new Date(fechaHasta + 'T23:59:59') : true;
    return coincideEstado && coincidePago && coincideBusqueda && coincideDesde && coincideHasta;
  });

  if (!user) {
    return (
      <div className="flex flex-col items-center mt-10">
        <div className="text-red-600 text-4xl mb-6"><BsFillExclamationOctagonFill /></div>
        <div className="text-red-600 text-xl mb-6">Acceso denegado</div>
        <button
          className="bg-[#13B29F] hover:bg-[#119e8d] text-white rounded-xl py-3 px-6 text-lg font-semibold transition-colors"
          onClick={() => router.push("/login")}
        >
          Ir al login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-[#13B29F] flex items-center gap-2"><FaCoffee /> Todos los Pedidos</h1>
      <div className="flex flex-wrap gap-2 mb-6 bg-white p-4 rounded-xl shadow">
        <input
          className="border p-2 rounded w-full sm:w-auto"
          placeholder="Buscar por usuario o producto"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select
          className="border p-2 rounded w-full sm:w-auto"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="preparado">Preparado</option>
          <option value="cancelado">Cancelado</option>
        </select>
        <select
          className="border p-2 rounded w-full sm:w-auto"
          value={filtroPago}
          onChange={(e) => setFiltroPago(e.target.value)}
        >
          <option value="">Todos los pagos</option>
          {METODOS_PAGO.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <input
          type="date"
          className="border p-2 rounded w-full sm:w-auto"
          value={fechaDesde}
          onChange={e => setFechaDesde(e.target.value)}
          placeholder="Desde"
        />
        <input
          type="date"
          className="border p-2 rounded w-full sm:w-auto"
          value={fechaHasta}
          onChange={e => setFechaHasta(e.target.value)}
          placeholder="Hasta"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-2 text-sm rounded-2xl shadow-lg bg-white">
          <thead>
            <tr className="bg-[#13B29F] text-white">
              <th className="p-3 rounded-tl-2xl">Usuario</th>
              <th className="p-3">Productos</th>
              <th className="p-3">Pago</th>
              <th className="p-3">Total</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Fecha</th>
              <th className="p-3 rounded-tr-2xl">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-gray-500 py-6">No hay pedidos para mostrar.</td>
              </tr>
            )}
            {pedidosFiltrados.map((p) => {
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
                <tr key={p._id} className="hover:bg-[#e6fffa] transition-colors">
                  <td className="p-3 font-semibold text-[#13B29F] flex items-center gap-2">
                    <FaUser className="text-[#13B29F] text-base" />
                    {p.user?.name || p.user?.email || "-"}
                  </td>
                  <td className="p-3">
                    <ul className="list-disc pl-4">
                      {p.productos.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="font-semibold text-[#13B29F]">{item.cantidad} x {item.nombre}</span>
                          <span className="font-semibold text-[#13B29F]">Precio unitario: ${typeof item.precio === "number" ? item.precio.toFixed(2) : "-"}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-3 font-semibold text-[#13B29F]">
                    {METODOS_PAGO.find((m) => m.value === p.metodoPago)?.label || p.metodoPago}
                  </td>
                  <td className="p-3 font-semibold text-[#13B29F]">${p.total}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${estadoColor}`}>{estadoIcon}{p.estado.charAt(0).toUpperCase() + p.estado.slice(1)}</span>
                    <select
                      value={p.estado}
                      onChange={(e) => actualizarEstado(p._id, e.target.value)}
                      className="border rounded p-1 mt-2 w-full"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="preparado">Preparado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </td>
                  <td className="p-3 text-gray-500">
                    {new Date(p.createdAt).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })}<br />
                    {new Date(p.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="p-3">
                    <button
                      className="text-red-600 hover:bg-red-100 rounded-full p-2 transition-colors"
                      title="Eliminar pedido"
                      onClick={() => eliminarPedido(p._id)}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {pedidosFiltrados.length > 0 && (
        <div className="text-right mt-6 text-lg font-bold text-[#13B29F]">
          Total general: ${pedidosFiltrados.reduce((acc, p) => acc + (Number(p.total) || 0), 0)}
        </div>
      )}
    </div>
  );
}
