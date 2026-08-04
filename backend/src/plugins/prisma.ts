import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";

declare module "fastify" {
  interface FastifyInstance {
    prisma: typeof prisma;
  }
}

export async function conectarPrisma(app: FastifyInstance) {
  app.decorate("prisma", prisma);

  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });

  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    app.log.info("Conexão com o PostgreSQL estabelecida.");
  } catch (error) {
    await prisma.$disconnect().catch(() => undefined);
    throw new Error("Não foi possível conectar ao PostgreSQL.", {
      cause: error,
    });
  }
}
