"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";

const workspaceImage = "http://localhost:3845/assets/1770f4ac1152a70a157c5452373012a66c8a4621.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password || !validateEmail(email)) {
      setError("Credenciales incorrectas");
      return;
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Credenciales incorrectas");
        return;
      }

      router.push("/");
    } catch (err) {
      console.error("No se pudo iniciar sesión", err);
      setError("Ocurrió un problema al iniciar sesión. Intentá nuevamente en unos minutos.");
    }
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
              href="/reserva#reserva-form"
              className="inline-flex items-center gap-2 rounded-lg bg-[#fdca00] px-4 py-2 text-sm font-semibold text-neutral-900 shadow-[0_10px_40px_-10px_rgba(253,202,0,0.6)] transition hover:bg-[#f1be00]"
            >
              Contactanos
              <FaArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-screen-xl flex-col gap-16 px-6 pb-24 pt-20 lg:flex-row lg:items-center">
        <section className="flex-1 space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#fdca00]">Ingresá a la app</p>
          <h1 className="text-4xl font-black uppercase leading-tight tracking-tight text-neutral-900 md:text-6xl">
            Todo tu café y pedidos en un solo lugar
          </h1>
          <p className="max-w-xl text-base text-neutral-600">
            Gestioná pedidos, métodos de pago y notificaciones desde cualquier dispositivo. Tu sesión te permite acceder al flujo de pedidos, historial y novedades de La Ofi.
          </p>
          <div className="relative hidden overflow-hidden rounded-2xl border border-neutral-200 lg:block">
            <div className="relative h-72 w-full">
              <Image src={workspaceImage} alt="Espacio de trabajo La Ofi" fill className="object-cover" unoptimized />
            </div>
          </div>
        </section>

        <section className="w-full max-w-lg">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 rounded-2xl border border-neutral-200 bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-neutral-900">Iniciar sesión</h2>
              <Link href="/" aria-label="Volver al inicio" className="flex items-center">
                <Image src="/logolaofi.svg" alt="La Ofi" width={90} height={32} />
              </Link>
            </div>
            <p className="text-sm text-neutral-600">
              Accedé con tus credenciales para gestionar tus pedidos y tu historial en La Ofi.
            </p>

            <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-800" htmlFor="email">
              Tu email*
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="nombre@empresa.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError("");
                }}
                className="rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#fdca00] focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-800" htmlFor="password">
              Tu contraseña*
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (error) setError("");
                }}
                className="rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#fdca00] focus:outline-none"
              />
            </label>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600" role="alert" aria-live="assertive">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-6 py-3 text-base font-semibold text-white shadow-[0_10px_40px_-10px_rgba(26,26,26,0.4)] transition hover:bg-neutral-800"
            >
              Entrar
              <FaArrowRight className="h-4 w-4" />
            </button>

            <p className="text-center text-sm text-neutral-600">
              ¿No tenés cuenta?{' '}
              <Link href="/register" className="font-semibold text-neutral-900 underline-offset-4 hover:underline">
                Pedí tu alta en La Ofi
              </Link>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}
