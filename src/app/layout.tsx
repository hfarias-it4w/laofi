"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { IoMdMenu } from "react-icons/io";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


import AuthProvider from "./AuthProvider";
import { useSession, signOut } from "next-auth/react";

// Extiende el tipo de usuario de NextAuth para incluir 'role'
declare module "next-auth" {
  interface User {
    role?: string;
  }
}
import { useState } from "react";

function HeaderWithAccount() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const isAdmin = session?.user?.role === "admin";
  return (
    <header className="w-full flex items-center justify-between px-6 py-3" style={{ background: '#13B29F' }}>
      <a href="/" className="flex items-center">
        <img src="/logolaofi-blanco.png" alt="Logo Laofi" className="h-7 w-auto mr-3" />
        <span className="text-white font-bold text-xl tracking-wide"></span>
      </a>
      {session && (
        <div className="relative">
          <button
            className="p-2 text-white text-2xl hover:bg-[#13B29F]/20 rounded-full transition-colors focus:outline-none"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            <IoMdMenu />
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
              {isAdmin && (
                <>
                  <a
                    href="/productos"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Productos
                  </a>
                  <a
                    href="/clientes"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Usuarios
                  </a>
                </>
              )}
              <a
                href="/mis-datos"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Mis datos
              </a>
              <button
                onClick={() => { setOpen(false); signOut(); }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/logolaofi.svg" type="image/svg+xml" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white min-h-dvh flex flex-col`}>
        <AuthProvider>
          <HeaderWithAccount />
          <main className="flex flex-col flex-grow w-full">{children}</main>
        </AuthProvider>
        <footer className="w-full text-center py-4 mt-auto" style={{ background: '#3A3A3A' }}>
          <span className="text-white text-sm">&copy; {new Date().getFullYear()} laofi.co. Todos los derechos reservados.</span>
        </footer>
      </body>
    </html>
  );
}
