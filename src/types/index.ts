export type StatusAplicativo = "ready" | "inactive" | "problem";
export type RepositoryProvider = "GITHUB" | "GITLAB";
export type StatusHistorico = "success" | "failed";

export type StatusPlataformaPublicacao =
  | "waiting_queue"
  | "waiting_google"
  | "building"
  | "publishing"
  | "review"
  | "published"
  | "failed"
  | "disabled";

export type StatusPublicacao =
  | "waiting"
  | "publishing"
  | "partial"
  | "success"
  | "failed";

export type StatusFilaPublicacao =
  | "idle"
  | "running"
  | "paused"
  | "completed";

export interface ItemAplicativo {
  id: string;
  nome: string;
  urlRepositorio: string;
  branch: string;
  idAplicativoCodemagic: string;
  idFluxoCodemagic: string;
  nomePacoteAndroid: string;
  identificadorBundleIos: string;
  ativo: boolean;
  status: StatusAplicativo;
  versaoLoja: string;
  versaoCommitada: string;
}

export interface Aplicativo {
  id: number;
  name: string;
  repositoryProvider: RepositoryProvider;
  repositoryUrl: string;
  branch: string;
  active: boolean;
  configurationValid: boolean;
  createdAt: string;
  updatedAt: string;
}

export type DadosCriacaoAplicativo = Pick<
  Aplicativo,
  "name" | "repositoryProvider" | "repositoryUrl" | "branch"
> &
  Partial<Pick<Aplicativo, "active" | "configurationValid">>;

export type DadosAtualizacaoAplicativo = Pick<
  Aplicativo,
  | "name"
  | "repositoryProvider"
  | "repositoryUrl"
  | "branch"
  | "active"
  | "configurationValid"
>;

export interface PublicacaoHistorica {
  id: string;
  nomeAplicativo: string;
  nomeEmpresa: string;
  branch: string;
  versao: string;
  status: StatusHistorico;
  statusGooglePlay: StatusPlataformaPublicacao;
  statusAppStore: StatusPlataformaPublicacao;
  iniciadaEm: string;
  finalizadaEm?: string;
  mensagemErro?: string;
}

export interface LoteHistoricoPublicacao {
  data: string;
  publicacoes: PublicacaoHistorica[];
}

export interface PlataformaPublicacao {
  habilitada: boolean;
  status: StatusPlataformaPublicacao;
  progresso: number;
}

export interface ItemPublicacao {
  id: string;
  dataPublicacao: string;
  nomeAplicativo: string;
  branch: string;
  versao: string;
  notasVersao?: string;
  prioridade?: boolean;
  status: StatusPublicacao;
  googlePlay: PlataformaPublicacao;
  appStore: PlataformaPublicacao;
  mensagemErro?: string;
  simularFalhaAppStore?: boolean;
}

export interface ResumoAplicativoPublicacao {
  idAplicativo: string;
  nomeAplicativo: string;
  branch: string;
  versao: string;
  googlePlayHabilitado: boolean;
  appStoreHabilitado: boolean;
  prioridade: boolean;
}
