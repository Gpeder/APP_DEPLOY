const urlBaseApi = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "");

type RespostaErroApi = {
  message?: unknown;
  details?: unknown;
};

function extrairMensagemErro(conteudo: string, status: number) {
  if (!conteudo) return `A API respondeu com o status ${status}.`;

  try {
    const resposta: unknown = JSON.parse(conteudo);

    if (typeof resposta === "object" && resposta !== null) {
      const { message, details } = resposta as RespostaErroApi;

      if (typeof details === "string") return details;
      if (typeof message === "string") return message;
    }
  } catch {
    return conteudo;
  }

  return `A API respondeu com o status ${status}.`;
}

export async function requisicaoApi<T>(
  caminho: string,
  opcoes: RequestInit = {},
): Promise<T> {
  if (!urlBaseApi) {
    throw new Error("A variável VITE_API_URL não foi configurada.");
  }

  const headers = new Headers(opcoes.headers);

  if (opcoes.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const resposta = await fetch(`${urlBaseApi}${caminho}`, {
    ...opcoes,
    headers,
  });
  const conteudo = await resposta.text();

  if (!resposta.ok) {
    throw new Error(extrairMensagemErro(conteudo, resposta.status));
  }

  if (!conteudo) return undefined as T;

  return JSON.parse(conteudo) as T;
}
