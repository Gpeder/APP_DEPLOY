import type {
  StatusPlataformaPublicacao,
  StatusPublicacao,
} from "@/types";

export const rotulosStatusPublicacao: Record<StatusPublicacao, string> = {
  waiting: "Aguardando",
  publishing: "Publicando",
  partial: "Publicando",
  success: "Publicado",
  failed: "Com erro",
};

export const rotulosStatusPlataforma: Record<
  StatusPlataformaPublicacao,
  string
> = {
  waiting_queue: "Aguardando",
  waiting_google: "Aguardando Google Play",
  building: "Gerando build",
  publishing: "Enviando",
  review: "Em revisão",
  published: "Publicado",
  failed: "Erro",
  disabled: "Não selecionada",
};

export const rotulosStatusPlataformaHistorico = {
  ...rotulosStatusPlataforma,
  waiting_google: "Aguardando",
} satisfies Record<StatusPlataformaPublicacao, string>;
