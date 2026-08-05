import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CabecalhoPagina } from "@/components/ui/cabecalho-pagina";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePaginaAplicativos } from "@/features/aplicativos/use-pagina-aplicativos";
import type { Aplicativo, StatusAplicativo } from "@/types";
import {
  CheckCircle2,
  Ellipsis,
  Pencil,
  Plus,
  Power,
  PowerOff,
  TestTubeDiagonal,
} from "lucide-react";

const rotulosStatus: Record<StatusAplicativo, string> = {
  ready: "Pronto",
  inactive: "Inativo",
  problem: "Com problema",
};

function nomeRepositorio(url: string) {
  return url
    .replace("https://github.com/", "")
    .replace("https://gitlab.com/", "");
}

function obterStatus(aplicativo: Aplicativo): StatusAplicativo {
  if (!aplicativo.active) return "inactive";
  return aplicativo.configurationValid ? "ready" : "problem";
}

export function Aplicativos() {
  const paginaAplicativos = usePaginaAplicativos();

  return (
    <>
      <CabecalhoPagina
        titulo="Aplicativos"
        descricao="Cadastre e edite os aplicativos disponíveis para publicação."
        acao={
          <Button type="button" onClick={paginaAplicativos.abrirCriacao}>
            <Plus size={16} />
            Adicionar aplicativo
          </Button>
        }
      />

      <Card className="panel apps-panel">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aplicativo</TableHead>
              <TableHead>Repositório</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="apps-actions-heading">
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginaAplicativos.carregando && (
              <TableRow>
                <TableCell colSpan={5}>Carregando aplicativos...</TableCell>
              </TableRow>
            )}

            {!paginaAplicativos.carregando &&
              paginaAplicativos.falhaCarregamento && (
                <TableRow>
                  <TableCell colSpan={5}>
                    Não foi possível carregar os aplicativos. Tente novamente
                    mais tarde.
                  </TableCell>
                </TableRow>
              )}

            {!paginaAplicativos.carregando &&
              !paginaAplicativos.falhaCarregamento &&
              paginaAplicativos.aplicativos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    Nenhum aplicativo cadastrado.
                  </TableCell>
                </TableRow>
              )}

            {paginaAplicativos.aplicativos.map((aplicativo) => (
              <TableRow key={aplicativo.id}>
                <TableCell>
                  <strong>{aplicativo.name}</strong>
                </TableCell>
                <TableCell>
                  <a
                    className="repository-link"
                    href={aplicativo.repositoryUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {nomeRepositorio(aplicativo.repositoryUrl)}
                  </a>
                </TableCell>
                <TableCell>
                  <code>{aplicativo.branch}</code>
                </TableCell>
                <TableCell>
                  <span
                    className={`app-status app-status-${obterStatus(aplicativo)}`}
                  >
                    {rotulosStatus[obterStatus(aplicativo)]}
                  </span>
                </TableCell>
                <TableCell className="apps-actions-cell">
                  <AcoesAplicativo
                    aplicativo={aplicativo}
                    testado={
                      paginaAplicativos.idTestado === aplicativo.id ||
                      aplicativo.configurationValid
                    }
                    alterandoStatus={paginaAplicativos.idsAlterandoStatus.has(
                      aplicativo.id,
                    )}
                    aoEditar={paginaAplicativos.abrirEdicao}
                    aoAlternar={paginaAplicativos.alternarAplicativo}
                    aoTestar={paginaAplicativos.testarConfiguracao}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {paginaAplicativos.dialogoAberto && (
        <Modal
          aoFechar={paginaAplicativos.fecharDialogo}
          idTitulo="app-form-title"
          className="app-form-modal app-form-modal-simple"
        >
          <>
            <h2 id="app-form-title">
              {paginaAplicativos.idEmEdicao
                ? "Editar aplicativo"
                : "Adicionar aplicativo"}
            </h2>
            <p>
              Os dados técnicos serão preenchidos automaticamente pelo
              repositório selecionado.
            </p>

            <div className="app-form-grid">
              <label className="wide">
                <span>Nome</span>
                <Input
                  value={paginaAplicativos.formulario.nome}
                  onChange={(event) =>
                    paginaAplicativos.alterarNome(event.target.value)
                  }
                  placeholder="Nome do aplicativo"
                  autoFocus
                />
              </label>

              <label className="wide">
                <span>Repositório GitHub ou GitLab</span>
                <select
                  value={paginaAplicativos.formulario.urlRepositorio}
                  onChange={(event) =>
                    paginaAplicativos.selecionarRepositorio(event.target.value)
                  }
                >
                  <option value="">Selecione um repositório</option>
                  {paginaAplicativos.repositoriosFormulario.map(
                    (repositorio) => (
                    <option value={repositorio.url} key={repositorio.url}>
                      {repositorio.provedor} · {repositorio.nome}
                    </option>
                    ),
                  )}
                </select>
              </label>

              <label className="wide">
                <span>Branch</span>
                <select
                  value={paginaAplicativos.formulario.branch}
                  disabled={!paginaAplicativos.repositorioSelecionado}
                  onChange={(event) =>
                    paginaAplicativos.alterarBranch(event.target.value)
                  }
                >
                  <option value="">Selecione uma branch</option>
                  {paginaAplicativos.repositorioSelecionado?.branches.map(
                    (branch) => (
                      <option value={branch} key={branch}>
                        {branch}
                      </option>
                    ),
                  )}
                </select>
              </label>
            </div>

            <div className="repository-sync-note">
              A lista é simulada nesta versão. Na integração real, ela virá da
              conta conectada do GitHub ou GitLab.
            </div>

            <div className="modal-actions">
              <Button
                type="button"
                variant="secondary"
                disabled={paginaAplicativos.salvando}
                onClick={paginaAplicativos.fecharDialogo}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                disabled={!paginaAplicativos.podeSalvar}
                onClick={paginaAplicativos.salvarAplicativo}
              >
                {paginaAplicativos.salvando
                  ? "Salvando..."
                  : "Salvar aplicativo"}
              </Button>
            </div>
          </>
        </Modal>
      )}
    </>
  );
}

function AcoesAplicativo({
  aplicativo,
  testado,
  alterandoStatus,
  aoEditar,
  aoAlternar,
  aoTestar,
}: {
  aplicativo: Aplicativo;
  testado: boolean;
  alterandoStatus: boolean;
  aoEditar: (aplicativo: Aplicativo) => void;
  aoAlternar: (aplicativo: Aplicativo) => void;
  aoTestar: (aplicativo: Aplicativo) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="app-actions-trigger"
        aria-label={`Abrir ações de ${aplicativo.name}`}
      >
        <Ellipsis size={18} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="app-actions-menu">
        <DropdownMenuItem onSelect={() => aoEditar(aplicativo)}>
          <Pencil />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={alterandoStatus}
          onSelect={() => aoAlternar(aplicativo)}
        >
          {aplicativo.active ? <PowerOff /> : <Power />}
          {alterandoStatus
            ? "Atualizando..."
            : aplicativo.active
              ? "Desativar"
              : "Ativar"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => aoTestar(aplicativo)}>
          {testado ? <CheckCircle2 /> : <TestTubeDiagonal />}
          {testado ? "Configuração válida" : "Testar configuração"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
