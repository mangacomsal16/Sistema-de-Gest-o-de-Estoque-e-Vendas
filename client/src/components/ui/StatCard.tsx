import { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Card } from './Card';

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: ReactNode;
  tone: 'indigo' | 'emerald' | 'amber' | 'red';
}

const tones = {
  indigo: 'bg-brand-50 text-brand-500',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  red: 'bg-red-50 text-red-500',
};

export function StatCard({ label, value, hint, icon, tone }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <span className="text-[13px] font-medium text-slate-500">{label}</span>
        <span className={cn('grid h-9 w-9 place-items-center rounded-lg', tones[tone])}>{icon}</span>
      </div>
      <div className="mt-3 text-[26px] font-bold tracking-tight text-slate-800 tnum">{value}</div>
      {hint && <div className="mt-1 text-xs text-slate-400">{hint}</div>}
    </Card>
  );
}
