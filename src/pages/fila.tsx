import { Button } from "@/components/ui/button";
import { CabecalhoPagina } from "@/components/ui/cabecalho-pagina";
import { IdentificacaoAplicativo } from "@/components/ui/identificacao-aplicativo";
import { Modal } from "@/components/ui/modal";
import {
  EmblemaStatusPublicacao,
  ProgressoPlataforma,
} from "@/features/publicacoes/componentes-fila";
import { useFilaPublicacao } from "@/hooks/use-fila-publicacao";
import { formatarDataPublicacao } from "@/lib/formatar-data";
import { obterProgressoPublicacao } from "@/lib/publicacao";
import type { ItemPublicacao } from "@/types";
import {
  AlertTriangle,
  CirclePause,
  Crown,
  Play,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import { useMemo, useState } from "react";

export function Fila() {
  const {
    publicacoes,
    statusFila,
    dataFila,
    contagens,
    iniciarFila,
    pausarFila,
    tentarAplicativoNovamente,
  } = useFilaPublicacao();
  const [detalhesErro, definirDetalhesErro] = useState<ItemPublicacao | null>(
    null,
  );

  const publicacoesOrdenadas = useMemo(() => {
    const obterOrdem = (publicacao: ItemPublicacao) => {
      if (
        publicacao.status === "publishing" ||
        publicacao.status === "partial"
      ) {
        return 0;
      }
      if (publicacao.status === "failed") return 1;
      if (publicacao.status === "waiting") {
        return publicacao.prioridade ? 2 : 3;
      }
      if (publicacao.status === "success") return 4;
      return 5;
    };

    return [...publicacoes].sort(
      (primeira, segunda) => obterOrdem(primeira) - obterOrdem(segunda),
    );
  }, [publicacoes]);

  const possuiErroBloqueante = publicacoes.some(
    (publicacao) => publicacao.status === "failed",
  );

  return (
    <>
      <CabecalhoPagina
        titulo="Fila"
        descricao="Acompanhe os aplicativos da publicação atual."
        acao={
          statusFila === "running" ? (
            <Button
              type="button"
              variant="secondary"
              className="button"
              onClick={pausarFila}
            >
              <CirclePause size={16} />
              Pausar
            </Button>
          ) : (
            <Button
              type="button"
              className="button"
              onClick={iniciarFila}
              disabled={possuiErroBloqueante || statusFila === "completed"}
            >
              <Play size={16} />
              {statusFila === "paused" ? "Continuar fila" : "Iniciar fila"}
            </Button>
          )
        }
      />

      <div className={`queue-banner queue-banner-${statusFila}`}>
        <span>
          {possuiErroBloqueante ? (
            <AlertTriangle size={17} />
          ) : (
            <RefreshCw
              size={16}
              className={statusFila === "running" ? "spin" : ""}
            />
          )}
        </span>
        <div>
          <strong>
            Publicação de{" "}
            {dataFila ? formatarDataPublicacao(dataFila) : "data não definida"}{" "}
            ·{" "}
            {possuiErroBloqueante
              ? "Pausada por erro"
              : statusFila === "running"
                ? "Em andamento"
                : statusFila === "completed"
                  ? "Concluída"
                  : "Pausada"}
          </strong>
          <small>
            {possuiErroBloqueante
              ? "Resolva o erro para continuar com o próximo aplicativo."
              : "Um aplicativo começa somente quando o anterior termina."}
          </small>
        </div>
      </div>

      <div className="queue-simple-summary">
        <div>
          <small>Aguardando</small>
          <strong>{contagens.aguardando}</strong>
        </div>
        <div>
          <small>Publicando</small>
          <strong>{contagens.ativas}</strong>
        </div>
        <div>
          <small>Concluídos</small>
          <strong>{contagens.concluidas}</strong>
        </div>
        <div>
          <small>Com erro</small>
          <strong>{contagens.comErro}</strong>
        </div>
      </div>

      <section className="panel queue-panel">
        <div className="publication-list">
          {publicacoesOrdenadas.map((publicacao, indice) => {
            const progresso = obterProgressoPublicacao(publicacao);
            const estaAtiva =
              publicacao.status === "publishing" ||
              publicacao.status === "partial";

            return (
              <article
                key={publicacao.id}
                className={`publication-row ${
                  estaAtiva ? "publication-row-active" : ""
                } ${
                  publicacao.status === "failed"
                    ? "publication-row-failed"
                    : ""
                }`}
              >
                <div className="publication-main">
                  <span className="queue-position">{indice + 1}</span>
                  <IdentificacaoAplicativo
                    nome={publicacao.nomeAplicativo}
                    detalhes={
                      <>
                        {publicacao.branch} · v{publicacao.versao}
                      </>
                    }
                  />
                  {publicacao.prioridade && (
                    <span className="priority-badge">
                      <Crown size={13} />
                      Prioridade
                    </span>
                  )}
                  <EmblemaStatusPublicacao status={publicacao.status} />
                </div>

                <div className="publication-progress">
                  <div>
                    <span>Progresso</span>
                    <strong>{progresso}%</strong>
                  </div>
                  <div className="publication-progress-track">
                    <i style={{ width: `${progresso}%` }} />
                  </div>
                </div>

                <div className="queue-platforms">
                  {publicacao.googlePlay.habilitada && (
                    <ProgressoPlataforma
                      nome="Google Play"
                      loja="google"
                      status={publicacao.googlePlay.status}
                      progresso={publicacao.googlePlay.progresso}
                    />
                  )}
                  {publicacao.appStore.habilitada && (
                    <ProgressoPlataforma
                      nome="App Store"
                      loja="apple"
                      status={publicacao.appStore.status}
                      progresso={publicacao.appStore.progresso}
                    />
                  )}
                </div>

                {publicacao.status === "failed" && (
                  <div className="queue-error">
                    <div>
                      <strong>Não foi possível concluir este aplicativo</strong>
                      <span>A fila foi pausada.</span>
                    </div>
                    <div>
                      <Button
                        type="button"
                        className="button"
                        onClick={() =>
                          tentarAplicativoNovamente(publicacao.id)
                        }
                      >
                        <RotateCcw size={15} />
                        Tentar novamente
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        className="button"
                        onClick={() => definirDetalhesErro(publicacao)}
                      >
                        Ver erro
                      </Button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {detalhesErro && (
        <Modal
          aoFechar={() => definirDetalhesErro(null)}
          idTitulo="queue-error-title"
        >
          <>
            <span className="modal-icon modal-icon-error">
              <AlertTriangle size={22} />
            </span>
            <h2 id="queue-error-title">
              Erro em {detalhesErro.nomeAplicativo}
            </h2>
            <p>
              {detalhesErro.mensagemErro ??
                "Não foi possível concluir a publicação."}
            </p>
            <div className="modal-actions">
              <Button
                type="button"
                className="button"
                onClick={() => definirDetalhesErro(null)}
              >
                Fechar
              </Button>
            </div>
          </>
        </Modal>
      )}
    </>
  );
}
