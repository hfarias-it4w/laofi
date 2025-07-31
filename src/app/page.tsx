
"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { FaCoffee } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { useRouter } from "next/navigation";

type UserWithRole = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
};

export default function Home() {
  const { data: session } = useSession();
  const user = session?.user as UserWithRole | undefined;
  const router = useRouter();

  return (
    <div className="flex flex-col items-center flex-grow py-4 px-4 bg-white">
      {/* Logo laofi en el centro */}
      <img src="/logolaofi.svg" alt="Logo Laofi" className="h-24 w-auto mb-6 mt-12" />

      {/* Mensaje de bienvenida */}
      <h1 className="text-2xl font-bold text-[#3A3A3A] mb-2">Hola, {user?.name || user?.email || 'Visitante'}!</h1>

      {/* Mensaje de bienvenida */}
      <h1 className="text-2xl font-bold text-[#3A3A3A] mb-2">Rol: {user?.role}</h1>

      {/* Botones grandes */}
      <div className="flex flex-col sm:flex-row gap-6 mt-6 mb-10 w-full max-w-md justify-center">
        <a
          href="/pedidos/realizar"
          className="flex flex-col items-center justify-center flex-1 bg-[#13B29F] hover:bg-[#119e8d] text-white rounded-xl shadow-lg py-8 px-6 transition-colors text-center text-xl font-semibold gap-3"
        >
          {/* Favicon taza de café (emoji) */}
          <i className="text-4xl mb-2" aria-label="Taza de café"> <FaCoffee /></i> 
          Pedir café
        </a>
        <button
          type="button"
          className="flex flex-col items-center justify-center flex-1 bg-[#3A3A3A] hover:bg-[#222] text-white rounded-xl shadow-lg py-8 px-6 transition-colors text-center text-xl font-semibold gap-3"
          onClick={() => {
            if (user?.role === "admin") {
              router.push("/pedidos");
            } else {
              router.push("/pedidos/historial");
            }
          }}
        >
          {/* Favicon reloj (emoji) */}
          <span className="text-4xl mb-2" role="img" aria-label="Reloj"><FaHistory /></span>
          Historial de pedidos
        </button>
      </div>
    </div>
  );
}
