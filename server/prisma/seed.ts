/**
 * Seed do banco de dados.
 * Popula categorias, produtos e um histórico de vendas dos últimos 14 dias,
 * para que o dashboard já carregue completo no primeiro acesso.
 *
 * Rode com: npm run prisma:seed
 */
import { PrismaClient, PaymentMethod } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Gera um número inteiro aleatório entre min e max (inclusivo)
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T>(arr: T[]): T => arr[rand(0, arr.length - 1)];

async function main() {
  console.log('Limpando dados anteriores...');
  await prisma.saleItem.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // ---------- Usuário administrador ----------
  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@estoque.com',
      password: passwordHash,
      role: 'ADMIN',
    },
  });
  console.log('Usuário admin criado: admin@estoque.com / admin123');

  // ---------- Categorias ----------
  const categoriesData = [
    { name: 'Medicamentos', color: '#4f46e5' },
    { name: 'Higiene', color: '#0ea5e9' },
    { name: 'Cuidados Pessoais', color: '#10b981' },
    { name: 'Bebidas', color: '#f59e0b' },
    { name: 'Mercearia', color: '#ef4444' },
    { name: 'Limpeza', color: '#8b5cf6' },
  ];
  const categories = await Promise.all(
    categoriesData.map((c) => prisma.category.create({ data: c }))
  );
  const catByName = Object.fromEntries(categories.map((c) => [c.name, c]));
  console.log(`${categories.length} categorias criadas`);

  // ---------- Produtos ----------
  const productsData = [
    ['Dipirona 500mg cx 10', 'Medicamentos', 12.9, 6.5, 48, 10],
    ['Paracetamol 750mg cx 20', 'Medicamentos', 18.5, 9.0, 4, 8],
    ['Ibuprofeno 400mg cx 20', 'Medicamentos', 22.9, 11.0, 30, 10],
    ['Amoxicilina 500mg cx 21', 'Medicamentos', 34.9, 18.0, 12, 6],
    ['Soro Fisiológico 500ml', 'Medicamentos', 7.5, 3.2, 0, 12],
    ['Vitamina C 1g cx 10', 'Medicamentos', 16.9, 7.5, 25, 8],
    ['Álcool em Gel 70% 500ml', 'Higiene', 14.9, 6.0, 60, 15],
    ['Sabonete Antibacteriano', 'Higiene', 4.5, 1.8, 90, 20],
    ['Máscara Descartável cx 50', 'Higiene', 29.9, 14.0, 3, 10],
    ['Lenço Umedecido pct 48', 'Higiene', 9.9, 4.2, 40, 12],
    ['Shampoo Anticaspa 400ml', 'Cuidados Pessoais', 24.9, 12.0, 22, 8],
    ['Creme Dental 90g', 'Cuidados Pessoais', 6.9, 2.9, 75, 20],
    ['Escova Dental Macia', 'Cuidados Pessoais', 8.9, 3.5, 5, 15],
    ['Protetor Solar FPS 50', 'Cuidados Pessoais', 49.9, 24.0, 18, 6],
    ['Desodorante Roll-on', 'Cuidados Pessoais', 13.9, 6.0, 33, 10],
    ['Água Mineral 1,5L', 'Bebidas', 3.5, 1.4, 120, 30],
    ['Refrigerante Cola 2L', 'Bebidas', 9.5, 4.8, 54, 20],
    ['Suco Natural 1L', 'Bebidas', 11.9, 5.5, 2, 12],
    ['Café Torrado 500g', 'Mercearia', 18.9, 9.5, 40, 12],
    ['Açúcar Refinado 1kg', 'Mercearia', 5.9, 2.8, 80, 25],
    ['Arroz Branco 5kg', 'Mercearia', 29.9, 18.0, 35, 10],
    ['Óleo de Soja 900ml', 'Mercearia', 8.9, 4.5, 4, 15],
    ['Detergente Neutro 500ml', 'Limpeza', 3.2, 1.2, 110, 30],
    ['Água Sanitária 2L', 'Limpeza', 7.9, 3.4, 28, 12],
    ['Desinfetante 1L', 'Limpeza', 9.9, 4.6, 6, 15],
  ] as const;

  const products = await Promise.all(
    productsData.map(([name, cat, price, cost, stock, min], i) =>
      prisma.product.create({
        data: {
          name,
          sku: `SKU-${String(i + 1).padStart(4, '0')}`,
          price,
          costPrice: cost,
          stock,
          minStock: min,
          categoryId: catByName[cat].id,
        },
      })
    )
  );
  console.log(`${products.length} produtos criados`);

  // ---------- Histórico de vendas (últimos 14 dias) ----------
  const methods: PaymentMethod[] = ['CASH', 'CARD', 'PIX'];
  let salesCount = 0;

  for (let day = 13; day >= 0; day--) {
    // Volume de vendas maior nos fins de semana
    const date = new Date();
    date.setDate(date.getDate() - day);
    const weekday = date.getDay();
    const salesToday = weekday === 0 || weekday === 6 ? rand(6, 11) : rand(3, 8);

    for (let s = 0; s < salesToday; s++) {
      const itemCount = rand(1, 4);
      const chosen = new Set<number>();
      const items: { productId: string; quantity: number; unitPrice: number; subtotal: number }[] = [];

      for (let it = 0; it < itemCount; it++) {
        let idx = rand(0, products.length - 1);
        while (chosen.has(idx)) idx = rand(0, products.length - 1);
        chosen.add(idx);

        const product = products[idx];
        const quantity = rand(1, 3);
        const unitPrice = Number(product.price);
        items.push({
          productId: product.id,
          quantity,
          unitPrice,
          subtotal: Number((unitPrice * quantity).toFixed(2)),
        });
      }

      const total = Number(items.reduce((acc, i) => acc + i.subtotal, 0).toFixed(2));
      const createdAt = new Date(date);
      createdAt.setHours(rand(8, 20), rand(0, 59), rand(0, 59));

      await prisma.sale.create({
        data: {
          total,
          paymentMethod: pick(methods),
          userId: admin.id,
          createdAt,
          items: { create: items },
        },
      });
      salesCount++;
    }
  }
  console.log(`${salesCount} vendas geradas nos últimos 14 dias`);
  console.log('Seed concluído com sucesso.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
