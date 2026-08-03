import { useContext } from "react";
import { ContextoPublicacoes } from "@/hooks/contexto-publicacoes";

export function useFilaPublicacao() {
  const contexto = useContext(ContextoPublicacoes);

  if (!contexto) {
    throw new Error(
      "useFilaPublicacao deve ser usado dentro de ProvedorPublicacoes",
    );
  }

  return contexto;
}
