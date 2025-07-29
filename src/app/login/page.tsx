
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


import AuthTabsClient from "./AuthTabsClient";


export default async function LoginPage() {
  // Si ya está logueado, redirigir al home
  const session = await getServerSession();
  if (session) redirect("/");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50">
      <AuthTabsClient />
    </div>
  );
}
