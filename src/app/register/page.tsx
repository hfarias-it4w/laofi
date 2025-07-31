"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, name, password })
    });
    if (res.ok) {
      setSuccess("Usuario registrado correctamente");
      setUsername(""); setEmail(""); setName(""); setPassword("");
      setTimeout(() => router.push("/login"), 1500);
    } else {
      const data = await res.json();
      setError(data.message || "Error al registrar usuario");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f5f6fa] to-[#e3e6ed] font-sans">
      <div className="flex flex-col items-center w-full max-w-md px-4">
        <img src="/logolaofi.svg" alt="La Ofi Logo" className="h-16 mb-6 mt-2 drop-shadow-lg" />
        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full border border-gray-100">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6 tracking-tight">Registro de usuario</h1>
          <label className="block text-xs text-gray-600 mb-1" htmlFor="name">Nombre</label>
          <input
            id="name"
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <label className="block text-xs text-gray-600 mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <label className="block text-xs text-gray-600 mb-1" htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          {error && <div className="text-red-500 mb-3 text-center font-medium animate-pulse">{error}</div>}
          {success && <div className="text-green-600 mb-3 text-center font-medium animate-pulse">{success}</div>}
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold shadow transition">Registrar</button>
        </form>
      </div>
    </div>
  );
}
