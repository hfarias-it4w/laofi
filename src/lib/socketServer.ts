// src/lib/socketServer.ts
import { Server } from "socket.io";
import type { NextApiResponse } from "next";

let io: Server | null = null;

export function getSocketServer(res: NextApiResponse) {
  if (!io) {
    // @ts-ignore
    if (!res.socket.server.io) {
      // @ts-ignore
      io = new Server(res.socket.server, {
        path: "/api/socketio",
        addTrailingSlash: false,
      });
      // @ts-ignore
      res.socket.server.io = io;
    } else {
      // @ts-ignore
      io = res.socket.server.io;
    }
  }
  return io;
}
