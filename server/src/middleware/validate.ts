import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

// Valida o corpo da requisição contra um schema Zod antes do controller.
export const validateBody =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction) => {
    req.body = schema.parse(req.body);
    next();
  };
