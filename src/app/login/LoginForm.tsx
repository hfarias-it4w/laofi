"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.ok) {
      window.location.href = "/";
    } else {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/90 shadow-lg rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-blue-700 mb-2 text-center">Iniciar sesión</h2>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Email</span>
        <input name="email" type="email" required className="border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Contraseña</span>
        <input name="password" type="password" required className="border rounded px-3 py-2" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      <button type="submit" className="bg-blue-700 hover:bg-pink-600 text-white font-bold py-2 rounded transition-colors mt-2" disabled={loading}>
        {loading ? "Ingresando..." : "Entrar"}
      </button>
      {error && <div className="text-red-500 text-xs text-center">{error}</div>}
      <div className="text-xs text-gray-400 mt-2 text-center">
        <div>Usuarios de prueba:</div>
        <div>cliente@laofi.com / cliente123</div>
        <div>admin@laofi.com / admin123</div>
        <div>vendedor@laofi.com / vendedor123</div>
      </div>
    </form>
  );
}
