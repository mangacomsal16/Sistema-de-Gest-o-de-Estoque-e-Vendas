import { Pencil, Trash2, ShoppingCart } from 'lucide-react';
import { Pill, StatusBadge } from '../ui/Badge';
import { formatCurrency } from '../../lib/format';
import type { Product } from '../../types';

interface Props {
  products: Product[];
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
  onSell: (p: Product) => void;
}

export function ProductTable({ products, onEdit, onDelete, onSell }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
            <th className="px-5 py-3 font-semibold">Produto</th>
            <th className="px-5 py-3 font-semibold">Categoria</th>
            <th className="px-5 py-3 text-right font-semibold">Preço</th>
            <th className="px-5 py-3 font-semibold">Estoque</th>
            <th className="px-5 py-3 font-semibold">Status</th>
            <th className="px-5 py-3 text-right font-semibold">Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const pct = Math.min(100, (p.stock / Math.max(1, p.minStock * 3)) * 100);
            const barColor = p.status === 'OUT' ? '#ef4444' : p.status === 'LOW' ? '#f59e0b' : '#10b981';
            return (
              <tr key={p.id} className={`border-b border-slate-100 last:border-0 hover:bg-slate-50 ${p.status === 'LOW' || p.status === 'OUT' ? 'bg-amber-50/40' : ''}`}>
                <td className="px-5 py-3">
                  <div className="font-semibold text-slate-700">{p.name}</div>
                  <div className="text-xs text-slate-400">{p.sku}</div>
                </td>
                <td className="px-5 py-3">
                  <Pill className="text-slate-600" style={{ backgroundColor: (p.category?.color ?? '#e2e8f0') + '20', color: p.category?.color }}>
                    {p.category?.name ?? '—'}
                  </Pill>
                </td>
                <td className="px-5 py-3 text-right font-medium text-slate-700 tnum">{formatCurrency(p.price)}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 text-right font-semibold text-slate-700 tnum">{p.stock}</span>
                    <span className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200">
                      <span className="block h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: barColor }} />
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => onSell(p)}
                      disabled={p.stock <= 0}
                      title="Vender"
                      className="grid h-8 w-8 place-items-center rounded-lg border border-transparent text-slate-500 hover:border-slate-200 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ShoppingCart size={16} />
                    </button>
                    <button
                      onClick={() => onEdit(p)}
                      title="Editar"
                      className="grid h-8 w-8 place-items-center rounded-lg border border-transparent text-slate-500 hover:border-slate-200 hover:bg-white"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(p)}
                      title="Remover"
                      className="grid h-8 w-8 place-items-center rounded-lg border border-transparent text-slate-500 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
