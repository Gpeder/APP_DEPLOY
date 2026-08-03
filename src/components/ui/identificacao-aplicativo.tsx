import { MarcaAplicativo } from "@/components/ui/marca-aplicativo";
import type { ReactNode } from "react";

export function IdentificacaoAplicativo({
  nome,
  detalhes,
  idNome,
}: {
  nome: string;
  detalhes: ReactNode;
  idNome?: string;
}) {
  return (
    <div className="app-cell">
      <MarcaAplicativo nome={nome} />
      <span>
        <strong id={idNome}>{nome}</strong>
        <small>{detalhes}</small>
      </span>
    </div>
  );
}
