import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import type { DashboardStats } from '../../types';

export function LowStockPanel({ products }: { products: DashboardStats['lowStockProducts'] }) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader
        title="Reposição necessária"
        action={
          <Button variant="light" size="sm" onClick={() => navigate('/produtos')}>
            Ver produtos
          </Button>
        }
      />
      {products.length === 0 ? (
        <EmptyState icon={<ShieldCheck size={40} />} title="Tudo certo" description="Nenhum produto abaixo do mínimo." />
      ) : (
        <div className="max-h-[300px] overflow-auto">
          <table className="w-full text-sm">
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-5 py-3">
                    <div className="font-semibold text-slate-700">{p.name}</div>
                    <div className="text-xs text-slate-400">{p.sku}</div>
                  </td>
                  <td className="px-2 py-3 text-center">
                    <span className="font-semibold text-slate-700 tnum">{p.stock}</span>
                    <span className="text-xs text-slate-400"> / {p.minStock}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <StatusBadge status={p.status} />
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
