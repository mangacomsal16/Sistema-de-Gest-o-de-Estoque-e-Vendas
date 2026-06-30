import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';

// Tratamento central de erros: padroniza as respostas de falha.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    return res.status(422).json({
      message: 'Dados inválidos.',
      errors: err.flatten().fieldErrors,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Violação de unicidade do Prisma (ex.: SKU/e-mail duplicado)
  if (typeof err === 'object' && err !== null && (err as any).code === 'P2002') {
    const field = (err as any).meta?.target?.[0] ?? 'campo';
    return res.status(409).json({ message: `Já existe um registro com este ${field}.` });
  }

  console.error('[erro não tratado]', err);
  return res.status(500).json({ message: 'Erro interno do servidor.' });
}
