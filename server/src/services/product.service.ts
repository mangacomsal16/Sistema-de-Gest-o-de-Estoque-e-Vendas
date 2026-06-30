import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../utils/AppError';

// Converte os campos Decimal do Prisma em number e adiciona o status de estoque.
function serialize(product: any) {
  const stock = product.stock;
  const minStock = product.minStock;
  const status = stock <= 0 ? 'OUT' : stock <= minStock ? 'LOW' : 'IN_STOCK';
  return {
    ...product,
    price: Number(product.price),
    costPrice: product.costPrice != null ? Number(product.costPrice) : null,
    status,
  };
}

interface ListParams {
  search?: string;
  categoryId?: string;
  status?: 'IN_STOCK' | 'LOW' | 'OUT';
  page?: number;
  pageSize?: number;
}

export const productService = {
  async list(params: ListParams) {
    const page = Math.max(1, params.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 10));

    const where: Prisma.ProductWhereInput = { active: true };
    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { sku: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    if (params.categoryId) where.categoryId = params.categoryId;

    // Filtro por status de estoque (traduzido para condições numéricas).
    if (params.status === 'OUT') where.stock = { lte: 0 };
    if (params.status === 'IN_STOCK') where.stock = { gt: 0 };

    let [items, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    // O status LOW depende de minStock por produto, filtrado em memória.
    let data = items.map(serialize);
    if (params.status === 'LOW') {
      data = data.filter((p) => p.status === 'LOW');
    }

    return {
      data,
      total: params.status === 'LOW' ? data.length : total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil((params.status === 'LOW' ? data.length : total) / pageSize)),
    };
  },

  async getById(id: string) {
    const product = await prisma.product.findUnique({ where: { id }, include: { category: true } });
    if (!product) throw new AppError('Produto não encontrado.', 404);
    return serialize(product);
  },

  async create(data: any) {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        sku: data.sku,
        description: data.description ?? null,
        price: data.price,
        costPrice: data.costPrice ?? null,
        stock: data.stock,
        minStock: data.minStock,
        categoryId: data.categoryId,
      },
      include: { category: true },
    });
    return serialize(product);
  },

  async update(id: string, data: any) {
    await this.getById(id);
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        sku: data.sku,
        description: data.description,
        price: data.price,
        costPrice: data.costPrice,
        stock: data.stock,
        minStock: data.minStock,
        categoryId: data.categoryId,
      },
      include: { category: true },
    });
    return serialize(product);
  },

  // Remoção lógica: mantém o histórico de vendas íntegro.
  async remove(id: string) {
    await this.getById(id);
    await prisma.product.update({ where: { id }, data: { active: false } });
  },
};
