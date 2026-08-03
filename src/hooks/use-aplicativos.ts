import { useContext } from "react";
import { ContextoAplicativos } from "@/hooks/contexto-aplicativos";

export function useAplicativos() {
  const contexto = useContext(ContextoAplicativos);

  if (!contexto) {
    throw new Error("useAplicativos deve ser usado dentro de ProvedorAplicativos");
  }

  return contexto;
}
