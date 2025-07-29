"use client";
import React, { useEffect, useRef } from "react";

export default function NotificacionesSonido() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const lastNotifId = useRef<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    async function checkNotificaciones() {
      const res = await fetch("/api/notificaciones");
      const notifs = await res.json();
      if (notifs.length > 0) {
        // Solo sonar si hay una nueva notificación
        const nueva = notifs[0];
        if (lastNotifId.current !== nueva._id) {
          lastNotifId.current = nueva._id;
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          }
        }
      }
    }
    interval = setInterval(checkNotificaciones, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <audio ref={audioRef} src="/positive-notification.wav" preload="auto" />
    </>
  );
}
