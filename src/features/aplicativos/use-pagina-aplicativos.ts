import { repositoriosDisponiveis } from "@/mocks/repositorios";
import {
  atualizarAplicativo,
  atualizarStatusAplicativo,
  criarAplicativo,
  listarAplicativos,
} from "@/services/aplicativos.service";
import type { Aplicativo, RepositoryProvider } from "@/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  formularioAplicativoVazio,
  type FormularioAplicativo,
} from "./tipos";

function mensagemErro(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Ocorreu um erro inesperado. Tente novamente.";
}

function obterProvedor(url: string): RepositoryProvider {
  return url.includes("gitlab.com") ? "GITLAB" : "GITHUB";
}

export function usePaginaAplicativos() {
  const [aplicativos, definirAplicativos] = useState<Aplicativo[]>([]);
  const [carregando, definirCarregando] = useState(true);
  const [falhaCarregamento, definirFalhaCarregamento] = useState(false);
  const [salvando, definirSalvando] = useState(false);
  const [idsAlterandoStatus, definirIdsAlterandoStatus] = useState<Set<number>>(
    new Set(),
  );
  const [formulario, definirFormulario] = useState<FormularioAplicativo>(
    formularioAplicativoVazio,
  );
  const [idEmEdicao, definirIdEmEdicao] = useState<number | null>(null);
  const [dialogoAberto, definirDialogoAberto] = useState(false);
  const [idTestado, definirIdTestado] = useState<number | null>(null);
  const salvamentoEmAndamento = useRef(false);
  const statusEmAndamento = useRef(new Set<number>());

  useEffect(() => {
    const controlador = new AbortController();

    async function carregar() {
      try {
        const resposta = await listarAplicativos(controlador.signal);
        definirAplicativos(resposta);
        definirFalhaCarregamento(false);
      } catch (error) {
        if (controlador.signal.aborted) return;

        definirFalhaCarregamento(true);
        toast.error("Não foi possível carregar os aplicativos", {
          description: mensagemErro(error),
        });
      } finally {
        if (!controlador.signal.aborted) definirCarregando(false);
      }
    }

    void carregar();

    return () => controlador.abort();
  }, []);

  const aplicativoEmEdicao = useMemo(
    () =>
      aplicativos.find((aplicativo) => aplicativo.id === idEmEdicao),
    [aplicativos, idEmEdicao],
  );

  const repositorioSelecionado = useMemo(() => {
    const repositorioConhecido = repositoriosDisponiveis.find(
      (repositorio) => repositorio.url === formulario.urlRepositorio,
    );

    if (repositorioConhecido) return repositorioConhecido;
    if (!formulario.urlRepositorio) return undefined;

    return {
      nome: formulario.urlRepositorio
        .replace("https://github.com/", "")
        .replace("https://gitlab.com/", ""),
      provedor: obterProvedor(formulario.urlRepositorio) === "GITLAB"
        ? ("GitLab" as const)
        : ("GitHub" as const),
      url: formulario.urlRepositorio,
      branches: formulario.branch
        ? [formulario.branch]
        : aplicativoEmEdicao?.repositoryUrl === formulario.urlRepositorio
          ? [aplicativoEmEdicao.branch]
          : [],
    };
  }, [
    aplicativoEmEdicao,
    formulario.branch,
    formulario.urlRepositorio,
  ]);

  const repositoriosFormulario = useMemo(() => {
    if (
      !repositorioSelecionado ||
      repositoriosDisponiveis.some(
        (repositorio) => repositorio.url === repositorioSelecionado.url,
      )
    ) {
      return repositoriosDisponiveis;
    }

    return [repositorioSelecionado, ...repositoriosDisponiveis];
  }, [repositorioSelecionado]);

  const podeSalvar =
    Boolean(formulario.nome.trim()) &&
    Boolean(repositorioSelecionado) &&
    Boolean(formulario.branch.trim()) &&
    !salvando;

  const abrirCriacao = () => {
    definirIdEmEdicao(null);
    definirFormulario(formularioAplicativoVazio);
    definirDialogoAberto(true);
  };

  const abrirEdicao = (aplicativo: Aplicativo) => {
    definirIdEmEdicao(aplicativo.id);
    definirFormulario({
      nome: aplicativo.name,
      urlRepositorio: aplicativo.repositoryUrl,
      branch: aplicativo.branch,
    });
    definirDialogoAberto(true);
  };

  const fecharDialogo = () => {
    if (!salvamentoEmAndamento.current) definirDialogoAberto(false);
  };

  const alterarNome = (nome: string) => {
    definirFormulario((atual) => ({ ...atual, nome }));
  };

  const alterarBranch = (branch: string) => {
    definirFormulario((atual) => ({ ...atual, branch }));
  };

  const selecionarRepositorio = (urlRepositorio: string) => {
    const repositorio = repositoriosDisponiveis.find(
      (item) => item.url === urlRepositorio,
    );
    const branchAtual =
      aplicativoEmEdicao?.repositoryUrl === urlRepositorio
        ? aplicativoEmEdicao.branch
        : "";

    definirFormulario((atual) => ({
      ...atual,
      urlRepositorio,
      branch: repositorio?.branches[0] ?? branchAtual,
    }));
  };

  const salvarAplicativo = async () => {
    if (
      salvamentoEmAndamento.current ||
      !repositorioSelecionado ||
      !formulario.nome.trim() ||
      !formulario.branch.trim()
    ) {
      return;
    }

    salvamentoEmAndamento.current = true;
    definirSalvando(true);

    try {
      const dadosPrincipais = {
        name: formulario.nome.trim(),
        repositoryProvider: obterProvedor(repositorioSelecionado.url),
        repositoryUrl: repositorioSelecionado.url,
        branch: formulario.branch.trim(),
      };

      if (idEmEdicao !== null) {
        const aplicativoAtual = aplicativos.find(
          (aplicativo) => aplicativo.id === idEmEdicao,
        );

        if (!aplicativoAtual) {
          throw new Error("O aplicativo selecionado não está mais disponível.");
        }

        const atualizado = await atualizarAplicativo(idEmEdicao, {
          ...dadosPrincipais,
          active: aplicativoAtual.active,
          configurationValid: aplicativoAtual.configurationValid,
        });

        definirAplicativos((atuais) =>
          atuais.map((aplicativo) =>
            aplicativo.id === atualizado.id ? atualizado : aplicativo,
          ),
        );
        toast.success("Aplicativo atualizado", {
          description: `${atualizado.name} foi atualizado com sucesso.`,
        });
      } else {
        const criado = await criarAplicativo(dadosPrincipais);
        definirAplicativos((atuais) => [criado, ...atuais]);
        toast.success("Aplicativo adicionado", {
          description: `${criado.name} já está disponível para publicações.`,
        });
      }

      definirDialogoAberto(false);
    } catch (error) {
      toast.error(
        idEmEdicao !== null
          ? "Não foi possível atualizar o aplicativo"
          : "Não foi possível adicionar o aplicativo",
        { description: mensagemErro(error) },
      );
    } finally {
      salvamentoEmAndamento.current = false;
      definirSalvando(false);
    }
  };

  const alternarAplicativo = async (aplicativo: Aplicativo) => {
    if (statusEmAndamento.current.has(aplicativo.id)) return;

    const active = !aplicativo.active;
    statusEmAndamento.current.add(aplicativo.id);
    definirIdsAlterandoStatus((atuais) => {
      const proximos = new Set(atuais);
      proximos.add(aplicativo.id);
      return proximos;
    });

    try {
      const atualizado = await atualizarStatusAplicativo(
        aplicativo.id,
        active,
      );

      definirAplicativos((atuais) =>
        atuais.map((item) =>
          item.id === atualizado.id ? atualizado : item,
        ),
      );
      toast.success(active ? "Aplicativo ativado" : "Aplicativo desativado", {
        description: active
          ? `${aplicativo.name} voltou a ficar disponível para publicações.`
          : `${aplicativo.name} não aparecerá em novas publicações.`,
      });
    } catch (error) {
      toast.error(
        active
          ? "Não foi possível ativar o aplicativo"
          : "Não foi possível desativar o aplicativo",
        { description: mensagemErro(error) },
      );
    } finally {
      statusEmAndamento.current.delete(aplicativo.id);
      definirIdsAlterandoStatus((atuais) => {
        const proximos = new Set(atuais);
        proximos.delete(aplicativo.id);
        return proximos;
      });
    }
  };

  const testarConfiguracao = (aplicativo: Aplicativo) => {
    definirIdTestado(aplicativo.id);
    toast.success("Configuração válida", {
      description: `${aplicativo.name} está conectado e pronto para publicar.`,
    });
  };

  return {
    aplicativos,
    carregando,
    falhaCarregamento,
    salvando,
    idsAlterandoStatus,
    formulario,
    idEmEdicao,
    dialogoAberto,
    idTestado,
    repositorioSelecionado,
    repositoriosFormulario,
    podeSalvar,
    abrirCriacao,
    abrirEdicao,
    fecharDialogo,
    alterarNome,
    alterarBranch,
    selecionarRepositorio,
    salvarAplicativo,
    alternarAplicativo,
    testarConfiguracao,
  };
}
