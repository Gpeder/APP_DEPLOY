import type { ReactNode } from "react";

export function CabecalhoPagina({
  titulo,
  descricao,
  acao,
}: {
  titulo: string;
  descricao: string;
  acao?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        <h1>{titulo}</h1>
        <p>{descricao}</p>
      </div>
      {acao}
    </header>
  );
}
