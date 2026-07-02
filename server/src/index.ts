import { createApp } from './app';
import { env } from './config/env';
import { prisma } from './lib/prisma';

const app = createApp();

const server = app.listen(env.port, () => {
  console.log(`API rodando em http://localhost:${env.port}`);
  console.log(`CORS liberado para ${env.clientUrl}`);
});

function shutdown(signal: string) {
  console.log(`\n${signal} recebido, encerrando servidor...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
