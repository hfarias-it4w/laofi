"use client";
import React, { useEffect, useState, useRef } from "react";


interface Usuario {
  _id: string;
  nombre: string;
  correo: string;
}

interface PedidoItem {
  productoId: any;
  cantidad: number;
  comentario?: string;
}

interface Pedido {
  _id: string;
  usuarioId: any;
  items: PedidoItem[];
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
  const audioRef = useRef<HTMLAudioElement>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioId, setUsuarioId] = useState<string>("");
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [comentario, setComentario] = useState("");
  const [metodoPago, setMetodoPago] = useState("mercadopago");
  const [mensaje, setMensaje] = useState("");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);

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
    if (metodoPago === "mercadopago") {
      // Llama directamente a la API de Mercado Pago
      try {
        const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer APP_USR-8796834111021805-072921-c1c14761358477bf24e24ad1adc69294-169299039`,
          },
          body: JSON.stringify({
            items: items.map((item) => {
              const producto = productos.find((p) => p._id === item.productoId);
              return {
                title: producto?.nombre || "Producto",
                quantity: item.cantidad,
                currency_id: "ARS",
                unit_price: producto?.precio || 1,
                description: item.comentario || "",
              };
            }),
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setMensaje((data && (data.message || data.error || JSON.stringify(data))) || "Error al crear preferencia de pago");
          return;
        }
        setShowModal(false);
        // Reproducir sonido de confirmación
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
        // Redirigir a /pago-exitoso después de un pequeño delay para que suene
        setTimeout(() => {
          window.location.href = "/pago-exitoso";
        }, 400);
        return;
      } catch (err) {
        setMensaje(
          "Error al conectar con Mercado Pago: " +
            (err instanceof Error ? err.message : String(err))
        );
      }
      return;
    }
    // Otros métodos de pago: flujo normal
    const res = await fetch("/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuarioId, items, metodoPago }),
    });
    if (res.ok) {
      setCantidad(1); setComentario("");
      setShowModal(false);
      // Reproducir sonido de confirmación
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      // Redirigir a /pago-exitoso después de un pequeño delay para que suene
      setTimeout(() => {
        window.location.href = "/pago-exitoso";
      }, 400);
    } else {
      const err = await res.json();
      setMensaje(err.error || "Error al realizar pedido");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <audio ref={audioRef} src="/positive-notification.wav" preload="auto" />
      <h1 className="text-2xl font-bold mb-4">Productos disponibles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {productos.length === 0 && <div>No hay productos disponibles</div>}
        {productos.map((p) => (
          <div key={p._id} className="border rounded-lg shadow p-4 flex flex-col items-start bg-white">
            <div className="font-semibold text-lg mb-1">{p.nombre}</div>
            <div className="text-gray-700 mb-2">${p.precio}</div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => {
                setSelectedProducto(p);
                setProductoId(p._id);
                setShowModal(true);
                setCantidad(1);
                setComentario("");
                setMensaje("");
              }}
            >
              Pedir ahora
            </button>
          </div>
        ))}
      </div>

      {/* Modal para pedir producto */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setShowModal(false)}
              aria-label="Cerrar"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-2">Pedir: {selectedProducto?.nombre}</h2>
            <form onSubmit={handleSubmit} className="space-y-2">
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
                Confirmar pedido
              </button>
            </form>
            {mensaje && (
              <div className="mt-2 text-blue-700">{mensaje}</div>
            )}
          </div>
        </div>
      )}

      {/* Modal de confirmación de pedido eliminado, ahora se redirige a /pago-exitoso */}

      <h2 className="text-xl font-bold mt-8 mb-2">Pedidos recientes</h2>
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
