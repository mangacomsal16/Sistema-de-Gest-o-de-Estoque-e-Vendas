import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import routes from './routes';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';

// Limite geral da API: protege contra abuso/força bruta em qualquer rota.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Muitas requisições. Tente novamente em alguns minutos.' },
});

// Limite estrito só para login: dificulta ataques de força bruta de credenciais.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { message: 'Muitas tentativas de login. Tente novamente em alguns minutos.' },
});

export function createApp() {
  const app = express();

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'", 'data:'],
          mediaSrc: ["'self'"],
          objectSrc: ["'none'"],
        },
      },
    })
  );
  app.use(cors({ origin: env.clientUrl }));
  if (env.nodeEnv !== 'production') {
    app.use(morgan('dev'));
  }
  app.use(express.json({ limit: '1mb' }));

  // Verificação de saúde da API
  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/api/auth/login', loginLimiter);
  app.use('/api', apiLimiter, routes);

  // Rota não encontrada
  app.use((_req, res) => res.status(404).json({ message: 'Recurso não encontrado.' }));

  app.use(errorHandler);
  return app;
}
