import { Prisma, StockMovementReason } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../utils/AppError';

function serialize(movement: any) {
  return { ...movement };
}

export const stockMovementService = {
  // Cria o registro de auditoria. Recebe opcionalmente um client de transação
  // (tx) para ser chamado dentro de operações atômicas (venda, criação/edição de produto).
  async record(
    client: Prisma.TransactionClient | typeof prisma,
    data: { productId: string; quantity: number; reason: StockMovementReason; note?: string; userId: string }
  ) {
    return client.stockMovement.create({ data });
  },

  async listByProduct(productId: string) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new AppError('Produto não encontrado.', 404);

    const movements = await prisma.stockMovement.findMany({
      where: { productId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return movements.map(serialize);
  },
};
