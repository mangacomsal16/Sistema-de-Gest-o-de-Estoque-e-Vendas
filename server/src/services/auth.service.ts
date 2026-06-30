import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

export const authService = {
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError('Credenciais inválidas.', 401);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new AppError('Credenciais inválidas.', 401);

    const token = jwt.sign(
      { sub: user.id, name: user.name, role: user.role },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn } as jwt.SignOptions
    );

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  },

  async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true },
    });
    if (!user) throw new AppError('Usuário não encontrado.', 404);
    return user;
  },
};
