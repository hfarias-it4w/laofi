"use client";

import { Geist, Geist_Mono } from "next/font/google";
import AdminNotificationListener from "@/app/components/AdminNotificationListener";
import "./globals.css";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import AuthProvider from "./AuthProvider";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaSignOutAlt } from "react-icons/fa";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Extiende el tipo de usuario de NextAuth para incluir 'role'
declare module "next-auth" {
  interface User {
    role?: string;
  }
}

function HeaderWithAccount() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = session?.user?.role === "admin";
  const user = session?.user as { name?: string | null; email?: string | null; role?: string } | undefined;

  useEffect(() => {
    setAccountOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = useMemo(() => {
    const links = [
      { href: "/pedidos/realizar", label: "Realizar pedido" },
      { href: "/pedidos/historial", label: "Historial" },
    ];
    if (isAdmin) {
      links.unshift({ href: "/pedidos", label: "Panel" });
      links.push(
        { href: "/productos", label: "Productos" },
        { href: "/clientes", label: "Usuarios" }
      );
    }
    return links;
  }, [isAdmin]);

  const displayName = (user?.name || user?.email || "Tu cuenta").trim();
  const firstName = displayName.split(" ")[0];
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk.charAt(0).toUpperCase())
    .join("") || "LC";

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center" aria-label="Ir al inicio">
            <Image src="/logolaofi.svg" alt="Logo La Ofi" width={120} height={32} priority />
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const active = pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-neutral-900 text-white shadow-[0_10px_30px_-20px_rgba(0,0,0,0.45)]"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <div className="hidden flex-col items-end sm:flex">
                <span className="text-sm font-semibold text-neutral-900">Hola, {firstName}</span>
                <span className="text-xs text-neutral-500">{isAdmin ? "Administración" : "Coworker"}</span>
              </div>
              <div className="relative">
                <button
                  onClick={() => setAccountOpen((prev) => !prev)}
                  className="flex items-center gap-3 rounded-full border border-neutral-200 bg-white px-3 py-2 text-left shadow-[0_10px_30px_-20px_rgba(0,0,0,0.45)] transition hover:border-neutral-300"
                  aria-haspopup="true"
                  aria-expanded={accountOpen}
                >
                  <span className="hidden text-sm font-semibold text-neutral-700 sm:inline">Cuenta</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
                    {initials}
                  </span>
                </button>
                {accountOpen && (
                  <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_30px_60px_-35px_rgba(0,0,0,0.45)]">
                    <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3">
                      <p className="text-sm font-semibold text-neutral-900">{displayName}</p>
                      <p className="text-xs text-neutral-500">{user?.email}</p>
                    </div>
                    <div className="flex flex-col">
                      <Link
                        href="/mis-datos"
                        className="px-4 py-3 text-sm text-neutral-700 transition hover:bg-neutral-100"
                      >
                        Mis datos
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="flex items-center gap-2 px-4 py-3 text-left text-sm text-neutral-700 transition hover:bg-neutral-100"
                      >
                        <FaSignOutAlt className="h-4 w-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-xl text-neutral-700 transition hover:border-neutral-300 lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Abrir menú"
              >
                <IoMdMenu />
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>

      {mobileOpen && session && (
        <div
          className="fixed inset-0 z-40 bg-neutral-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          role="presentation"
        >
          <div
            className="absolute right-0 top-0 flex h-full w-80 max-w-[80vw] flex-col gap-6 overflow-y-auto bg-white p-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.45)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-neutral-900">{displayName}</p>
                <p className="text-xs text-neutral-500">{isAdmin ? "Administración" : "Coworker"}</p>
              </div>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-xl text-neutral-700"
                onClick={() => setMobileOpen(false)}
                aria-label="Cerrar menú"
              >
                <IoMdClose />
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const active = pathname?.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                      active ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-900/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/mis-datos"
                className="rounded-lg px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-900/5"
              >
                Mis datos
              </Link>
            </nav>

            <button
              onClick={() => signOut()}
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              <FaSignOutAlt className="h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function FooterWithAccount() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const quickLinks = useMemo(() => {
    const links = [
      { href: "/pedidos/realizar", label: "Realizar pedido" },
      { href: "/pedidos/historial", label: "Historial" },
      { href: "/mis-datos", label: "Mis datos" },
    ];
    if (isAdmin) {
      links.splice(1, 0, { href: "/pedidos", label: "Panel" });
      links.push({ href: "/productos", label: "Productos" }, { href: "/clientes", label: "Usuarios" });
    }
    return links;
  }, [isAdmin]);

  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-neutral-200 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-10 px-4 py-12 md:flex-row md:justify-between md:px-6">
        <div className="max-w-sm space-y-4">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold tracking-[0.3em] text-white">
              LAOFI
            </span>
            <p className="text-sm font-semibold text-neutral-900">Pedidos de café para la comunidad.</p>
          </div>
          <p className="text-sm text-neutral-600">
            Confirmá tus bebidas sin salir de tu escritorio. Recepción recibe el aviso en tiempo real para que sólo tengas que disfrutar.
          </p>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-900">Accesos rápidos</h3>
            <nav className="flex flex-col gap-2 text-sm text-neutral-600">
              {quickLinks.map((link) => (
                <Link key={link.href} href={link.href} className="transition hover:text-neutral-900">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-900">Soporte</h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>Recepción: 11 5263 3006</li>
              <li>hola@laofi.com</li>
              <li>Av. Rivadavia 14084, Ramos Mejía</li>
              <li>Lunes a viernes · 8 a 19 h</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-neutral-200 bg-white/60 py-5">
        <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-3 px-4 text-xs text-neutral-500 md:flex-row md:px-6">
          <span>© {year} laofi.co · Todos los derechos reservados.</span>
          <span>Versiones nuevas del panel se publican periódicamente.</span>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const marketingRoutes = ["/", "/servicios", "/reserva", "/login", "/register"];
  const isMarketing = marketingRoutes.includes(pathname ?? "");

  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/logolaofi.svg" type="image/svg+xml" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white min-h-dvh flex flex-col`}>
        <AuthProvider>
          {!isMarketing && <HeaderWithAccount />}
          <AdminNotificationListener />
          <main className="flex flex-col flex-grow w-full">{children}</main>
          {!isMarketing && <FooterWithAccount />}
        </AuthProvider>
      </body>
    </html>
  );
}
