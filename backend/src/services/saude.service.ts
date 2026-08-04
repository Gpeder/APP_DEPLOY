import { prisma } from "../lib/prisma.js";

export type EstadoBanco = "connected" | "disconnected";

export async function verificarBanco(): Promise<EstadoBanco> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return "connected";
  } catch {
    return "disconnected";
  }
}
