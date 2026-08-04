import type { FastifyInstance } from "fastify";

export function configurarTratamentoErros(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    const erroValidacao =
      typeof error === "object" &&
      error !== null &&
      "validation" in error &&
      Array.isArray(error.validation);

    if (erroValidacao) {
      const mensagem =
        "message" in error && typeof error.message === "string"
          ? error.message
          : "A requisição não corresponde ao formato esperado.";

      return reply.code(400).send({
        statusCode: 400,
        error: "Bad Request",
        message: "Dados da requisição inválidos.",
        details: mensagem,
      });
    }

    request.log.error({ err: error }, "Erro não tratado durante a requisição.");

    return reply.code(500).send({
      statusCode: 500,
      error: "Internal Server Error",
      message: "Ocorreu um erro interno no servidor.",
    });
  });
}
