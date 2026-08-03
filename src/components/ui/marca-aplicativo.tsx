export function MarcaAplicativo({ nome }: { nome: string }) {
  const inicial = nome.trim().split(/\s+/).at(-1)?.charAt(0) ?? "?";

  return (
    <span className="app-mark" aria-hidden="true">
      {inicial.toLocaleUpperCase("pt-BR")}
    </span>
  );
}
