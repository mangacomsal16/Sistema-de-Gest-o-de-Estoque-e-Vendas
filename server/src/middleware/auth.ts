import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

export interface AuthPayload {
  sub: string;
  name: string;
  role: string;
}

// Estende o Request do Express para carregar o usuário autenticado.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

// Exige um token JWT válido no header Authorization.
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    throw new AppError('Token de autenticação ausente.', 401);
  }
  try {
    const token = header.slice(7);
    req.user = jwt.verify(token, env.jwtSecret) as AuthPayload;
    next();
  } catch {
    throw new AppError('Token inválido ou expirado.', 401);
  }
}
