import { prisma } from '../lib/prisma';

// Formata uma data como YYYY-MM-DD para agrupar por dia.
function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export const dashboardService = {
  async getStats() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const start14 = new Date(startOfToday);
    start14.setDate(start14.getDate() - 13);

    const [
      revenueAgg,
      salesCount,
      todayAgg,
      products,
      recentSalesRaw,
      paymentGroups,
      last14Sales,
      topItems,
    ] = await Promise.all([
      prisma.sale.aggregate({ _sum: { total: true } }),
      prisma.sale.count(),
      prisma.sale.aggregate({
        _sum: { total: true },
        _count: true,
        where: { createdAt: { gte: startOfToday } },
      }),
      prisma.product.findMany({ where: { active: true }, include: { category: true } }),
      prisma.sale.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: { items: true, user: { select: { name: true } } },
      }),
      prisma.sale.groupBy({ by: ['paymentMethod'], _sum: { total: true } }),
      prisma.sale.findMany({
        where: { createdAt: { gte: start14 } },
        select: { total: true, createdAt: true },
      }),
      prisma.saleItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true, subtotal: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),
    ]);

    // Estatísticas de estoque
    const totalStockUnits = products.reduce((acc, p) => acc + p.stock, 0);
    const lowStockProducts = products
      .filter((p) => p.stock <= p.minStock)
      .map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        stock: p.stock,
        minStock: p.minStock,
        price: Number(p.price),
        category: { id: p.category.id, name: p.category.name, color: p.category.color },
        status: p.stock <= 0 ? 'OUT' : 'LOW',
      }))
      .sort((a, b) => a.stock - b.stock);

    // Receita por dia (preenche os 14 dias mesmo sem vendas)
    const dayMap = new Map<string, { revenue: number; sales: number }>();
    for (let i = 0; i < 14; i++) {
      const d = new Date(start14);
      d.setDate(start14.getDate() + i);
      dayMap.set(dayKey(d), { revenue: 0, sales: 0 });
    }
    for (const sale of last14Sales) {
      const key = dayKey(new Date(sale.createdAt));
      const entry = dayMap.get(key);
      if (entry) {
        entry.revenue += Number(sale.total);
        entry.sales += 1;
      }
    }
    const revenueByDay = Array.from(dayMap.entries()).map(([date, v]) => ({
      date,
      revenue: Number(v.revenue.toFixed(2)),
      sales: v.sales,
    }));

    // Vendas por forma de pagamento
    const salesByPaymentMethod = paymentGroups.map((g) => ({
      method: g.paymentMethod,
      total: Number(g._sum.total ?? 0),
    }));

    // Produtos mais vendidos
    const topProductIds = topItems.map((t) => t.productId);
    const topProductsInfo = await prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, name: true },
    });
    const nameById = Object.fromEntries(topProductsInfo.map((p) => [p.id, p.name]));
    const topProducts = topItems.map((t) => ({
      productId: t.productId,
      name: nameById[t.productId] ?? 'Produto',
      quantity: t._sum.quantity ?? 0,
      revenue: Number(t._sum.subtotal ?? 0),
    }));

    const recentSales = recentSalesRaw.map((s) => ({
      id: s.id,
      total: Number(s.total),
      paymentMethod: s.paymentMethod,
      itemCount: s.items.reduce((acc, i) => acc + i.quantity, 0),
      user: s.user,
      createdAt: s.createdAt,
    }));

    return {
      totalRevenue: Number(revenueAgg._sum.total ?? 0),
      salesCount,
      todayRevenue: Number(todayAgg._sum.total ?? 0),
      todaySalesCount: todayAgg._count,
      totalStockUnits,
      productCount: products.length,
      lowStockCount: lowStockProducts.length,
      revenueByDay,
      salesByPaymentMethod,
      lowStockProducts,
      recentSales,
      topProducts,
    };
  },
};
