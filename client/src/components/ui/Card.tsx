import { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white shadow-card transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-none',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
      <h3 className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      {action}
    </div>
  );
}
