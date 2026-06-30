import { prisma } from '../lib/prisma';
import { AppError } from '../utils/AppError';

export const categoryService = {
  async list() {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } },
    });
    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      color: c.color,
      productCount: c._count.products,
      createdAt: c.createdAt,
    }));
  },

  async create(data: { name: string; color?: string }) {
    return prisma.category.create({ data });
  },

  async update(id: string, data: { name?: string; color?: string }) {
    await this.ensureExists(id);
    return prisma.category.update({ where: { id }, data });
  },

  async remove(id: string) {
    await this.ensureExists(id);
    const inUse = await prisma.product.count({ where: { categoryId: id } });
    if (inUse > 0) {
      throw new AppError('Não é possível remover uma categoria com produtos vinculados.', 409);
    }
    await prisma.category.delete({ where: { id } });
  },

  async ensureExists(id: string) {
    const found = await prisma.category.findUnique({ where: { id } });
    if (!found) throw new AppError('Categoria não encontrada.', 404);
    return found;
  },
};
