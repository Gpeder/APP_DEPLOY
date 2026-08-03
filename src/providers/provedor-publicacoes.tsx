import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ContextoPublicacoes,
  type ValorContextoPublicacoes,
} from "@/hooks/contexto-publicacoes";
import { publicacoesIniciais } from "@/mocks/publicacoes";
import {
  avancarPublicacaoSimulada,
  iniciarPublicacaoSimulada,
  INTERVALO_SIMULACAO_FILA_MS,
  STATUS_PUBLICACOES_ATIVAS,
} from "@/mocks/simulador-fila-publicacao";
import type {
  ItemPublicacao,
  ResumoAplicativoPublicacao,
  StatusFilaPublicacao,
} from "@/types";

function criarItensPublicacao(
  dataPublicacao: string,
  aplicativos: ResumoAplicativoPublicacao[],
  notasVersao: string,
): ItemPublicacao[] {
  return aplicativos.map((aplicativo) => ({
    id: crypto.randomUUID(),
    dataPublicacao,
    nomeAplicativo: aplicativo.nomeAplicativo,
    branch: aplicativo.branch,
    versao: aplicativo.versao,
    notasVersao,
    prioridade: aplicativo.prioridade,
    status: "waiting",
    googlePlay: {
      habilitada: aplicativo.googlePlayHabilitado,
      status: aplicativo.googlePlayHabilitado ? "waiting_queue" : "disabled",
      progresso: 0,
    },
    appStore: {
      habilitada: aplicativo.appStoreHabilitado,
      status: aplicativo.appStoreHabilitado ? "waiting_queue" : "disabled",
      progresso: 0,
    },
  }));
}

export function ProvedorPublicacoes({ children }: { children: ReactNode }) {
  const [publicacoes, definirPublicacoes] =
    useState<ItemPublicacao[]>(publicacoesIniciais);
  const [statusFila, definirStatusFila] =
    useState<StatusFilaPublicacao>("running");

  useEffect(() => {
    if (statusFila !== "running") return;

    const temporizador = window.setInterval(() => {
      definirPublicacoes((atuais) => {
        const indiceAtivo = atuais.findIndex((item) =>
          STATUS_PUBLICACOES_ATIVAS.has(item.status),
        );

        if (indiceAtivo >= 0) {
          return atuais.map((item, indice) => {
            if (indice !== indiceAtivo) return item;

            const resultado = avancarPublicacaoSimulada(item);
            if (resultado.pausarFila) definirStatusFila("paused");
            return resultado.publicacao;
          });
        }

        const indicePrioridade = atuais.findIndex(
          (item) => item.status === "waiting" && item.prioridade,
        );
        const proximoIndice =
          indicePrioridade >= 0
            ? indicePrioridade
            : atuais.findIndex((item) => item.status === "waiting");

        if (proximoIndice < 0) {
          definirStatusFila("completed");
          return atuais;
        }

        return atuais.map((item, indice) =>
          indice === proximoIndice ? iniciarPublicacaoSimulada(item) : item,
        );
      });
    }, INTERVALO_SIMULACAO_FILA_MS);

    return () => window.clearInterval(temporizador);
  }, [statusFila]);

  const valor = useMemo<ValorContextoPublicacoes>(() => {
    const publicacaoEmFoco =
      publicacoes.find(
        (item) =>
          STATUS_PUBLICACOES_ATIVAS.has(item.status) ||
          item.status === "failed" ||
          item.status === "waiting",
      ) ?? publicacoes.at(-1);

    return {
      publicacoes,
      statusFila,
      dataFila: publicacaoEmFoco?.dataPublicacao,
      contagens: {
        aguardando: publicacoes.filter((item) => item.status === "waiting")
          .length,
        ativas: publicacoes.filter((item) =>
          STATUS_PUBLICACOES_ATIVAS.has(item.status),
        ).length,
        concluidas: publicacoes.filter((item) => item.status === "success")
          .length,
        comErro: publicacoes.filter((item) => item.status === "failed").length,
      },
      adicionarPublicacoes: (dataPublicacao, aplicativos, notasVersao) => {
        const novosItens = criarItensPublicacao(
          dataPublicacao,
          aplicativos,
          notasVersao,
        );
        definirPublicacoes((atuais) => [...atuais, ...novosItens]);
        if (!publicacoes.some((item) => item.status === "failed")) {
          definirStatusFila("running");
        }
      },
      iniciarFila: () => {
        if (!publicacoes.some((item) => item.status === "failed")) {
          definirStatusFila("running");
        }
      },
      pausarFila: () => definirStatusFila("paused"),
      tentarAplicativoNovamente: (id) => {
        definirPublicacoes((atuais) =>
          atuais.map((publicacao) => {
            if (publicacao.id !== id) return publicacao;

            const googleFalhou = publicacao.googlePlay.status === "failed";

            return {
              ...publicacao,
              status: googleFalhou ? "publishing" : "partial",
              googlePlay: googleFalhou
                ? { ...publicacao.googlePlay, status: "publishing" }
                : publicacao.googlePlay,
              appStore:
                publicacao.appStore.status === "failed"
                  ? { ...publicacao.appStore, status: "publishing" }
                  : publicacao.appStore,
              simularFalhaAppStore: false,
              mensagemErro: undefined,
            };
          }),
        );
        definirStatusFila("running");
      },
    };
  }, [publicacoes, statusFila]);

  return (
    <ContextoPublicacoes.Provider value={valor}>
      {children}
    </ContextoPublicacoes.Provider>
  );
}
