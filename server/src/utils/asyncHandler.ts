import { Request, Response, NextFunction, RequestHandler } from 'express';

// Encapsula controllers assíncronos para encaminhar erros ao middleware central.
export const asyncHandler =
  (fn: RequestHandler) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
