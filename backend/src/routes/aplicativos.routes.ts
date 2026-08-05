import type { FastifyInstance } from "fastify";
import {
  alterarStatusAplicativo,
  cadastrarAplicativo,
  consultarAplicativoPorId,
  consultarAplicativos,
  substituirAplicativo,
  type CorpoAtualizacaoAplicativo,
  type CorpoCriacaoAplicativo,
  type CorpoStatusAplicativo,
  type ParametrosIdAplicativo,
} from "../controllers/aplicativos.controller.js";
import {
  schemaAtualizacaoAplicativo,
  schemaCriacaoAplicativo,
  schemaParametrosIdAplicativo,
  schemaStatusAplicativo,
} from "./aplicativos.schemas.js";

export async function rotasAplicativos(app: FastifyInstance) {
  app.post<{ Body: CorpoCriacaoAplicativo }>(
    "/aplicativos",
    {
      schema: {
        body: schemaCriacaoAplicativo,
      },
    },
    cadastrarAplicativo,
  );

  app.get("/aplicativos", consultarAplicativos);

  app.get<{ Params: ParametrosIdAplicativo }>(
    "/aplicativos/:id",
    {
      schema: {
        params: schemaParametrosIdAplicativo,
      },
    },
    consultarAplicativoPorId,
  );

  app.put<{
    Params: ParametrosIdAplicativo;
    Body: CorpoAtualizacaoAplicativo;
  }>(
    "/aplicativos/:id",
    {
      schema: {
        params: schemaParametrosIdAplicativo,
        body: schemaAtualizacaoAplicativo,
      },
    },
    substituirAplicativo,
  );

  app.patch<{
    Params: ParametrosIdAplicativo;
    Body: CorpoStatusAplicativo;
  }>(
    "/aplicativos/:id/status",
    {
      schema: {
        params: schemaParametrosIdAplicativo,
        body: schemaStatusAplicativo,
      },
    },
    alterarStatusAplicativo,
  );
}
