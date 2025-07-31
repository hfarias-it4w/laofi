"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ClientesAdmin() {
  const { data: session, status } = useSession();
  const user = session?.user as { role?: string } | undefined;
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    _id: "",
    // name ya está definido arriba
    email: "",
    name: "",
    role: "user",
    password: ""
  });
  const [editMode, setEditMode] = useState(false);

  // Obtener clientes
  const fetchClientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/clientes");
      if (!res.ok) throw new Error("Error al obtener usuarios");
      const data = await res.json();
      setClientes(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") fetchClientes();
    // eslint-disable-next-line
  }, [user]);

  // Alta o edición
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let res;
      if (editMode) {
        res = await fetch("/api/clientes", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });
      } else {
        // Alta: POST a /api/register
        res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });
      }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error en la operación");
      }
      setForm({ _id: "", name: "", email: "", role: "user", password: "" });
      setEditMode(false);
      fetchClientes();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar
  const handleDelete = async (_id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/clientes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al eliminar");
      }
      fetchClientes();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Editar
  const handleEdit = (cliente: any) => {
    setForm({ ...cliente, password: "" });
    setEditMode(true);
  };

  if (status === "loading") {
    return <div className="text-center mt-10 text-gray-500">Cargando sesión...</div>;
  }
  if (!user || user.role !== "admin") {
    return <div className="text-red-600 text-center mt-10">Acceso denegado</div>;
  }

  return (
    <div className="flex flex-col items-center flex-grow py-4 px-4 bg-white min-h-screen">
      {/* Logo laofi en el centro */}
      <img src="/logolaofi.svg" alt="Logo Laofi" className="h-20 w-auto mb-6 mt-10" />
      <h1 className="text-2xl font-bold text-[#3A3A3A] mb-2">Administrador de Clientes</h1>
      <p className="mb-6 text-gray-700">Aquí podrás gestionar los clientes del sistema.</p>

      {/* Formulario alta/edición */}
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-2xl bg-white rounded-xl shadow-lg px-8 py-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1" htmlFor="nombre-input">Nombre</label>
            <input
              id="nombre-input"
              type="text"
              placeholder="Nombre"
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13B29F] text-lg"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
              disabled={editMode}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1" htmlFor="email-input">Email</label>
            <input
              id="email-input"
              type="email"
              placeholder="Email"
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13B29F] text-lg"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1" htmlFor="rol-input">Rol</label>
            <select
              id="rol-input"
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13B29F] text-lg"
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
            >
              <option value="user">Usuario</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {!editMode && (
            <div className="flex flex-col">
              <label className="text-xs text-gray-600 mb-1" htmlFor="password-input">Contraseña</label>
              <input
                id="password-input"
                type="password"
                placeholder="Contraseña"
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13B29F] text-lg"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
              />
            </div>
          )}
        </div>
        <div className="mt-6 flex gap-2 w-full justify-center">
          <button
            type="submit"
            className="bg-[#13B29F] hover:bg-[#119e8d] text-white rounded-xl py-3 px-6 text-lg font-semibold transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {editMode ? "Guardar cambios" : "Agregar usuario"}
          </button>
          {editMode && (
            <button
              type="button"
              className="bg-gray-400 text-white rounded-xl py-3 px-6 text-lg font-semibold hover:bg-gray-500 transition-colors"
              onClick={() => { setEditMode(false); setForm({ _id: "", name: "", email: "", role: "user", password: "" }); }}
              disabled={loading}
            >
              Cancelar
            </button>
          )}
        </div>
        {error && <div className="text-red-600 mt-4 w-full text-center">{error}</div>}
      </form>

      {/* Listado de usuarios */}
      <div className="overflow-x-auto w-full max-w-2xl">
        <table className="min-w-full border text-sm rounded-xl overflow-hidden shadow-md bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Nombre</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Rol</th>
              <th className="p-3 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c._id} className="hover:bg-gray-50">
                <td className="p-3 border">{c.name}</td>
                <td className="p-3 border">{c.email}</td>
                <td className="p-3 border">{c.role}</td>
                <td className="p-3 border flex gap-2">
                  <button
                    className="bg-yellow-400 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-yellow-500 transition-colors"
                    onClick={() => handleEdit(c)}
                    disabled={loading}
                  >Editar</button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors"
                    onClick={() => handleDelete(c._id)}
                    disabled={loading}
                  >Eliminar</button>
                </td>
              </tr>
            ))}
            {clientes.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">No hay usuarios registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
