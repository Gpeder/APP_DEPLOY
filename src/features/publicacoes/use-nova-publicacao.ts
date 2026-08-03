import { useMemo, useRef, useState } from "react";
import { useAplicativos } from "@/hooks/use-aplicativos";
import { useFilaPublicacao } from "@/hooks/use-fila-publicacao";
import { obterVersaoSugerida } from "@/lib/versao";
import type { ResumoAplicativoPublicacao } from "@/types";

const notasVersaoPadrao =
  "Correções de bugs e otimizações que resultam em melhorias significativas no desempenho.";

const hoje = new Date();

const dataMinimaPublicacao = [
  hoje.getFullYear(),
  String(hoje.getMonth() + 1).padStart(2, "0"),
  String(hoje.getDate()).padStart(2, "0"),
].join("-");

export function useNovaPublicacao() {
  const { aplicativos } = useAplicativos();
  const { adicionarPublicacoes } = useFilaPublicacao();
  const referenciaCampoData = useRef<HTMLInputElement>(null);
  const aplicativosElegiveis = useMemo(
    () =>
      aplicativos.filter(
        (aplicativo) => aplicativo.ativo && aplicativo.status === "ready",
      ),
    [aplicativos],
  );
  const [dataPublicacao, definirDataPublicacao] = useState("");
  const [selecionados, definirSelecionados] = useState<string[]>([]);
  const [priorizados, definirPriorizados] = useState<string[]>([]);
  const [notasVersao, definirNotasVersao] = useState(notasVersaoPadrao);
  const [busca, definirBusca] = useState("");
  const [confirmacaoAberta, definirConfirmacaoAberta] = useState(false);
  const [criada, definirCriada] = useState(false);
  const [itensCriados, definirItensCriados] = useState<
    ResumoAplicativoPublicacao[]
  >([]);

  const aplicativosVisiveis = useMemo(
    () =>
      aplicativosElegiveis.filter((aplicativo) =>
        `${aplicativo.nome} ${aplicativo.urlRepositorio}`
          .toLocaleLowerCase("pt-BR")
          .includes(busca.trim().toLocaleLowerCase("pt-BR")),
      ),
    [aplicativosElegiveis, busca],
  );

  const podeCriar =
    Boolean(dataPublicacao) &&
    selecionados.length > 0 &&
    Boolean(notasVersao.trim());
  const todosAplicativosSelecionados =
    aplicativosElegiveis.length > 0 &&
    selecionados.length === aplicativosElegiveis.length;

  const abrirSeletorData = () => {
    const campo = referenciaCampoData.current;
    if (!campo) return;
    campo.focus();
    campo.showPicker?.();
  };

  const alternarAplicativo = (id: string) => {
    if (selecionados.includes(id)) {
      definirSelecionados((atuais) => atuais.filter((item) => item !== id));
      definirPriorizados((atuais) => atuais.filter((item) => item !== id));
      return;
    }

    definirSelecionados((atuais) => [...atuais, id]);
  };

  const alternarPrioridade = (id: string) => {
    definirPriorizados((atuais) =>
      atuais.includes(id)
        ? atuais.filter((item) => item !== id)
        : [...atuais, id],
    );
  };

  const alternarTodosAplicativos = () => {
    if (todosAplicativosSelecionados) {
      definirSelecionados([]);
      definirPriorizados([]);
      return;
    }

    definirSelecionados(
      aplicativosElegiveis.map((aplicativo) => aplicativo.id),
    );
  };

  const redefinirFormulario = () => {
    definirDataPublicacao("");
    definirSelecionados([]);
    definirPriorizados([]);
    definirNotasVersao(notasVersaoPadrao);
    definirBusca("");
    definirConfirmacaoAberta(false);
  };

  const criarPublicacao = () => {
    const resumos = selecionados.flatMap((id) => {
      const aplicativo = aplicativos.find((item) => item.id === id);
      if (!aplicativo) return [];

      return [
        {
          idAplicativo: aplicativo.id,
          nomeAplicativo: aplicativo.nome,
          branch: aplicativo.branch,
          versao: obterVersaoSugerida(
            aplicativo.versaoLoja,
            aplicativo.versaoCommitada,
          ),
          googlePlayHabilitado: true,
          appStoreHabilitado: true,
          prioridade: priorizados.includes(id),
        },
      ];
    });

    adicionarPublicacoes(dataPublicacao, resumos, notasVersao.trim());
    definirItensCriados(resumos);
    definirConfirmacaoAberta(false);
    definirCriada(true);
  };

  return {
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
  };
}
