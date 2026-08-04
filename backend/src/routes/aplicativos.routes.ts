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
    "/applications",
    {
      schema: {
        body: schemaCriacaoAplicativo,
      },
    },
    cadastrarAplicativo,
  );

  app.get("/applications", consultarAplicativos);

  app.get<{ Params: ParametrosIdAplicativo }>(
    "/applications/:id",
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
    "/applications/:id",
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
    "/applications/:id/status",
    {
      schema: {
        params: schemaParametrosIdAplicativo,
        body: schemaStatusAplicativo,
      },
    },
    alterarStatusAplicativo,
  );
}
