"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password
    });
    if (res?.error) {
      setError("Credenciales incorrectas");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col items-center flex-grow py-4 px-4 bg-white min-h-screen">
      {/* Logo laofi en el centro */}
      <img src="/logolaofi.svg" alt="Logo Laofi" className="h-24 w-auto mb-6 mt-10" />
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-md bg-white rounded-xl shadow-lg px-8 py-8 mt-2">
        <h1 className="text-2xl font-bold text-[#3A3A3A] mb-6">Iniciar sesión</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13B29F] text-lg"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13B29F] text-lg"
        />
        {error && <div className="text-red-500 mb-2 w-full text-center">{error}</div>}
        <button type="submit" className="w-full bg-[#13B29F] hover:bg-[#119e8d] text-white rounded-xl py-3 px-6 text-xl font-semibold transition-colors mt-2">Entrar</button>
      </form>
    </div>
  );
}
