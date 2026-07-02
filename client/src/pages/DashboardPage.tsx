import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Boxes, AlertTriangle } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { Spinner } from '../components/ui/Spinner';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { TopProductsChart } from '../components/dashboard/TopProductsChart';
import { LowStockPanel } from '../components/dashboard/LowStockPanel';
import { RecentSalesPanel } from '../components/dashboard/RecentSalesPanel';
import { useDashboard } from '../hooks/useDashboard';
import { formatCurrency, formatNumber } from '../lib/format';

export function DashboardPage() {
  const { data, isLoading } = useDashboard();

  if (isLoading || !data) return <Spinner label="Carregando indicadores..." />;

  return (
    <div className="space-y-6">
      {/* Métricas principais */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          index={0}
          label="Faturamento total"
          value={data.totalRevenue}
          format={formatCurrency}
          hint={`${formatNumber(data.salesCount)} vendas no total`}
          icon={<DollarSign size={18} />}
          tone="indigo"
        />
        <StatCard
          index={1}
          label="Vendas de hoje"
          value={data.todayRevenue}
          format={formatCurrency}
          hint={`${formatNumber(data.todaySalesCount)} venda(s) hoje`}
          icon={<ShoppingBag size={18} />}
          tone="emerald"
        />
        <StatCard
          index={2}
          label="Produtos em estoque"
          value={data.totalStockUnits}
          format={formatNumber}
          hint={`${data.productCount} produtos ativos`}
          icon={<Boxes size={18} />}
          tone="amber"
        />
        <StatCard
          index={3}
          label="Estoque baixo"
          value={data.lowStockCount}
          format={formatNumber}
          hint="produtos precisam de reposição"
          icon={<AlertTriangle size={18} />}
          tone="red"
        />
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 lg:grid-cols-3">
        <RevenueChart data={data.revenueByDay} />
        <TopProductsChart data={data.topProducts} />
      </div>

      {/* Painéis */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="grid gap-4 lg:grid-cols-2"
      >
        <LowStockPanel products={data.lowStockProducts} />
        <RecentSalesPanel sales={data.recentSales} />
      </motion.div>
    </div>
  );
}
