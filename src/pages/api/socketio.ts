// src/pages/api/socketio.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getSocketServer } from "@/lib/socketServer";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  getSocketServer(res);
  res.end();
}
