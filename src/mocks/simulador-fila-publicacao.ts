import type { ItemPublicacao } from "@/types";

export const INTERVALO_SIMULACAO_FILA_MS = 1200;

export const STATUS_PUBLICACOES_ATIVAS = new Set<ItemPublicacao["status"]>([
  "publishing",
  "partial",
]);

export function iniciarPublicacaoSimulada(
  publicacao: ItemPublicacao,
): ItemPublicacao {
  if (publicacao.googlePlay.habilitada) {
    return {
      ...publicacao,
      status: "publishing",
      googlePlay: { ...publicacao.googlePlay, status: "publishing" },
      appStore: publicacao.appStore.habilitada
        ? { ...publicacao.appStore, status: "waiting_google" }
        : publicacao.appStore,
    };
  }

  return {
    ...publicacao,
    status: "publishing",
    appStore: { ...publicacao.appStore, status: "publishing" },
  };
}

export function avancarPublicacaoSimulada(
  publicacao: ItemPublicacao,
): { publicacao: ItemPublicacao; pausarFila: boolean } {
  const google = publicacao.googlePlay;
  const apple = publicacao.appStore;

  if (google.habilitada && google.status !== "published") {
    const progresso = Math.min(100, google.progresso + 20);

    return {
      pausarFila: false,
      publicacao:
        progresso === 100
          ? {
              ...publicacao,
              status: apple.habilitada ? "partial" : "success",
              googlePlay: { ...google, status: "published", progresso },
            }
          : {
              ...publicacao,
              status: "publishing",
              googlePlay: { ...google, status: "publishing", progresso },
            },
    };
  }

  if (apple.habilitada && apple.status !== "published") {
    if (
      apple.status === "waiting_google" ||
      apple.status === "waiting_queue" ||
      apple.status === "building"
    ) {
      return {
        pausarFila: false,
        publicacao: {
          ...publicacao,
          status: google.habilitada ? "partial" : "publishing",
          appStore: { ...apple, status: "publishing", progresso: 0 },
        },
      };
    }

    const progresso = Math.min(100, apple.progresso + 20);

    if (publicacao.simularFalhaAppStore && progresso >= 60) {
      return {
        pausarFila: true,
        publicacao: {
          ...publicacao,
          status: "failed",
          appStore: { ...apple, status: "failed", progresso },
          mensagemErro:
            "A App Store rejeitou o envio durante a validação do pacote.",
        },
      };
    }

    return {
      pausarFila: false,
      publicacao:
        progresso === 100
          ? {
              ...publicacao,
              status: "success",
              appStore: { ...apple, status: "published", progresso },
            }
          : {
              ...publicacao,
              status: google.habilitada ? "partial" : "publishing",
              appStore: { ...apple, status: "publishing", progresso },
            },
    };
  }

  return {
    pausarFila: false,
    publicacao: { ...publicacao, status: "success" },
  };
}
