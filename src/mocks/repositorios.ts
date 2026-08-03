export type RepositorioDisponivel = {
  nome: string;
  provedor: "GitHub" | "GitLab";
  url: string;
  branches: string[];
  idAplicativoCodemagic: string;
  idFluxoCodemagic: string;
  nomePacoteAndroid: string;
  identificadorBundleIos: string;
};

export const repositoriosDisponiveis: RepositorioDisponivel[] = [
  {
    nome: "empresa-alpha/app",
    provedor: "GitHub",
    url: "https://github.com/empresa-alpha/app",
    branches: ["main", "release"],
    idAplicativoCodemagic: "alpha-app",
    idFluxoCodemagic: "publish-alpha",
    nomePacoteAndroid: "com.empresa.alpha",
    identificadorBundleIos: "com.empresa.alpha",
  },
  {
    nome: "empresa-beta/app",
    provedor: "GitHub",
    url: "https://github.com/empresa-beta/app",
    branches: ["main", "release"],
    idAplicativoCodemagic: "beta-app",
    idFluxoCodemagic: "publish-beta",
    nomePacoteAndroid: "com.empresa.beta",
    identificadorBundleIos: "com.empresa.beta",
  },
  {
    nome: "empresa-gamma/app",
    provedor: "GitLab",
    url: "https://gitlab.com/empresa-gamma/app",
    branches: ["main", "production"],
    idAplicativoCodemagic: "gamma-app",
    idFluxoCodemagic: "publish-gamma",
    nomePacoteAndroid: "com.empresa.gamma",
    identificadorBundleIos: "com.empresa.gamma",
  },
  {
    nome: "grupo-delta/portal",
    provedor: "GitHub",
    url: "https://github.com/grupo-delta/portal",
    branches: ["main", "release/delta"],
    idAplicativoCodemagic: "delta-app",
    idFluxoCodemagic: "publish-delta",
    nomePacoteAndroid: "com.grupodelta.portal",
    identificadorBundleIos: "com.grupodelta.portal",
  },
  {
    nome: "omega/vendas",
    provedor: "GitHub",
    url: "https://github.com/omega/vendas",
    branches: ["main"],
    idAplicativoCodemagic: "omega-vendas",
    idFluxoCodemagic: "publish-omega",
    nomePacoteAndroid: "com.omega.vendas",
    identificadorBundleIos: "com.omega.vendas",
  },
];
