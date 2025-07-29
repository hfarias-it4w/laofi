"use client";
import React, { useEffect, useState } from "react";

interface Usuario {
  _id: string;
  nombre: string;
  correo: string;
}

interface Pedido {
  _id: string;
  usuarioId: any;
  items: Array<{
    productoId: any;
    cantidad: number;
    comentario?: string;
  }>;
  metodoPago: string;
  estado: string;
  notificado: boolean;
  createdAt: string;
}

const METODOS_PAGO = [
  { value: "mercadopago", label: "Mercado Pago" },
  { value: "modo", label: "MODO" },
  { value: "efectivo", label: "Efectivo" },
];

export default function Home() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioId, setUsuarioId] = useState<string>("");
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [comentario, setComentario] = useState("");
  const [metodoPago, setMetodoPago] = useState("mercadopago");
  const [mensaje, setMensaje] = useState("");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [productos, setProductos] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/usuarios")
      .then((res) => res.json())
      .then(setUsuarios);
    fetch("/api/pedidos")
      .then((res) => res.json())
      .then(setPedidos);
    fetch("/api/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data.filter((p: any) => p.disponible)));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioId) return setMensaje("Selecciona un usuario");
    if (!productoId) return setMensaje("Selecciona un producto");
    const items = [{ productoId, cantidad, comentario }];
    const res = await fetch("/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuarioId, items, metodoPago }),
    });
    if (res.ok) {
      setMensaje("¡Pedido realizado!");
      setCantidad(1); setComentario("");
      fetch("/api/pedidos")
        .then((res) => res.json())
        .then(setPedidos);
    } else {
      const err = await res.json();
      setMensaje(err.error || "Error al realizar pedido");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Comprar Café</h1>
      <form
        onSubmit={handleSubmit}
        className="mb-4 space-y-2"
      >
        <select
          className="border p-2 w-full"
          value={usuarioId}
          onChange={(e) => setUsuarioId(e.target.value)}
          required
        >
          <option value="">Selecciona un usuario</option>
          {usuarios.map((u) => (
            <option key={u._id} value={u._id}>
              {u.nombre} ({u.correo})
            </option>
          ))}
        </select>
        <select
          className="border p-2 w-full"
          value={productoId}
          onChange={(e) => setProductoId(e.target.value)}
          required
        >
          {productos.length === 0 && <option value="">No hay productos disponibles</option>}
          {productos.map((p) => (
            <option key={p._id} value={p._id}>
              {p.nombre} - ${p.precio}
            </option>
          ))}
        </select>
        <input
          className="border p-2 w-full"
          type="number"
          min={1}
          value={cantidad}
          onChange={e => setCantidad(Number(e.target.value))}
          required
          placeholder="Cantidad"
        />
        <input
          className="border p-2 w-full"
          value={comentario}
          onChange={e => setComentario(e.target.value)}
          placeholder="Comentario (opcional)"
        />
        <select
          className="border p-2 w-full"
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value)}
          required
        >
          {METODOS_PAGO.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          type="submit"
        >
          Comprar
        </button>
      </form>
      {mensaje && (
        <div className="mb-4 text-blue-700">{mensaje}</div>
      )}
      <h2 className="text-xl font-bold mt-6 mb-2">Pedidos recientes</h2>
      <ul>
        {pedidos
          .slice(-5)
          .reverse()
          .map((p) => {
            const item = p.items[0];
            const prod = productos.find((pr) => pr._id === (item?.productoId?._id || item?.productoId));
            return (
              <li key={p._id} className="border-b py-2">
                <span className="font-semibold">{p.usuarioId?.nombre}</span> pidió {item?.cantidad} x {prod ? prod.nombre : "Producto"}
                {item?.comentario && <span> ({item.comentario})</span>} - {" "}
                <span>{METODOS_PAGO.find((m) => m.value === p.metodoPago)?.label}</span> {" "}
                <span className="text-xs text-gray-500">
                  ({new Date(p.createdAt).toLocaleTimeString()})
                </span>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
