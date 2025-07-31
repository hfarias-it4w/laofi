

"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Pedido = {
  _id: string;
  user?: { name?: string; email?: string };
  productos: { nombre: string; cantidad: number; precio: number }[];
  total: number;
  estado: string;
  createdAt: string;
};

export default function PedidosPage() {
  const { data: session, status } = useSession();
  const user = session?.user as { role?: string; name?: string; email?: string } | undefined;
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Estado para nuevo pedido (solo para usuarios normales)
  const [nuevoPedido, setNuevoPedido] = useState<{
    productos: { nombre: string; cantidad: number; precio: number }[];
    producto: string;
    cantidad: number;
    precio: number;
  }>({ productos: [], producto: '', cantidad: 1, precio: 0 });
  const [enviando, setEnviando] = useState(false);

  // Handler para agregar producto al pedido
  function handleAddProducto() {
    setNuevoPedido(prev => {
      if (!prev.producto || prev.cantidad <= 0 || prev.precio <= 0) return prev;
      return {
        ...prev,
        productos: [
          ...prev.productos,
          { nombre: prev.producto, cantidad: prev.cantidad, precio: prev.precio }
        ],
        producto: '',
        cantidad: 1,
        precio: 0
      };
    });
  }

  function handleRemoveProducto(idx: number) {
    setNuevoPedido(prev => ({
      ...prev,
      productos: prev.productos.filter((_, i) => i !== idx)
    }));
  }

  // Handler para enviar el pedido
  const handleCrearPedido = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (nuevoPedido.productos.length === 0) return alert('Agrega al menos un producto');
    setEnviando(true);
    setError("");
    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productos: nuevoPedido.productos })
      });
      if (!res.ok) throw new Error("Error al crear pedido");
      setNuevoPedido({ productos: [], producto: '', cantidad: 1, precio: 0 });
      await fetchPedidos();
    } catch (e: any) {
      setError(e.message);
    }
    setEnviando(false);
  };

  useEffect(() => {
    if (status === "authenticated") fetchPedidos();
    if (status === "unauthenticated") router.replace("/login?callbackUrl=/pedidos");
  }, [status]);

  async function fetchPedidos() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/pedidos", { credentials: "same-origin" });
      if (!res.ok) throw new Error("Error al cargar pedidos");
      const data = await res.json();
      setPedidos(data);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }

  // Acciones admin: editar/eliminar (solo UI, no implementado backend)
  function handleEdit(_id: string) {
    alert("Funcionalidad de edición no implementada");
  }
  async function handleDelete(_id: string) {
    if (!confirm("¿Eliminar pedido?")) return;
    alert("Funcionalidad de eliminación no implementada");
  }

  if (status === "loading") {
    return <div className="text-center mt-10 text-gray-500">Cargando sesión...</div>;
  }
  if (!user) {
    return null;
  }
  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">{user.role === "admin" ? "Administrador de Pedidos" : "Mis Pedidos"}</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* Sección para crear pedido (solo para usuarios normales) */}
      {user.role === "user" || user.role === "admin" && (
        <div className="mb-8 border rounded p-4 bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">Crear nuevo pedido</h2>
          <form onSubmit={handleCrearPedido} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Producto"
                className="border p-1 rounded w-1/3"
                value={nuevoPedido.producto}
                onChange={e => setNuevoPedido(p => ({ ...p, producto: e.target.value }))}
                required
              />
              <input
                type="number"
                min={1}
                placeholder="Cantidad"
                className="border p-1 rounded w-1/4"
                value={nuevoPedido.cantidad}
                onChange={e => setNuevoPedido(p => ({ ...p, cantidad: Number(e.target.value) }))}
                required
              />
              <input
                type="number"
                min={1}
                placeholder="Precio"
                className="border p-1 rounded w-1/4"
                value={nuevoPedido.precio}
                onChange={e => setNuevoPedido(p => ({ ...p, precio: Number(e.target.value) }))}
                required
              />
              <button type="button" className="bg-blue-600 text-white px-3 rounded" onClick={handleAddProducto}>
                Agregar
              </button>
            </div>
            {nuevoPedido.productos.length > 0 && (
              <ul className="mb-2">
                {nuevoPedido.productos.map((prod, i) => (
                  <li key={i} className="flex items-center gap-2">
                    {prod.nombre} x{prod.cantidad} <span className="text-gray-500">${prod.precio}</span>
                    <button type="button" className="text-red-500 text-xs" onClick={() => handleRemoveProducto(i)}>Quitar</button>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-1 rounded disabled:opacity-50"
              disabled={enviando || nuevoPedido.productos.length === 0}
            >
              {enviando ? "Enviando..." : "Crear Pedido"}
            </button>
          </form>
        </div>
      )}

      {/* Tabla de pedidos */}
      {loading ? (
        <div className="text-gray-500">Cargando pedidos...</div>
      ) : pedidos.length === 0 ? (
        <div className="text-gray-500">No hay pedidos registrados.</div>
      ) : (
        <table className="w-full border text-sm mb-8">
          <thead>
            <tr className="bg-gray-100">
              {user.role === "admin" && <th className="p-2 border">Usuario</th>}
              <th className="p-2 border">Productos</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Estado</th>
              <th className="p-2 border">Fecha</th>
              {user.role === "admin" && <th className="p-2 border">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p, idx) => (
              <tr key={p._id}>
                {user.role === "admin" && (
                  <td className="p-2 border">{p.user?.name || p.user?.email || "-"}</td>
                )}
                <td className="p-2 border">
                  <ul>
                    {p.productos.map((prod, i) => (
                      <li key={i}>{prod.nombre} x{prod.cantidad} <span className="text-gray-500">${prod.precio}</span></li>
                    ))}
                  </ul>
                </td>
                <td className="p-2 border font-semibold">${p.total}</td>
                <td className="p-2 border">{p.estado}</td>
                <td className="p-2 border">{new Date(p.createdAt).toLocaleString()}</td>
                {user.role === "admin" && (
                  <td className="p-2 border flex gap-2 justify-center">
                    <button className="text-blue-600 hover:underline" onClick={() => handleEdit(p._id)}>Editar</button>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(p._id)}>Eliminar</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
