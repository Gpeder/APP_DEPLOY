import { requisicaoApi } from "@/services/api";
import type {
  Aplicativo,
  DadosAtualizacaoAplicativo,
  DadosCriacaoAplicativo,
} from "@/types";

export function listarAplicativos(signal?: AbortSignal) {
  return requisicaoApi<Aplicativo[]>("/aplicativos", { signal });
}

export function criarAplicativo(dados: DadosCriacaoAplicativo) {
  return requisicaoApi<Aplicativo>("/aplicativos", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export function atualizarAplicativo(
  id: number,
  dados: DadosAtualizacaoAplicativo,
) {
  return requisicaoApi<Aplicativo>(`/aplicativos/${id}`, {
    method: "PUT",
    body: JSON.stringify(dados),
  });
}

export function atualizarStatusAplicativo(id: number, active: boolean) {
  return requisicaoApi<Aplicativo>(`/aplicativos/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ active }),
  });
}
