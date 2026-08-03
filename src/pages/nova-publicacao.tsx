import { Button } from "@/components/ui/button";
import { CabecalhoPagina } from "@/components/ui/cabecalho-pagina";
import { IdentificacaoAplicativo } from "@/components/ui/identificacao-aplicativo";
import { Modal } from "@/components/ui/modal";
import { useNovaPublicacao } from "@/features/publicacoes/use-nova-publicacao";
import { formatarDataPublicacao } from "@/lib/formatar-data";
import { obterVersaoSugerida } from "@/lib/versao";
import { CalendarDays, Check, Crown, Rocket, Search } from "lucide-react";

export function NovaPublicacao() {
  const {
    referenciaCampoData,
    dataMinimaPublicacao,
    dataPublicacao,
    definirDataPublicacao,
    selecionados,
    priorizados,
    notasVersao,
    definirNotasVersao,
    busca,
    definirBusca,
    confirmacaoAberta,
    definirConfirmacaoAberta,
    criada,
    definirCriada,
    itensCriados,
    aplicativosVisiveis,
    podeCriar,
    todosAplicativosSelecionados,
    abrirSeletorData,
    alternarAplicativo,
    alternarPrioridade,
    alternarTodosAplicativos,
    redefinirFormulario,
    criarPublicacao,
  } = useNovaPublicacao();

  if (criada) {
    return (
      <div className="success-state">
        <span>
          <Check size={30} />
        </span>
        <h1>Publicação criada</h1>
        <p>
          {itensCriados.length} aplicativos foram adicionados à publicação de{" "}
          {formatarDataPublicacao(dataPublicacao)}.
        </p>
        <Button
          type="button"
          className="button"
          onClick={() => {
            definirCriada(false);
            redefinirFormulario();
          }}
        >
          Criar outra publicação
        </Button>
      </div>
    );
  }

  return (
    <>
      <CabecalhoPagina
        titulo="Nova publicação"
        descricao="Escolha a data e os aplicativos que serão publicados."
      />

      <div className="new-publication-layout">
        <section className="panel simple-publication-section">
          <div className="simple-section-heading">
            <span>1</span>
            <div>
              <h2>Data da publicação</h2>
              <p>Todos os aplicativos selecionados pertencerão a esta data.</p>
            </div>
          </div>
          <label className="publication-date-field">
            <span>Data</span>
            <div
              className="publication-date-control"
              onClick={abrirSeletorData}
            >
              <CalendarDays size={16} />
              <input
                ref={referenciaCampoData}
                type="date"
                min={dataMinimaPublicacao}
                value={dataPublicacao}
                onChange={(event) =>
                  definirDataPublicacao(event.target.value)
                }
                required
              />
            </div>
          </label>
        </section>

        <section className="panel simple-publication-section">
          <div className="simple-section-heading">
            <span>2</span>
            <div>
              <h2>Aplicativos</h2>
              <p>Selecione os aplicativos desta publicação.</p>
            </div>
            <strong>{selecionados.length} selecionados</strong>
          </div>

          <div className="simple-app-toolbar">
            <label className="search">
              <Search size={17} />
              <input
                value={busca}
                onChange={(event) => definirBusca(event.target.value)}
                placeholder="Buscar aplicativo"
              />
            </label>
          </div>

          <div className="table-wrap simple-app-table">
            <table>
              <thead>
                <tr>
                  <th className="check-col">
                    <input
                      type="checkbox"
                      checked={todosAplicativosSelecionados}
                      onChange={alternarTodosAplicativos}
                      aria-label="Selecionar todos os aplicativos"
                    />
                  </th>
                  <th>Aplicativo</th>
                  <th>Prioridade</th>
                </tr>
              </thead>
              <tbody>
                {aplicativosVisiveis.map((aplicativo) => {
                  const estaSelecionado = selecionados.includes(aplicativo.id);
                  const estaPriorizado = priorizados.includes(aplicativo.id);
                  const proximaVersao = obterVersaoSugerida(
                    aplicativo.versaoLoja,
                    aplicativo.versaoCommitada,
                  );

                  return (
                    <tr
                      key={aplicativo.id}
                      className={estaSelecionado ? "selected-row" : ""}
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={estaSelecionado}
                          onChange={() => alternarAplicativo(aplicativo.id)}
                          aria-label={`Selecionar ${aplicativo.nome}`}
                        />
                      </td>
                      <td>
                        <IdentificacaoAplicativo
                          nome={aplicativo.nome}
                          detalhes={
                            <>
                              {aplicativo.branch} · próxima versão{" "}
                              {proximaVersao}
                            </>
                          }
                        />
                      </td>
                      <td>
                        <label
                          className={`priority-toggle ${
                            estaPriorizado ? "priority-toggle-active" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={estaPriorizado}
                            disabled={!estaSelecionado}
                            onChange={() =>
                              alternarPrioridade(aplicativo.id)
                            }
                            aria-label={`Marcar ${aplicativo.nome} como prioridade`}
                          />
                          <Crown size={14} />
                          Prioridade
                        </label>
                      </td>
                    </tr>
                  );
                })}
                {aplicativosVisiveis.length === 0 && (
                  <tr>
                    <td colSpan={3}>
                      Nenhum aplicativo disponível para esta busca.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel simple-publication-section">
          <div className="simple-section-heading">
            <span>3</span>
            <div>
              <h2>Notas da versão</h2>
              <p>Texto exibido nas lojas nesta atualização.</p>
            </div>
          </div>
          <label className="simple-release-notes">
            <span>Texto da atualização</span>
            <textarea
              rows={4}
              value={notasVersao}
              onChange={(event) => definirNotasVersao(event.target.value)}
            />
          </label>
        </section>

        <section className="panel publication-summary-card">
          <div>
            <small>Data</small>
            <strong>
              {dataPublicacao
                ? formatarDataPublicacao(dataPublicacao)
                : "Não selecionada"}
            </strong>
          </div>
          <div>
            <small>Aplicativos</small>
            <strong>{selecionados.length}</strong>
          </div>
          <div>
            <small>Prioridade</small>
            <strong>{priorizados.length}</strong>
          </div>
        </section>

        <div className="simple-publication-actions">
          <Button
            type="button"
            variant="secondary"
            className="button"
            onClick={redefinirFormulario}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="button"
            disabled={!podeCriar}
            onClick={() => definirConfirmacaoAberta(true)}
          >
            <Rocket size={16} />
            Criar publicação
          </Button>
        </div>
      </div>

      {confirmacaoAberta && (
        <Modal
          aoFechar={() => definirConfirmacaoAberta(false)}
          idTitulo="create-publication-title"
        >
          <>
            <span className="modal-icon">
              <Rocket size={22} />
            </span>
            <h2 id="create-publication-title">Criar esta publicação?</h2>
            <p>
              Os {selecionados.length} aplicativos serão adicionados à fila na
              data de {formatarDataPublicacao(dataPublicacao)}.
            </p>
            <div className="modal-actions">
              <Button
                type="button"
                variant="secondary"
                className="button"
                onClick={() => definirConfirmacaoAberta(false)}
              >
                Voltar
              </Button>
              <Button
                type="button"
                className="button"
                onClick={criarPublicacao}
              >
                Confirmar
              </Button>
            </div>
          </>
        </Modal>
      )}
    </>
  );
}
