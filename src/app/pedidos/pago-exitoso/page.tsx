"use client";
import Link from "next/link";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BsFillExclamationOctagonFill } from "react-icons/bs";

export default function PagoExitoso() {
  const { data: session } = useSession();
  const router = useRouter();
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#f5f6fa] to-[#e3e6ed] font-sans">
        <div className="flex flex-col items-center mt-10">
          <div className="text-red-600 text-4xl mb-6"><BsFillExclamationOctagonFill /></div>
          <div className="text-red-600 text-xl mb-6">Debes iniciar sesión para ver esta página.</div>
          <button
            className="bg-[#13B29F] hover:bg-[#119e8d] text-white rounded-xl py-3 px-6 text-lg font-semibold transition-colors"
            onClick={() => router.push("/login")}
          >
            Ir al login
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f5f6fa] to-[#e3e6ed] font-sans">
      <div className="flex flex-col items-center w-full max-w-md px-4">
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full border border-gray-100 flex flex-col items-center text-center">
          <span className="text-green-600 text-6xl mb-4">✔️</span>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Pago exitoso!</h1>
          <p className="text-lg text-gray-700 mb-4">
           <br />
            Acercate a recepción para que podamos preparar tu pedido.<br /><br />
            ¡Gracias!
          </p>
          <Link href="/" className="mt-4 font-semibold text-[#13B29F] hover:underline">Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}
