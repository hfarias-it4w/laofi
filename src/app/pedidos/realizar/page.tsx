"use client";
import React, { useEffect, useState, useRef } from "react";
import { useSession, signIn } from "next-auth/react";



// El modelo actual no requiere usuarioId ni items, sino user y productos
interface PedidoProducto {
  nombre: string;
  cantidad: number;
  precio: number;
}
const METODOS_PAGO = [
  { value: "mercadopago", label: "Mercado Pago" },
  { value: "efectivo", label: "Efectivo" },
];

export default function Home() {
  const { data: session } = useSession();
  const audioRef = useRef<HTMLAudioElement>(null);
  // Ya no se selecciona usuario, el usuario se toma de la sesión
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [metodoPago, setMetodoPago] = useState("mercadopago");
  const [mensaje, setMensaje] = useState("");
  const [productos, setProductos] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<any>(null);

  useEffect(() => {
    fetch("/api/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productoId) return setMensaje("Selecciona un producto");
    const producto = productos.find((p) => p._id === productoId);
    if (!producto) return setMensaje("Producto no encontrado");
    const productosPedido = [{
      producto: producto._id,
      nombre: producto.name,
      cantidad,
      precio: producto.price
    }];
    const total = cantidad * producto.price;
    // Si el método de pago es mercadopago, puedes mantener la integración externa si lo deseas
    if (metodoPago === "mercadopago") {
      try {
        const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer APP_USR-8796834111021805-072921-c1c14761358477bf24e24ad1adc69294-169299039`,
          },
          body: JSON.stringify({
            items: productosPedido.map((item) => ({
              title: item.nombre,
              quantity: item.cantidad,
              currency_id: "ARS",
              unit_price: item.precio,
            })),
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setMensaje((data && (data.message || data.error || JSON.stringify(data))) || "Error al crear preferencia de pago");
          return;
        }
        setShowModal(false);
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
        setTimeout(() => {
          window.location.href = "pago-exitoso";
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
      body: JSON.stringify({ productos: productosPedido, metodoPago, total }),
    });
    if (res.ok) {
      setCantidad(1);
      setShowModal(false);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      setTimeout(() => {
        window.location.href = "pago-exitoso";
      }, 400);
    } else {
      const err = await res.json();
      setMensaje(err.message || "Error al realizar pedido");
    }
  };

  return (
    <div className="flex flex-col items-center flex-grow py-4 px-4 bg-white min-h-screen">
      <audio ref={audioRef} src="/positive-notification.wav" preload="auto" />
      <h1 className="text-2xl font-bold text-[#3A3A3A] mb-2">Productos disponibles</h1>
      <p className="mb-6 text-gray-700">Selecciona tu café favorito y realiza tu pedido.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mb-8">
        {productos.length === 0 && <div className="col-span-2 text-center text-gray-500">No hay productos disponibles</div>}
        {productos.map((p) => (
          <div key={p._id} className="rounded-xl shadow-lg p-6 flex flex-col items-center bg-white border border-gray-100">
            {p.image ? (
              <img
                src={p.image}
                alt={p.name}
                className="w-28 h-28 object-cover rounded-lg mb-3 border border-gray-200 shadow-sm"
                style={{ background: '#f3f3f3' }}
              />
            ) : (
              <div className="w-28 h-28 flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg mb-3 border border-gray-200">
                Sin imagen
              </div>
            )}
            <div className="font-semibold text-lg mb-1 text-center">{p.name}</div>
            <div className="text-gray-700 mb-4 text-xl font-bold">${p.price}</div>
            <button
              className="bg-[#13B29F] hover:bg-[#119e8d] text-white rounded-xl py-3 px-6 text-lg font-semibold transition-colors"
              onClick={() => {
                setSelectedProducto(p);
                setProductoId(p._id);
                setShowModal(true);
                setCantidad(1);
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
          <div className="bg-white rounded-xl shadow-lg px-8 py-8 w-full max-w-md relative flex flex-col items-center">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setShowModal(false)}
              aria-label="Cerrar"
            >
              ×
            </button>
            {selectedProducto?.image ? (
              <img
                src={selectedProducto.image}
                alt={selectedProducto.name}
                className="w-32 h-32 object-cover rounded-lg mb-4 border border-gray-200 shadow-sm"
                style={{ background: '#f3f3f3' }}
              />
            ) : (
              <div className="w-32 h-32 flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg mb-4 border border-gray-200">
                Sin imagen
              </div>
            )}
            <h2 className="text-2xl font-bold mb-2 text-[#3A3A3A] text-center">{selectedProducto?.name}</h2>
            {session ? (
              <>
                <p className="mb-4 text-gray-700 text-center">Selecciona la cantidad y el método de pago para tu pedido.</p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                  <label className="text-sm text-gray-600 mb-1" htmlFor="cantidad-input">Cantidad</label>
                  <input
                    id="cantidad-input"
                    className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13B29F] text-lg"
                    type="number"
                    min={1}
                    value={cantidad}
                    onChange={e => setCantidad(Number(e.target.value))}
                    required
                    placeholder="Cantidad"
                  />
                  <select
                    className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13B29F] text-lg"
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
                    className="bg-[#13B29F] hover:bg-[#119e8d] text-white rounded-xl py-3 px-6 text-lg font-semibold transition-colors"
                    type="submit"
                  >
                    Confirmar pedido
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center w-full">
                <button
                  className="bg-[#13B29F] hover:bg-[#119e8d] text-white rounded-xl py-3 px-6 text-lg font-semibold transition-colors mb-2"
                  onClick={() => signIn()}
                >
                  Iniciar sesión para pedir
                </button>
                <p className="text-gray-600 text-center">Debes iniciar sesión para realizar un pedido.</p>
              </div>
            )}
            {mensaje && (
              <div className="mt-4 text-blue-700 w-full text-center">{mensaje}</div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
