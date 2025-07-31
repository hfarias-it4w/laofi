export default function PagoCancelado() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Pago Cancelado</h1>
      <p className="text-gray-700 mb-6">Tu pago fue cancelado o no se completó. Puedes intentarlo nuevamente desde la sección de pedidos.</p>
      <a
        href="/pedidos/realizar"
        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Volver a los pedidos
      </a>
    </div>
  );
}