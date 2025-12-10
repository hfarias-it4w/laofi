"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FaArrowRight, FaChevronDown, FaChevronRight } from "react-icons/fa";

const primaryImage = "http://localhost:3845/assets/cf048ee078da950f40fe1ebaad2cb09a9f43942c.png";
const indicatorCount = 5;

export default function ReservaPage() {
  const { data: session } = useSession();
  const [visitPreference, setVisitPreference] = useState("si");
  const user = session?.user;

  const primaryCta = user
    ? user.role === "admin"
      ? { href: "/pedidos", label: "Ir al panel" }
      : { href: "/pedidos/realizar", label: "Pedir café" }
    : { href: "/login", label: "Iniciar sesión" };

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
            <Link className="hover:text-neutral-900" href="/pedidos/realizar">
              App Café
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="#reserva-form"
              className="inline-flex items-center gap-2 rounded-lg bg-[#fdca00] px-4 py-2 text-sm font-semibold text-neutral-900 shadow-[0_10px_40px_-10px_rgba(253,202,0,0.6)] transition hover:bg-[#f1be00]"
            >
              Contactanos
              <FaArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-screen-xl px-6 pb-10 pt-20">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#fdca00]">
              Reservá hoy
            </p>
            <h1 className="mt-4 text-4xl font-black uppercase leading-tight tracking-tight text-neutral-900 md:text-6xl">
              Agendá tu lugar en La Ofi
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-screen-xl px-6 pb-24">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
            <form
              id="reserva-form"
              className="flex flex-col gap-6 rounded-2xl border border-neutral-200 bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            >
              <div className="space-y-3">
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3 text-left text-lg font-semibold text-neutral-900"
                >
                  Espacio compartido
                  <FaChevronDown className="h-4 w-4 text-neutral-500" />
                </button>
                <div className="inline-flex items-center gap-2 rounded-md bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-700">
                  <span className="inline-flex h-2 w-2 rounded-full bg-neutral-500" />
                  Capacidad de 24 puestos
                </div>
                <p className="text-sm text-neutral-600">
                  Completá el formulario y coordinaremos una visita, o si lo preferís, un miembro de nuestro equipo se pondrá en contacto con vos para conocer tus necesidades y asesorarte en la elección del espacio que mejor se adecue a vos.
                </p>
              </div>

              <div className="grid gap-4">
                <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-800">
                  Tu nombre*
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Ingresa tu nombre"
                    className="rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#fdca00] focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-800">
                  Tu correo*
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="nombre@empresa.com"
                    className="rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#fdca00] focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-800">
                  Tu número de teléfono
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Ej: +54 9 11 1234 5678"
                    className="rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#fdca00] focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-800">
                  Contanos más sobre tu necesidad
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="¿Cuántas personas son? ¿Qué tipo de espacio buscan?"
                    className="rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#fdca00] focus:outline-none"
                  />
                </label>
              </div>

              <fieldset className="space-y-4">
                <legend className="text-sm font-semibold text-neutral-800">
                  ¿Querés programar una visita?
                </legend>
                <label className="flex items-center gap-3 text-sm text-neutral-700">
                  <input
                    type="radio"
                    name="visit"
                    value="si"
                    checked={visitPreference === "si"}
                    onChange={() => setVisitPreference("si")}
                    className="h-4 w-4"
                  />
                  Sí, programar una visita
                </label>
                <label className="flex items-center gap-3 text-sm text-neutral-700">
                  <input
                    type="radio"
                    name="visit"
                    value="no"
                    checked={visitPreference === "no"}
                    onChange={() => setVisitPreference("no")}
                    className="h-4 w-4"
                  />
                  No, quisiera tener más información
                </label>
              </fieldset>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#fdca00] px-6 py-3 text-base font-semibold text-neutral-900 shadow-[0_10px_40px_-10px_rgba(253,202,0,0.6)] transition hover:bg-[#f1be00]"
              >
                Reservar espacio
                <FaArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="relative overflow-hidden rounded-2xl border border-neutral-200">
              <div className="relative h-[520px] w-full">
                <Image
                  src={primaryImage}
                  alt="Personas trabajando en La Ofi"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <button
                type="button"
                aria-label="Siguiente imagen"
                className="absolute right-6 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-md transition hover:bg-white"
              >
                <FaChevronRight className="h-4 w-4" />
              </button>
              <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
                {Array.from({ length: indicatorCount }).map((_, index) => (
                  <span
                    key={index}
                    className={`h-2 w-2 rounded-full ${index === 0 ? "bg-white" : "bg-white/50"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-neutral-200 bg-neutral-50">
          <div className="mx-auto grid max-w-screen-xl gap-12 px-6 py-16 md:grid-cols-[1.2fr_1fr_1fr]">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-neutral-900 px-3 py-1 text-white">LAOFI</span>
                <p className="text-sm font-semibold text-neutral-900">
                  Espacio de coworking donde creatividad y productividad se encuentran.
                </p>
              </div>
              <p className="text-sm text-neutral-600">
                Unite a nuestra comunidad de profesionales y dale a tu equipo un lugar pensado para crecer sin límites.
              </p>
              <div className="flex gap-4 text-neutral-500">
                <a href="https://www.linkedin.com" className="transition hover:text-neutral-900">
                  LinkedIn
                </a>
                <a href="https://www.instagram.com" className="transition hover:text-neutral-900">
                  Instagram
                </a>
                <a href="https://www.facebook.com" className="transition hover:text-neutral-900">
                  Facebook
                </a>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-900">Enlaces</h3>
              <nav className="flex flex-col gap-2 text-sm text-neutral-600">
                <Link href="/" className="hover:text-neutral-900">
                  Inicio
                </Link>
                <Link href="/servicios" className="hover:text-neutral-900">
                  Servicios
                </Link>
                <Link href={primaryCta.href} className="hover:text-neutral-900">
                  App Café
                </Link>
                <Link href="/reserva" className="hover:text-neutral-900">
                  Reservá tu espacio
                </Link>
              </nav>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-900">Contacto</h3>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>Av. Rivadavia 14084, Ramos Mejía</li>
                <li>11 5263 3006</li>
                <li>hola@laofi.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-200 py-6 text-center text-sm text-neutral-500">
            © {new Date().getFullYear()} La Ofi. Todos los derechos reservados.
          </div>
        </footer>
      </main>
    </div>
  );
}
