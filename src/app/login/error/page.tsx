import Link from "next/link";

export default function ErrorPage({ searchParams }: { searchParams?: { error?: string } }) {
  const error = searchParams?.error;
  let message = "Ocurrió un error desconocido.";
  if (error === "CredentialsSignin") {
    message = "Credenciales incorrectas. Intenta nuevamente.";
  } else if (error) {
    message = decodeURIComponent(error);
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      <div className="bg-white/90 shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error de autenticación</h1>
        <p className="mb-4 text-gray-700">{message}</p>
        <Link href="/login" className="text-blue-700 hover:underline">Volver al login</Link>
      </div>
    </div>
  );
}
