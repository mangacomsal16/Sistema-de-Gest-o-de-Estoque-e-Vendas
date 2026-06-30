import { Request, Response } from 'express';
import { z } from 'zod';
import { authService } from '../services/auth.service';

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(1, 'Informe a senha.'),
});

export const authController = {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  },

  async me(req: Request, res: Response) {
    const user = await authService.me(req.user!.sub);
    res.json(user);
  },
};
