"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BsFillExclamationOctagonFill } from "react-icons/bs";

type SessionUser = {
  _id?: string;
  name?: string | null;
  email?: string | null;
};

export default function MisDatos() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const user = session?.user as SessionUser | undefined;
  const [form, setForm] = useState({
    _id: "",
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        _id: user._id || "",
        name: user.name ?? "",
        email: user.email ?? "",
        password: ""
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/clientes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: form._id, name: form.name, email: form.email, password: form.password })
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "Error al actualizar datos");
      }
      setShowModal(true);
      if (update) await update();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al actualizar datos";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="flex flex-col items-center flex-grow py-4 px-4 bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-[#3A3A3A] mb-2">Mis datos</h1>
      <p className="mb-6 text-gray-700">Actualiza tu información personal.</p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-md bg-white rounded-xl shadow-lg px-8 py-8 mb-8">
        <input
          type="text"
          placeholder="Nombre"
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13B29F] text-lg mb-4 w-full"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />
        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13B29F] text-lg mb-4 w-full"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        />
        <input
          type="password"
          placeholder="Nueva contraseña (opcional)"
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13B29F] text-lg mb-4 w-full"
          value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
        />
        <button
          type="submit"
          className="bg-[#13B29F] hover:bg-[#119e8d] text-white rounded-xl py-3 px-6 text-lg font-semibold transition-colors w-full"
          disabled={loading}
        >
          Guardar cambios
        </button>
        {error && <div className="text-red-600 mt-4 w-full text-center">{error}</div>}
      </form>

      {/* Modal de éxito */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 text-[#13B29F]">¡Datos actualizados!</h2>
            <p className="mb-6 text-gray-700 text-center">Tus datos se actualizaron correctamente.</p>
            <button
              className="bg-[#13B29F] hover:bg-[#119e8d] text-white rounded-xl py-2 px-6 text-lg font-semibold transition-colors"
              onClick={() => router.push("/")}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
