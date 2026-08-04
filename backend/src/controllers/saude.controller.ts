import type { FastifyReply, FastifyRequest } from "fastify";
import { verificarBanco } from "../services/saude.service.js";

export async function consultarSaude(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const database = await verificarBanco();
  const saudavel = database === "connected";

  return reply.code(saudavel ? 200 : 503).send({
    status: saudavel ? "ok" : "degraded",
    api: "online",
    database,
    timestamp: new Date().toISOString(),
  });
}
