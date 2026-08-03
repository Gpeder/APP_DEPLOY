function interpretarVersao(versao: string) {
  const partes = versao.split(".").map((parte) => Number.parseInt(parte, 10));

  return partes.length === 3 && partes.every(Number.isFinite)
    ? partes
    : [0, 0, 0];
}

function compararVersoes(esquerda: string, direita: string) {
  const partesEsquerda = interpretarVersao(esquerda);
  const partesDireita = interpretarVersao(direita);

  for (let indice = 0; indice < 3; indice += 1) {
    if (partesEsquerda[indice] !== partesDireita[indice]) {
      return partesEsquerda[indice] - partesDireita[indice];
    }
  }

  return 0;
}

function incrementarCorrecao(versao: string) {
  const [maior, menor, correcao] = interpretarVersao(versao);
  return `${maior}.${menor}.${correcao + 1}`;
}

export function obterVersaoSugerida(
  versaoLoja: string,
  versaoCommitada: string,
) {
  const proximaVersaoLoja = incrementarCorrecao(versaoLoja);

  return compararVersoes(versaoCommitada, proximaVersaoLoja) >= 0
    ? versaoCommitada
    : proximaVersaoLoja;
}
