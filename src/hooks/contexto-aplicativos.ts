import { createContext } from "react";
import type { ItemAplicativo } from "@/types";

export type EntradaAplicativo = Omit<
  ItemAplicativo,
  "id" | "versaoLoja" | "versaoCommitada"
>;

export type ValorContextoAplicativos = {
  aplicativos: ItemAplicativo[];
  adicionarAplicativo: (aplicativo: EntradaAplicativo) => void;
  atualizarAplicativo: (
    id: string,
    aplicativo: EntradaAplicativo,
  ) => void;
  definirAplicativoAtivo: (id: string, ativo: boolean) => void;
};

export const ContextoAplicativos =
  createContext<ValorContextoAplicativos | null>(null);
