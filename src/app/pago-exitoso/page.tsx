import React from "react";

export default function PagoExitoso() {
  return (
    <div className="max-w-xl mx-auto p-8 flex flex-col items-center justify-center min-h-[60vh]">
      <span className="text-green-600 text-6xl mb-4">✔️</span>
      <h1 className="text-3xl font-bold mb-2">¡Pago realizado con éxito!</h1>
      <p className="text-lg text-gray-700 mb-4">Tu pedido fue registrado correctamente.<br />En breve recibirás la confirmación y el estado de tu pedido.</p>
      <a href="/" className="mt-4 text-blue-600 hover:underline">Volver al inicio</a>
    </div>
  );
}
