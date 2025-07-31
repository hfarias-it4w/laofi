"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BsFillExclamationOctagonFill } from "react-icons/bs";

type Product = {
  _id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
};

export default function ProductosAdmin() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user as { role?: string } | undefined;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<{ name: string; price: string; description: string; image: string; id?: string }>({ name: "", price: "", description: "", image: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const res = await fetch("/api/productos");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.price) {
      setError("Nombre y precio son obligatorios");
      return;
    }
    const method = editId ? "PUT" : "POST";
    const url = editId ? `/api/productos/${editId}` : "/api/productos";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, price: Number(form.price), description: form.description, image: form.image })
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.message || "Error al guardar producto");
      return;
    }
    setForm({ name: "", price: "", description: "", image: "" });
    setEditId(null);
    fetchProducts();
  }

  function handleEdit(product: Product) {
    setForm({
      name: product.name,
      price: String(product.price),
      description: product.description || "",
      image: product.image || "",
      id: product._id
    });
    setEditId(product._id);
  }

  function handleCancelEdit() {
    setForm({ name: "", price: "", description: "", image: "" });
    setEditId(null);
  }

  async function handleDelete(id: string) {
    if (!confirmDelete) {
      setConfirmDelete(id);
      return;
    }
    await fetch(`/api/productos/${id}`, { method: "DELETE" });
    setConfirmDelete(null);
    fetchProducts();
  }

  if (status === "loading") {
    return <div className="text-center mt-10 text-gray-500">Cargando sesión...</div>;
  }

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
    <div className="flex flex-col items-center flex-grow py-4 px-4 bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-[#3A3A3A] mb-2">Administrador de Productos</h1>
      <p className="mb-6 text-gray-700">Aquí puedes agregar, editar o eliminar productos del menú.</p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-2xl bg-white rounded-xl shadow-lg px-8 py-8 mb-8">
        <h2 className="text-lg font-semibold mb-4">{editId ? "Editar producto" : "Nuevo producto"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-4">
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1" htmlFor="nombre-input">Nombre</label>
            <input
              id="nombre-input"
              type="text"
              placeholder="Nombre"
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13B29F] text-lg"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1" htmlFor="precio-input">Precio</label>
            <input
              id="precio-input"
              type="number"
              placeholder="Precio"
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13B29F] text-lg"
              value={form.price}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
            />
          </div>
          <div className="flex flex-col md:col-span-2">
            <label className="text-xs text-gray-600 mb-1" htmlFor="descripcion-input">Descripción</label>
            <input
              id="descripcion-input"
              type="text"
              placeholder="Descripción"
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13B29F] text-lg"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="flex flex-col md:col-span-2">
            <label className="text-xs text-gray-600 mb-1" htmlFor="image-input">Imagen (URL)</label>
            <input
              id="image-input"
              type="text"
              placeholder="https://ejemplo.com/imagen.jpg"
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13B29F] text-lg"
              value={form.image}
              onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
            />
          </div>
        </div>
        {error && <div className="text-red-600 mb-4 w-full text-center">{error}</div>}
        <div className="flex gap-2 w-full justify-center">
          <button type="submit" className="bg-[#13B29F] hover:bg-[#119e8d] text-white rounded-xl py-3 px-6 text-lg font-semibold transition-colors">
            {editId ? "Guardar cambios" : "Agregar"}
          </button>
          {editId && (
            <button type="button" className="bg-gray-400 text-white rounded-xl py-3 px-6 text-lg font-semibold hover:bg-gray-500 transition-colors" onClick={handleCancelEdit}>
              Cancelar
            </button>
          )}
        </div>
      </form>
      <h2 className="text-lg font-semibold mb-4">Listado de productos</h2>
      <div className="overflow-x-auto w-full max-w-2xl">
        {loading ? (
          <div className="text-gray-500">Cargando...</div>
        ) : products.length === 0 ? (
          <div className="text-gray-500">No hay productos registrados.</div>
        ) : (
          <table className="min-w-full border text-sm rounded-xl overflow-hidden shadow-md bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border">Nombre</th>
                <th className="p-3 border">Precio</th>
                <th className="p-3 border">Descripción</th>
                <th className="p-3 border">Imagen</th>
                <th className="p-3 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="p-3 border">{product.name}</td>
                  <td className="p-3 border">${product.price}</td>
                  <td className="p-3 border">{product.description}</td>
                  <td className="p-3 border">
                    {product.image ? (
                      <img src={product.image} alt="img" className="w-10 h-10 object-cover rounded" />
                    ) : (
                      <span className="text-gray-400">Sin imagen</span>
                    )}
                  </td>
                  <td className="p-3 border flex gap-2 justify-center">
                    <button className="bg-yellow-400 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-yellow-500 transition-colors" onClick={() => handleEdit(product)}>
                      Editar
                    </button>
                    {confirmDelete === product._id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-red-600">¿Confirmar?</span>
                        <button
                          className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors"
                          type="button"
                          onClick={() => handleDelete(product._id)}
                        >
                          Si
                        </button>
                        <button
                          className="ml-2 bg-gray-300 text-gray-700 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-gray-400 transition-colors"
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            setConfirmDelete(null);
                          }}
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors"
                        type="button"
                        onClick={() => handleDelete(product._id)}
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
