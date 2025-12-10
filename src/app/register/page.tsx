"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";

const workspaceImage = "http://localhost:3845/assets/536e979a6f5da93dd0033f1a6249b785f9eacabc.png";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    let response: Response;
    try {
      response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, name, password }),
      });
    } catch (err) {
      console.error("No se pudo enviar el formulario de registro", err);
      setError("No pudimos procesar tu solicitud. Verificá tu conexión e intentá nuevamente.");
      return;
    }

    if (response.ok) {
      setSuccess("Usuario registrado correctamente. Te redirigimos al inicio de sesión.");
      setUsername("");
      setEmail("");
      setName("");
      setPassword("");
      setTimeout(() => router.push("/login"), 1500);
      return;
    }

    let message = "Error al registrar usuario";
    try {
      const data = await response.json();
      if (data?.message) {
        message = data.message;
      }
    } catch (err) {
      console.warn("Respuesta de registro sin cuerpo JSON", err);
    }
    setError(message);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-4">
          <Link href="/" aria-label="Ir al inicio" className="flex items-center">
            <Image src="/logolaofi.svg" alt="La Ofi" width={112} height={40} priority />
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-neutral-700 md:flex">
            <Link className="hover:text-neutral-900" href="/">
              Inicio
            </Link>
            <Link className="hover:text-neutral-900" href="/servicios">
              Servicios
            </Link>
            <Link className="hover:text-neutral-900" href="/reserva">
              Reservá tu espacio
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-[#fdca00] px-4 py-2 text-sm font-semibold text-neutral-900 shadow-[0_10px_40px_-10px_rgba(253,202,0,0.6)] transition hover:bg-[#f1be00]"
            >
              Iniciar sesión
              <FaArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-screen-xl flex-col gap-16 px-6 pb-24 pt-20 lg:flex-row lg:items-center">
        <section className="flex-1 space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#fdca00]">Pedí tu acceso</p>
          <h1 className="text-4xl font-black uppercase leading-tight tracking-tight text-neutral-900 md:text-6xl">
            Sumate a la comunidad de La Ofi
          </h1>
          <p className="max-w-xl text-base text-neutral-600">
            Completá la solicitud de registro para habilitar tu usuario. Nuestro equipo validará tus datos y te avisará cuando puedas ingresar y empezar a disfrutar de los servicios digitales.
          </p>
          <div className="relative hidden overflow-hidden rounded-2xl border border-neutral-200 lg:block">
            <div className="relative h-72 w-full">
              <Image src={workspaceImage} alt="Equipo trabajando en La Ofi" fill className="object-cover" unoptimized />
            </div>
          </div>
        </section>

        <section className="w-full max-w-lg">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 rounded-2xl border border-neutral-200 bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-neutral-900">Registro de usuario</h2>
              <Link href="/" aria-label="Volver al inicio" className="flex items-center">
                <Image src="/logolaofi.svg" alt="La Ofi" width={90} height={32} />
              </Link>
            </div>
            <p className="text-sm text-neutral-600">
              Dejanos tus datos para crear la cuenta. Te contactaremos para confirmar la activación.
            </p>

            <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-800" htmlFor="name">
              Tu nombre completo*
              <input
                id="name"
                type="text"
                placeholder="Ej: Sofía Pérez"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#fdca00] focus:outline-none"
                required
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-800" htmlFor="username">
              Usuario
              <input
                id="username"
                type="text"
                placeholder="Elegí tu usuario"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#fdca00] focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-800" htmlFor="email">
              Correo corporativo*
              <input
                id="email"
                type="email"
                placeholder="nombre@empresa.com"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#fdca00] focus:outline-none"
                required
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-800" htmlFor="password">
              Contraseña segura*
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#fdca00] focus:outline-none"
                required
              />
            </label>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600" role="alert" aria-live="assertive">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status" aria-live="polite">
                {success}
              </div>
            )}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#fdca00] px-6 py-3 text-base font-semibold text-neutral-900 shadow-[0_10px_40px_-10px_rgba(253,202,0,0.6)] transition hover:bg-[#f1be00]"
            >
              Enviar solicitud
              <FaArrowRight className="h-4 w-4" />
            </button>

            <p className="text-center text-sm text-neutral-600">
              ¿Ya tenés acceso?{' '}
              <Link href="/login" className="font-semibold text-neutral-900 underline-offset-4 hover:underline">
                Iniciá sesión
              </Link>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}
