import { CSSProperties, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import type { StockStatus } from '../../types';

const tones: Record<StockStatus, string> = {
  IN_STOCK: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  LOW: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  OUT: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
};
const labels: Record<StockStatus, string> = {
  IN_STOCK: 'Em estoque',
  LOW: 'Estoque baixo',
  OUT: 'Esgotado',
};

export function StatusBadge({ status }: { status: StockStatus }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', tones[status])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[status]}
    </span>
  );
}

export function Pill({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', className)} style={style}>
      {children}
    </span>
  );
}
