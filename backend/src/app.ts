import Fastify from "fastify";
import { configurarCors } from "./plugins/cors.js";
import { conectarPrisma } from "./plugins/prisma.js";
import { configurarTratamentoErros } from "./plugins/tratamento-erros.js";
import { rotasAplicativos } from "./routes/aplicativos.routes.js";
import { rotasSaude } from "./routes/saude.routes.js";

export async function criarAplicacao() {
  const app = Fastify({
    logger: true,
  });

  configurarTratamentoErros(app);
  await configurarCors(app);
  await conectarPrisma(app);
  await app.register(rotasSaude);
  await app.register(rotasAplicativos);

  return app;
}
