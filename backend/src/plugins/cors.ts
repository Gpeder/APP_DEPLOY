import cors from "@fastify/cors";
import type { FastifyInstance } from "fastify";

const origensFrontend = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

export async function configurarCors(app: FastifyInstance) {
  await app.register(cors, {
    origin: origensFrontend,
    methods: ["GET", "POST", "PUT", "PATCH", "OPTIONS"],
  });
}
