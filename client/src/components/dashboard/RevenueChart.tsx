import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { Card, CardHeader } from '../ui/Card';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, formatShortDay } from '../../lib/format';
import type { DashboardStats } from '../../types';

export function RevenueChart({ data }: { data: DashboardStats['revenueByDay'] }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const chartData = data.map((d) => ({ ...d, label: formatShortDay(d.date) }));
  const axisColor = isDark ? '#64748b' : '#94a3b8';
  const gridColor = isDark ? '#1e293b' : '#eef1f5';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-2"
    >
      <Card>
        <CardHeader title="Faturamento — últimos 14 dias" />
        <div className="px-2 py-4">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: 8 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: axisColor }}
                axisLine={false}
                tickLine={false}
                width={48}
                tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`)}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), 'Faturamento']}
                labelStyle={{ color: isDark ? '#e2e8f0' : '#334155', fontWeight: 600 }}
                contentStyle={{
                  borderRadius: 10,
                  border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                  fontSize: 13,
                  background: isDark ? '#0f172a' : '#fff',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#4f46e5"
                strokeWidth={2.5}
                fill="url(#rev)"
                animationDuration={900}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
}
