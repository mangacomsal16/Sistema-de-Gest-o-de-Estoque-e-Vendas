import { motion } from 'framer-motion';
import { ArrowDownCircle, ArrowUpCircle, PackagePlus, SlidersHorizontal } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Spinner } from '../ui/Spinner';
import { EmptyState } from '../ui/EmptyState';
import { useStockMovements } from '../../hooks/useStockMovements';
import { formatDateTime } from '../../lib/format';
import type { Product, StockMovementReason } from '../../types';

const REASON_META: Record<StockMovementReason, { label: string; icon: typeof PackagePlus; tone: string }> = {
  CREATION: { label: 'Cadastro', icon: PackagePlus, tone: 'text-brand-500 bg-brand-50 dark:bg-brand-500/10' },
  RESTOCK: { label: 'Reposição', icon: ArrowUpCircle, tone: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' },
  ADJUSTMENT: { label: 'Ajuste manual', icon: SlidersHorizontal, tone: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10' },
  SALE: { label: 'Venda', icon: ArrowDownCircle, tone: 'text-red-500 bg-red-50 dark:bg-red-500/10' },
};

interface Props {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}

export function StockHistoryPanel({ open, onClose, product }: Props) {
  const { data, isLoading } = useStockMovements(product?.id);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Histórico de estoque"
      description={product ? `${product.name} · ${product.sku}` : undefined}
      maxWidth="max-w-md"
    >
      {isLoading ? (
        <Spinner label="Carregando histórico..." />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={<PackagePlus size={40} />}
          title="Sem movimentações"
          description="Ainda não há registros de estoque para este produto."
        />
      ) : (
        <ol className="max-h-[60vh] space-y-1 overflow-y-auto">
          {data.map((m, i) => {
            const meta = REASON_META[m.reason];
            const Icon = meta.icon;
            return (
              <motion.li
                key={m.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i, 8) * 0.03, duration: 0.25 }}
                className="flex items-start gap-3 rounded-xl px-2 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60"
              >
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${meta.tone}`}>
                  <Icon size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{meta.label}</span>
                    <span className={`tnum text-sm font-bold ${m.quantity >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {m.quantity >= 0 ? '+' : ''}
                      {m.quantity}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center justify-between gap-2 text-xs text-slate-400">
                    <span className="truncate">{m.note ?? (m.user?.name ? `por ${m.user.name}` : '—')}</span>
                    <span className="shrink-0">{formatDateTime(m.createdAt)}</span>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ol>
      )}
    </Modal>
  );
}
