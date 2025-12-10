// src/lib/socketServer.ts
import { Server } from "socket.io";
import type { NextApiResponse } from "next";
import type { Server as HTTPServer } from "http";

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: HTTPServer & {
      io?: Server;
    };
  };
};

let io: Server | null = null;

export function getSocketServer(res?: NextApiResponseWithSocket) {
  if (io) {
    return io;
  }
  if (!res) {
    return null;
  }
  if (!res.socket.server.io) {
    io = new Server(res.socket.server, {
      path: "/api/socketio",
      addTrailingSlash: false,
    });
    res.socket.server.io = io;
  } else {
    io = res.socket.server.io;
  }
  return io;
}
