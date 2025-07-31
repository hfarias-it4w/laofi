"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BsFillExclamationOctagonFill } from "react-icons/bs";
import { TbXboxX } from "react-icons/tb";

export default function PagoCancelado() {
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
          <span className="text-red-500 text-6xl mb-4"><TbXboxX /></span>
          <h1 className="text-3xl font-bold text-red-600 mb-2">Pago Cancelado</h1>
          <p className="text-lg text-gray-700 mb-4">Tu pago fue cancelado o no se completó. Puedes intentarlo nuevamente desde la sección de pedidos.</p>
          <a
            href="/pedidos/realizar"
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
          >
            Volver a los pedidos
          </a>
        </div>
      </div>
    </div>
  );
}
