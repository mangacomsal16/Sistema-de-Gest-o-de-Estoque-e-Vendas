import express from 'express';
import cors from 'cors';
import routes from './routes';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.clientUrl }));
  app.use(express.json());

  // Verificação de saúde da API
  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/api', routes);

  // Rota não encontrada
  app.use((_req, res) => res.status(404).json({ message: 'Recurso não encontrado.' }));

  app.use(errorHandler);
  return app;
}
