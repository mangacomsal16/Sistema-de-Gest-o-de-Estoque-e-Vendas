import { Receipt } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardHeader } from '../ui/Card';
import { Pill } from '../ui/Badge';
import { Spinner } from '../ui/Spinner';
import { EmptyState } from '../ui/EmptyState';
import { Pagination } from '../ui/Pagination';
import { formatCurrency, formatDateTime, PAYMENT_LABELS } from '../../lib/format';
import { useSales } from '../../hooks/useSales';
import { useState } from 'react';

export function SalesHistory() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSales(page, 8);

  return (
    <Card>
      <CardHeader
        title="Histórico de vendas"
        action={<span className="text-xs text-slate-400">{data?.total ?? 0} venda(s)</span>}
      />
      {isLoading && !data ? (
        <Spinner />
      ) : !data || data.data.length === 0 ? (
        <EmptyState icon={<Receipt size={40} />} title="Nenhuma venda" description="Registre a primeira venda ao lado." />
      ) : (
        <>
          <div className="max-h-[520px] overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-50 dark:bg-slate-900">
                <tr className="border-b border-slate-200 text-left text-[11px] uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <th className="px-5 py-3 font-semibold">Itens</th>
                  <th className="px-3 py-3 font-semibold">Pagamento</th>
                  <th className="px-5 py-3 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((sale, i) => (
                  <motion.tr
                    key={sale.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i, 8) * 0.03 }}
                    className="border-b border-slate-100 last:border-0 align-top hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-5 py-3">
                      <div className="text-xs text-slate-400">{formatDateTime(sale.createdAt)}</div>
                      <ul className="mt-1 space-y-0.5">
                        {sale.items.map((it) => (
                          <li key={it.id} className="text-[13px] text-slate-600 dark:text-slate-300">
                            {it.quantity}× {it.product?.name ?? 'Produto'}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-3 py-3">
                      <Pill className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {PAYMENT_LABELS[sale.paymentMethod]}
                      </Pill>
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-slate-700 tnum dark:text-slate-200">
                      {formatCurrency(sale.total)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={data.totalPages} total={data.total} pageSize={data.pageSize} onChange={setPage} />
        </>
      )}
    </Card>
  );
}
