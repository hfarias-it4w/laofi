"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  // Suponiendo que el rol está en session.user.role
  const role = session?.user?.role;

  // Links base para todos
  const links = [
    {
      href: "/",
      label: "Comprar Café",
      icon: "☕",
      allowed: ["admin", "cliente", "vendedor"],
    },
    {
      href: "/pedidos",
      label: "Ver Pedidos",
      icon: "📦",
      allowed: ["admin", "cliente", "vendedor"],
    },
    {
      href: "/clientes",
      label: "ABM Clientes",
      icon: "👥",
      allowed: ["admin", "vendedor"],
    },
    {
      href: "/productos",
      label: "ABM Productos",
      icon: "🛒",
      allowed: ["admin", "vendedor"],
    },
    {
      href: "/login",
      label: "Login",
      icon: "🔑",
      allowed: ["admin", "cliente", "vendedor", undefined], // visible para todos
    },
  ];

  return (
    <nav className="w-full flex justify-center mb-8">
      <div className="flex gap-6 bg-white/90 shadow rounded-full px-8 py-3 items-center">
        {links
          .filter((l) => !role || l.allowed.includes(role))
          .map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-2 font-semibold text-blue-700 hover:text-pink-600 transition-colors"
            >
              <span role="img" aria-label={l.label}>{l.icon}</span> {l.label}
            </Link>
          ))}
        {/* Botón usuario logueado */}
        {session?.user && (
          <button
            type="button"
            className="ml-4 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold border border-blue-200 flex items-center gap-2 cursor-default"
            title={session.user.email ?? undefined}
            disabled
          >
            <span role="img" aria-label="Usuario">👤</span>
            {session.user.name || session.user.email}
          </button>
        )}
      </div>
    </nav>
  );
}
