import { createContext } from "react";
import type {
  ItemPublicacao,
  ResumoAplicativoPublicacao,
  StatusFilaPublicacao,
} from "@/types";

export type ContagensFila = {
  aguardando: number;
  ativas: number;
  concluidas: number;
  comErro: number;
};

export type ValorContextoPublicacoes = {
  publicacoes: ItemPublicacao[];
  statusFila: StatusFilaPublicacao;
  dataFila?: string;
  contagens: ContagensFila;
  adicionarPublicacoes: (
    dataPublicacao: string,
    aplicativos: ResumoAplicativoPublicacao[],
    notasVersao: string,
  ) => void;
  iniciarFila: () => void;
  pausarFila: () => void;
  tentarAplicativoNovamente: (id: string) => void;
};

export const ContextoPublicacoes =
  createContext<ValorContextoPublicacoes | null>(null);
