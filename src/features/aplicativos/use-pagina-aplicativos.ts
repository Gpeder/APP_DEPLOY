import { repositoriosDisponiveis } from "@/mocks/repositorios";
import { useAplicativos } from "@/hooks/use-aplicativos";
import type { ItemAplicativo } from "@/types";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  formularioAplicativoVazio,
  type FormularioAplicativo,
} from "./tipos";

export function usePaginaAplicativos() {
  const {
    aplicativos,
    adicionarAplicativo,
    atualizarAplicativo,
    definirAplicativoAtivo,
  } = useAplicativos();
  const [formulario, definirFormulario] = useState<FormularioAplicativo>(
    formularioAplicativoVazio,
  );
  const [idEmEdicao, definirIdEmEdicao] = useState<string | null>(null);
  const [dialogoAberto, definirDialogoAberto] = useState(false);
  const [idTestado, definirIdTestado] = useState<string | null>(null);

  const repositorioSelecionado = useMemo(
    () =>
      repositoriosDisponiveis.find(
        (repositorio) => repositorio.url === formulario.urlRepositorio,
      ),
    [formulario.urlRepositorio],
  );

  const podeSalvar =
    Boolean(formulario.nome.trim()) &&
    Boolean(repositorioSelecionado) &&
    Boolean(formulario.branch);

  const abrirCriacao = () => {
    definirIdEmEdicao(null);
    definirFormulario(formularioAplicativoVazio);
    definirDialogoAberto(true);
  };

  const abrirEdicao = (aplicativo: ItemAplicativo) => {
    definirIdEmEdicao(aplicativo.id);
    definirFormulario({
      nome: aplicativo.nome,
      urlRepositorio: aplicativo.urlRepositorio,
      branch: aplicativo.branch,
    });
    definirDialogoAberto(true);
  };

  const fecharDialogo = () => definirDialogoAberto(false);

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

    definirFormulario((atual) => ({
      ...atual,
      urlRepositorio,
      branch: repositorio?.branches[0] ?? "",
    }));
  };

  const salvarAplicativo = () => {
    if (!repositorioSelecionado) return;

    const aplicativoAtual = aplicativos.find(
      (aplicativo) => aplicativo.id === idEmEdicao,
    );
    const dadosAplicativo = {
      nome: formulario.nome.trim(),
      urlRepositorio: repositorioSelecionado.url,
      branch: formulario.branch,
      idAplicativoCodemagic: repositorioSelecionado.idAplicativoCodemagic,
      idFluxoCodemagic: repositorioSelecionado.idFluxoCodemagic,
      nomePacoteAndroid: repositorioSelecionado.nomePacoteAndroid,
      identificadorBundleIos: repositorioSelecionado.identificadorBundleIos,
      ativo: aplicativoAtual?.ativo ?? true,
      status: aplicativoAtual?.status ?? ("ready" as const),
    };

    if (idEmEdicao) {
      atualizarAplicativo(idEmEdicao, dadosAplicativo);
      toast.success("Aplicativo atualizado", {
        description: `${dadosAplicativo.nome} foi atualizado com sucesso.`,
      });
    } else {
      adicionarAplicativo(dadosAplicativo);
      toast.success("Aplicativo adicionado", {
        description: `${dadosAplicativo.nome} já está disponível para publicações.`,
      });
    }

    fecharDialogo();
  };

  const alternarAplicativo = (aplicativo: ItemAplicativo) => {
    const ativo = !aplicativo.ativo;
    definirAplicativoAtivo(aplicativo.id, ativo);
    toast.success(ativo ? "Aplicativo ativado" : "Aplicativo desativado", {
      description: ativo
        ? `${aplicativo.nome} voltou a ficar disponível para publicações.`
        : `${aplicativo.nome} não aparecerá em novas publicações.`,
    });
  };

  const testarConfiguracao = (aplicativo: ItemAplicativo) => {
    definirIdTestado(aplicativo.id);
    toast.success("Configuração válida", {
      description: `${aplicativo.nome} está conectado e pronto para publicar.`,
    });
  };

  return {
    aplicativos,
    formulario,
    idEmEdicao,
    dialogoAberto,
    idTestado,
    repositorioSelecionado,
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
