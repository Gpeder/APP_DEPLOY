import type { FastifyReply, FastifyRequest } from "fastify";
import type { RepositoryProvider } from "../generated/prisma/client.js";
import {
  atualizarAplicativo,
  atualizarStatusAplicativo,
  buscarAplicativoPorId,
  criarAplicativo,
  listarAplicativos,
  type DadosAtualizacaoAplicativo,
  type DadosCriacaoAplicativo,
} from "../services/aplicativos.service.js";

export type ParametrosIdAplicativo = {
  id: number;
};

export type CorpoCriacaoAplicativo = {
  name: string;
  repositoryProvider: RepositoryProvider;
  repositoryUrl: string;
  branch: string;
  active?: boolean;
  configurationValid?: boolean;
};

export type CorpoAtualizacaoAplicativo = DadosAtualizacaoAplicativo;

export type CorpoStatusAplicativo = {
  active: boolean;
};

function responderNaoEncontrado(reply: FastifyReply) {
  return reply.code(404).send({
    statusCode: 404,
    error: "Not Found",
    message: "Aplicativo não encontrado.",
  });
}

export async function cadastrarAplicativo(
  request: FastifyRequest<{ Body: CorpoCriacaoAplicativo }>,
  reply: FastifyReply,
) {
  const dados: DadosCriacaoAplicativo = request.body;
  const aplicativo = await criarAplicativo(dados);

  return reply.code(201).send(aplicativo);
}

export async function consultarAplicativos() {
  return listarAplicativos();
}

export async function consultarAplicativoPorId(
  request: FastifyRequest<{ Params: ParametrosIdAplicativo }>,
  reply: FastifyReply,
) {
  const aplicativo = await buscarAplicativoPorId(request.params.id);

  if (!aplicativo) return responderNaoEncontrado(reply);

  return reply.send(aplicativo);
}

export async function substituirAplicativo(
  request: FastifyRequest<{
    Params: ParametrosIdAplicativo;
    Body: CorpoAtualizacaoAplicativo;
  }>,
  reply: FastifyReply,
) {
  const aplicativo = await atualizarAplicativo(
    request.params.id,
    request.body,
  );

  if (!aplicativo) return responderNaoEncontrado(reply);

  return reply.send(aplicativo);
}

export async function alterarStatusAplicativo(
  request: FastifyRequest<{
    Params: ParametrosIdAplicativo;
    Body: CorpoStatusAplicativo;
  }>,
  reply: FastifyReply,
) {
  const aplicativo = await atualizarStatusAplicativo(
    request.params.id,
    request.body.active,
  );

  if (!aplicativo) return responderNaoEncontrado(reply);

  return reply.send(aplicativo);
}
