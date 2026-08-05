import { criarAplicacao } from "./app.js";

const PORTA = Number.parseInt(process.env["PORT"] ?? "3333", 10);
const HOST = process.env["HOST"] ?? "0.0.0.0";

async function iniciarServidor() {
  let app: Awaited<ReturnType<typeof criarAplicacao>> | undefined;

  try {
    app = await criarAplicacao();

    const encerrar = async (sinal: NodeJS.Signals) => {
      app?.log.info({ sinal }, "Encerrando servidor.");
      await app?.close();
    };

    app.get("/saude", async () => {
      return {
        status: "ok",
        banco: "conectado",
      };
    });

    const tratarSinal = (sinal: NodeJS.Signals) => {
      void encerrar(sinal).catch((error: unknown) => {
        app?.log.error({ err: error, sinal }, "Falha ao encerrar o servidor.");
        process.exitCode = 1;
      });
    };

    process.once("SIGINT", () => tratarSinal("SIGINT"));
    process.once("SIGTERM", () => tratarSinal("SIGTERM"));

    await app.listen({
      port: PORTA,
      host: HOST,
    });
  } catch (error) {
    if (app) {
      app.log.error({ err: error }, "Falha ao iniciar o servidor.");
      await app.close().catch(() => undefined);
    } else {
      console.error("Falha ao preparar o servidor.", error);
    }

    process.exitCode = 1;
  }
}

await iniciarServidor();
