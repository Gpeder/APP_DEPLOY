import type { ItemPublicacao } from "@/types";

export function obterProgressoPublicacao(publicacao: ItemPublicacao) {
  const plataformas = [publicacao.googlePlay, publicacao.appStore].filter(
    (plataforma) => plataforma.habilitada,
  );

  if (plataformas.length === 0) return 0;

  return Math.round(
    plataformas.reduce(
      (total, plataforma) => total + plataforma.progresso,
      0,
    ) / plataformas.length,
  );
}
