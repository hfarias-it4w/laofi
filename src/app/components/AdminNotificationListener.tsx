// src/app/components/AdminNotificationListener.tsx
"use client";
import { useEffect } from "react";
import { getSocket } from "@/lib/socketClient";
import { useSession } from "next-auth/react";

export default function AdminNotificationListener() {
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.user?.role !== "admin") return;
    const socket = getSocket();
    const audio = new Audio("/positive-notification.wav");
    const handler = () => {
      audio.play();
    };
    socket.on("nuevo-pedido", handler);
    return () => {
      socket.off("nuevo-pedido", handler);
    };
  }, [session?.user?.role]);
  return null;
}
