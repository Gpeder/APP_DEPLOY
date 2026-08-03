import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  ContextoAplicativos,
  type ValorContextoAplicativos,
} from "@/hooks/contexto-aplicativos";
import { aplicativosIniciais } from "@/mocks/aplicativos";
import type { ItemAplicativo } from "@/types";

export function ProvedorAplicativos({ children }: { children: ReactNode }) {
  const [aplicativos, definirAplicativos] =
    useState<ItemAplicativo[]>(aplicativosIniciais);

  const valor = useMemo<ValorContextoAplicativos>(
    () => ({
      aplicativos,
      adicionarAplicativo: (aplicativo) =>
        definirAplicativos((atuais) => [
          ...atuais,
          {
            ...aplicativo,
            id: crypto.randomUUID(),
            versaoLoja: "0.0.0",
            versaoCommitada: "0.0.0",
          },
        ]),
      atualizarAplicativo: (id, aplicativo) =>
        definirAplicativos((atuais) =>
          atuais.map((item) =>
            item.id === id ? { ...item, ...aplicativo } : item,
          ),
        ),
      definirAplicativoAtivo: (id, ativo) =>
        definirAplicativos((atuais) =>
          atuais.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ativo,
                  status: ativo ? "ready" : "inactive",
                }
              : item,
          ),
        ),
    }),
    [aplicativos],
  );

  return (
    <ContextoAplicativos.Provider value={valor}>
      {children}
    </ContextoAplicativos.Provider>
  );
}
