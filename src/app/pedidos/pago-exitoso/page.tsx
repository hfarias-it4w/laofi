"use client";
import React from "react";

export default function PagoExitoso() {
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
