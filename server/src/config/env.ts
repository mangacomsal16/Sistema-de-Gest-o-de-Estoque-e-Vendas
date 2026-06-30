import dotenv from 'dotenv';

dotenv.config();

// Centraliza e valida as variáveis de ambiente usadas pela API.
function required(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) throw new Error(`Variável de ambiente ausente: ${key}`);
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
  jwtSecret: required('JWT_SECRET', 'dev-secret'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
};
