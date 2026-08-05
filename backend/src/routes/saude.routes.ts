import type { FastifyInstance } from "fastify";
import { consultarSaude } from "../controllers/saude.controller.js";

export async function rotasSaude(app: FastifyInstance) {
  app.get("/saude", consultarSaude);
}
