import {
  Prisma,
  type RepositoryProvider,
} from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";

export type DadosCriacaoAplicativo = {
  name: string;
  repositoryProvider: RepositoryProvider;
  repositoryUrl: string;
  branch: string;
  active?: boolean;
  configurationValid?: boolean;
};

export type DadosAtualizacaoAplicativo = {
  name: string;
  repositoryProvider: RepositoryProvider;
  repositoryUrl: string;
  branch: string;
  active: boolean;
  configurationValid: boolean;
};

function registroNaoEncontrado(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  );
}

export async function criarAplicativo(dados: DadosCriacaoAplicativo) {
  return prisma.application.create({
    data: {
      name: dados.name.trim(),
      repositoryProvider: dados.repositoryProvider,
      repositoryUrl: dados.repositoryUrl.trim(),
      branch: dados.branch.trim(),
      active: dados.active ?? true,
      configurationValid: dados.configurationValid ?? false,
    },
  });
}

export async function listarAplicativos() {
  return prisma.application.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function buscarAplicativoPorId(id: number) {
  return prisma.application.findUnique({
    where: { id },
  });
}

export async function atualizarAplicativo(
  id: number,
  dados: DadosAtualizacaoAplicativo,
) {
  try {
    return await prisma.application.update({
      where: { id },
      data: {
        ...dados,
        name: dados.name.trim(),
        repositoryUrl: dados.repositoryUrl.trim(),
        branch: dados.branch.trim(),
      },
    });
  } catch (error) {
    if (registroNaoEncontrado(error)) return null;
    throw error;
  }
}

export async function atualizarStatusAplicativo(id: number, active: boolean) {
  try {
    return await prisma.application.update({
      where: { id },
      data: { active },
    });
  } catch (error) {
    if (registroNaoEncontrado(error)) return null;
    throw error;
  }
}
