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
          label="Faturamento total"
          value={formatCurrency(data.totalRevenue)}
          hint={`${formatNumber(data.salesCount)} vendas no total`}
          icon={<DollarSign size={18} />}
          tone="indigo"
        />
        <StatCard
          label="Vendas de hoje"
          value={formatCurrency(data.todayRevenue)}
          hint={`${formatNumber(data.todaySalesCount)} venda(s) hoje`}
          icon={<ShoppingBag size={18} />}
          tone="emerald"
        />
        <StatCard
          label="Produtos em estoque"
          value={formatNumber(data.totalStockUnits)}
          hint={`${data.productCount} produtos ativos`}
          icon={<Boxes size={18} />}
          tone="amber"
        />
        <StatCard
          label="Estoque baixo"
          value={formatNumber(data.lowStockCount)}
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
      <div className="grid gap-4 lg:grid-cols-2">
        <LowStockPanel products={data.lowStockProducts} />
        <RecentSalesPanel sales={data.recentSales} />
      </div>
    </div>
  );
}
