import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardHeader } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { PackageOpen } from 'lucide-react';
import type { DashboardStats } from '../../types';

const COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444'];

export function TopProductsChart({ data }: { data: DashboardStats['topProducts'] }) {
  return (
    <Card>
      <CardHeader title="Produtos mais vendidos" />
      {data.length === 0 ? (
        <EmptyState icon={<PackageOpen size={40} />} title="Sem dados" description="Nenhuma venda registrada ainda." />
      ) : (
        <div className="px-2 py-4">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={130}
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: string) => (v.length > 18 ? v.slice(0, 17) + '…' : v)}
              />
              <Tooltip
                formatter={(value: number) => [`${value} un.`, 'Vendidos']}
                contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="quantity" radius={[0, 6, 6, 0]} barSize={18}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
