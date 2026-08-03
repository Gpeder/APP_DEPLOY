import { Button } from "@/components/ui/button";
import { CabecalhoPagina } from "@/components/ui/cabecalho-pagina";
import { IdentificacaoAplicativo } from "@/components/ui/identificacao-aplicativo";
import { Modal } from "@/components/ui/modal";
import { EmblemaStatus } from "@/components/ui/emblema-status";
import { LogoLoja } from "@/components/ui/logo-loja";
import { rotulosStatusPlataformaHistorico } from "@/config/rotulos-status";
import { formatarDataPublicacao } from "@/lib/formatar-data";
import { historicoPublicacoes } from "@/mocks/historico-publicacoes";
import type {
  PublicacaoHistorica,
  StatusPlataformaPublicacao,
} from "@/types";
import { CalendarDays } from "lucide-react";
import { useMemo, useState } from "react";

function StatusPlataformaHistorico({
  plataforma,
  status,
}: {
  plataforma: "google" | "apple";
  status: StatusPlataformaPublicacao;
}) {
  return (
    <span className={`history-platform-status history-platform-${status}`}>
      <LogoLoja loja={plataforma} tamanho={14} />
      {rotulosStatusPlataformaHistorico[status]}
    </span>
  );
}

export function Historico() {
  const lotesOrdenados = useMemo(
    () =>
      [...historicoPublicacoes].sort((primeiro, segundo) =>
        segundo.data.localeCompare(primeiro.data),
      ),
    [],
  );
  const [dataSelecionada, definirDataSelecionada] = useState(
    lotesOrdenados[0].data,
  );
  const [detalhes, definirDetalhes] = useState<PublicacaoHistorica | null>(
    null,
  );

  const loteSelecionado =
    lotesOrdenados.find((lote) => lote.data === dataSelecionada) ??
    lotesOrdenados[0];
  const concluidos = loteSelecionado.publicacoes.filter(
    (publicacao) => publicacao.status === "success",
  ).length;
  const comErro = loteSelecionado.publicacoes.filter(
    (publicacao) => publicacao.status === "failed",
  ).length;

  return (
    <>
      <CabecalhoPagina
        titulo="Histórico"
        descricao="Consulte os aplicativos publicados em cada data."
      />

      <section className="panel history-date-panel">
        <label className="history-date-select">
          <span>Data da publicação</span>
          <div>
            <CalendarDays size={16} />
            <select
              value={dataSelecionada}
              onChange={(event) => {
                definirDataSelecionada(event.target.value);
                definirDetalhes(null);
              }}
            >
              {lotesOrdenados.map((lote) => (
                <option value={lote.data} key={lote.data}>
                  {formatarDataPublicacao(lote.data)}
                </option>
              ))}
            </select>
          </div>
        </label>
      </section>

      <div className="history-summary">
        <div>
          <small>Data</small>
          <strong>{formatarDataPublicacao(dataSelecionada)}</strong>
        </div>
        <div>
          <small>Aplicativos</small>
          <strong>{loteSelecionado.publicacoes.length}</strong>
        </div>
        <div>
          <small>Concluídos</small>
          <strong>{concluidos}</strong>
        </div>
        <div>
          <small>Com erro</small>
          <strong>{comErro}</strong>
        </div>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Publicação de {formatarDataPublicacao(dataSelecionada)}</h2>
            <p>Aplicativos incluídos nesta data.</p>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Aplicativo</th>
                <th>Google Play</th>
                <th>App Store</th>
                <th>Resultado</th>
                <th>
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {loteSelecionado.publicacoes.map((publicacao) => (
                <tr key={publicacao.id}>
                  <td>
                    <IdentificacaoAplicativo
                      nome={publicacao.nomeAplicativo}
                      detalhes={
                        <>
                          {publicacao.nomeEmpresa} · {publicacao.branch} · v
                          {publicacao.versao}
                        </>
                      }
                    />
                  </td>
                  <td>
                    <StatusPlataformaHistorico
                      plataforma="google"
                      status={publicacao.statusGooglePlay}
                    />
                  </td>
                  <td>
                    <StatusPlataformaHistorico
                      plataforma="apple"
                      status={publicacao.statusAppStore}
                    />
                  </td>
                  <td>
                    <EmblemaStatus status={publicacao.status} />
                  </td>
                  <td>
                    <Button
                      type="button"
                      variant="ghost"
                      className="button"
                      onClick={() => definirDetalhes(publicacao)}
                    >
                      Ver detalhes
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {detalhes && (
        <Modal
          aoFechar={() => definirDetalhes(null)}
          idTitulo="history-details-title"
          className="history-details"
        >
          <>
            <div className="history-details-heading">
              <IdentificacaoAplicativo
                nome={detalhes.nomeAplicativo}
                detalhes={detalhes.nomeEmpresa}
                idNome="history-details-title"
              />
            </div>

            <dl>
              <div>
                <dt>Data</dt>
                <dd>{formatarDataPublicacao(dataSelecionada)}</dd>
              </div>
              <div>
                <dt>Versão</dt>
                <dd>v{detalhes.versao}</dd>
              </div>
              <div>
                <dt>Branch utilizada</dt>
                <dd>{detalhes.branch}</dd>
              </div>
              <div>
                <dt>Google Play</dt>
                <dd>
                  {
                    rotulosStatusPlataformaHistorico[
                      detalhes.statusGooglePlay
                    ]
                  }
                </dd>
              </div>
              <div>
                <dt>App Store</dt>
                <dd>
                  {rotulosStatusPlataformaHistorico[detalhes.statusAppStore]}
                </dd>
              </div>
              <div>
                <dt>Início</dt>
                <dd>{detalhes.iniciadaEm}</dd>
              </div>
              <div>
                <dt>Conclusão</dt>
                <dd>{detalhes.finalizadaEm ?? "Não concluída"}</dd>
              </div>
            </dl>

            {detalhes.mensagemErro && (
              <div className="history-error-message">
                <strong>Erro</strong>
                <span>{detalhes.mensagemErro}</span>
              </div>
            )}

            <div className="modal-actions">
              <Button
                type="button"
                className="button"
                onClick={() => definirDetalhes(null)}
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
