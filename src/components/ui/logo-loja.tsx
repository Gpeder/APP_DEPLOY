export function LogoLoja({
  loja,
  tamanho = 16,
}: {
  loja: "google" | "apple";
  tamanho?: number;
}) {
  return (
    <img
      className="store-logo"
      src={loja === "google" ? "/android.svg" : "/apple.svg"}
      width={tamanho}
      height={tamanho}
      alt=""
      aria-hidden="true"
    />
  );
}
