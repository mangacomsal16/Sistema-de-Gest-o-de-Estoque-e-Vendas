import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader } from '../ui/Card';
import { formatCurrency, formatShortDay } from '../../lib/format';
import type { DashboardStats } from '../../types';

export function RevenueChart({ data }: { data: DashboardStats['revenueByDay'] }) {
  const chartData = data.map((d) => ({ ...d, label: formatShortDay(d.date) }));

  return (
    <Card className="lg:col-span-2">
      <CardHeader title="Faturamento — últimos 14 dias" />
      <div className="px-2 py-4">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: 8 }}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef1f5" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              width={48}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`)}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), 'Faturamento']}
              labelStyle={{ color: '#334155', fontWeight: 600 }}
              contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2.5} fill="url(#rev)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
