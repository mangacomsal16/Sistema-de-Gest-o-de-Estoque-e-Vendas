import { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn('rounded-xl border border-slate-200 bg-white shadow-card', className)}>
      {children}
    </div>
  );
}

export function CardHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
      <h3 className="text-[15px] font-semibold text-slate-800">{title}</h3>
      {action}
    </div>
  );
}
