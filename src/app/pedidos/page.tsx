"use client";

import React, { useEffect, useState } from "react";


interface Pedido {
  _id: string;
  user?: { name?: string; email?: string };
  productos: Array<{
    nombre: string;
    cantidad: number;
    precio: number;
  }>;
  metodoPago: "mercadopago" | "modo" | "efectivo";
  total: number;
  estado: string;
  createdAt: string;
}

const METODOS_PAGO = [
  { value: "mercadopago", label: "Mercado Pago" },
  { value: "modo", label: "MODO" },
  { value: "efectivo", label: "Efectivo" },
];

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroPago, setFiltroPago] = useState("");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetch("/api/pedidos")
      .then((res) => res.json())
      .then(setPedidos);
  }, []);


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
    return coincideEstado && coincidePago && coincideBusqueda;
  });

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todos los Pedidos</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          className="border p-2 rounded"
          placeholder="Buscar por usuario o producto"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="preparado">Preparado</option>
          <option value="cancelado">Cancelado</option>
        </select>
        <select
          className="border p-2 rounded"
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
      </div>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Usuario</th>
            <th className="p-2 border">Productos</th>
            <th className="p-2 border">Pago</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border">Estado</th>
            <th className="p-2 border">Fecha</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidosFiltrados.map((p) => (
            <tr key={p._id} className="border-b">
              <td className="p-2 border">{p.user?.name || p.user?.email || '-'}</td>
              <td className="p-2 border">
                <ul>
                  {p.productos.map((item, idx) => (
                    <li key={idx}>
                      {item.cantidad} x {item.nombre} <span className="text-gray-500">${item.precio}</span>
                    </li>
                  ))}
                </ul>
              </td>
              <td className="p-2 border">
                {METODOS_PAGO.find((m) => m.value === p.metodoPago)?.label || p.metodoPago}
              </td>
              <td className="p-2 border font-semibold">${p.total}</td>
              <td className="p-2 border">
                <select
                  value={p.estado}
                  onChange={(e) => actualizarEstado(p._id, e.target.value)}
                  className="border rounded p-1"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="preparado">Preparado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </td>
              <td className="p-2 border">
                {new Date(p.createdAt).toLocaleString()}
              </td>
              <td className="p-2 border">
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => eliminarPedido(p._id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {pedidosFiltrados.length === 0 && (
        <div className="text-center text-gray-500 mt-4">
          No hay pedidos para mostrar.
        </div>
      )}
    </div>
  );
}
