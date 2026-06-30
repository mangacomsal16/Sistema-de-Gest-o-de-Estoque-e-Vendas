import { useNavigate } from 'react-router-dom';
import { Receipt } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Pill } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { formatCurrency, formatDateTime, PAYMENT_LABELS } from '../../lib/format';
import type { DashboardStats } from '../../types';

export function RecentSalesPanel({ sales }: { sales: DashboardStats['recentSales'] }) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader
        title="Últimas vendas"
        action={
          <Button variant="light" size="sm" onClick={() => navigate('/vendas')}>
            Nova venda
          </Button>
        }
      />
      {sales.length === 0 ? (
        <EmptyState icon={<Receipt size={40} />} title="Sem vendas" description="As vendas aparecerão aqui." />
      ) : (
        <div className="max-h-[300px] overflow-auto">
          <table className="w-full text-sm">
            <tbody>
              {sales.map((s) => (
                <tr key={s.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-5 py-3">
                    <div className="font-semibold text-slate-700">{s.itemCount} item(s)</div>
                    <div className="text-xs text-slate-400">{formatDateTime(s.createdAt)}</div>
                  </td>
                  <td className="px-2 py-3">
                    <Pill className="bg-slate-100 text-slate-600">{PAYMENT_LABELS[s.paymentMethod]}</Pill>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-slate-700 tnum">
                    {formatCurrency(s.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
