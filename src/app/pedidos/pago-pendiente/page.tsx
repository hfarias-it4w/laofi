export default function PagoPendiente() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-3xl font-bold text-yellow-600 mb-4">Pago Pendiente</h1>
      <p className="text-gray-700 mb-6">Tu pago está pendiente de confirmación. Te avisaremos cuando se acredite.</p>
      <a
        href="/pedidos/realizar"
        className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
      >
        Volver a los pedidos
      </a>
    </div>
  );
}