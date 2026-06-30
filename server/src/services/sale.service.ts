import { PaymentMethod, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../utils/AppError';

function serializeSale(sale: any) {
  return {
    ...sale,
    total: Number(sale.total),
    items: sale.items?.map((i: any) => ({
      ...i,
      unitPrice: Number(i.unitPrice),
      subtotal: Number(i.subtotal),
    })),
  };
}

interface SaleInput {
  paymentMethod: PaymentMethod;
  items: { productId: string; quantity: number }[];
}

export const saleService = {
  // Registra a venda e dá baixa no estoque dentro de uma transação atômica.
  async create(input: SaleInput, userId: string) {
    if (!input.items.length) throw new AppError('Adicione ao menos um item à venda.', 400);

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const lineItems = [];
      let total = 0;

      for (const item of input.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product || !product.active) {
          throw new AppError(`Produto ${item.productId} indisponível.`, 404);
        }
        if (product.stock < item.quantity) {
          throw new AppError(`Estoque insuficiente para "${product.name}".`, 409);
        }

        const unitPrice = Number(product.price);
        const subtotal = Number((unitPrice * item.quantity).toFixed(2));
        total += subtotal;

        // Baixa automática no estoque
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } },
        });

        lineItems.push({ productId: product.id, quantity: item.quantity, unitPrice, subtotal });
      }

      const sale = await tx.sale.create({
        data: {
          total: Number(total.toFixed(2)),
          paymentMethod: input.paymentMethod,
          userId,
          items: { create: lineItems },
        },
        include: { items: { include: { product: true } }, user: { select: { name: true } } },
      });

      return serializeSale(sale);
    });
  },

  async list(params: { page?: number; pageSize?: number }) {
    const page = Math.max(1, params.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 10));

    const [items, total] = await prisma.$transaction([
      prisma.sale.findMany({
        include: {
          items: { include: { product: { select: { name: true, sku: true } } } },
          user: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.sale.count(),
    ]);

    return {
      data: items.map(serializeSale),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  },
};
