"use client";
import { useState } from "react";

export default function RegisterForm() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, contraseñaHash: password }),
      });
      if (res.ok) {
        setSuccess("Usuario registrado correctamente. Ya puedes iniciar sesión.");
        setNombre("");
        setCorreo("");
        setPassword("");
      } else {
        const data = await res.json();
        setError(data.error || "Error al registrar usuario");
      }
    } catch (err) {
      setError("Error de red o del servidor");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/90 shadow-lg rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-blue-700 mb-2 text-center">Registrarse</h2>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Nombre</span>
        <input name="nombre" type="text" required className="border rounded px-3 py-2" value={nombre} onChange={e => setNombre(e.target.value)} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Email</span>
        <input name="correo" type="email" required className="border rounded px-3 py-2" value={correo} onChange={e => setCorreo(e.target.value)} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Contraseña</span>
        <input name="password" type="password" required className="border rounded px-3 py-2" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      <button type="submit" className="bg-blue-700 hover:bg-pink-600 text-white font-bold py-2 rounded transition-colors mt-2" disabled={loading}>
        {loading ? "Registrando..." : "Registrarse"}
      </button>
      {error && <div className="text-red-500 text-xs text-center">{error}</div>}
      {success && <div className="text-green-600 text-xs text-center">{success}</div>}
    </form>
  );
}
