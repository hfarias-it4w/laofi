// src/pages/api/socketio.ts
import type { NextApiRequest } from "next";
import { getSocketServer, type NextApiResponseWithSocket } from "@/lib/socketServer";

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  getSocketServer(res);
  res.end();
}
