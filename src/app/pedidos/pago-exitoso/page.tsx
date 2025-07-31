"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BsFillExclamationOctagonFill } from "react-icons/bs";

export default function PagoExitoso() {
  const { data: session } = useSession();
  const router = useRouter();
  if (!session) {
    return (
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
    );
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
      <div className="max-w-xl w-full p-8 flex flex-col items-center justify-center text-center">
        <span className="text-green-600 text-6xl mb-4">✔️</span>
        <h1 className="text-3xl font-bold mb-2">¡Pago realizado con éxito!</h1>
        <p className="text-lg text-gray-700 mb-4">
          Tu pedido fue registrado correctamente.<br />
          Acercate a recepción a realizar el pago para que podamos preparar tu pedido.<br />
          ¡Gracias!
        </p>
        <a href="/" className="mt-4 text-blue-600 hover:underline">Volver al inicio</a>
      </div>
    </div>
  );
}
