import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function AdminOnlyLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession();
  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }
  return <>{children}</>;
}
