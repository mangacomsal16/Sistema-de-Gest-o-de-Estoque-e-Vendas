import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';
import { useCountUp } from '../../hooks/useCountUp';
import { Card } from './Card';

interface StatCardProps {
  label: string;
  value: number;
  format?: (value: number) => string;
  hint?: string;
  icon: ReactNode;
  tone: 'indigo' | 'emerald' | 'amber' | 'red';
  index?: number;
}

const tones = {
  indigo: 'bg-brand-50 text-brand-500 dark:bg-brand-500/15',
  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15',
  red: 'bg-red-50 text-red-500 dark:bg-red-500/15',
};

const glows = {
  indigo: 'hover:shadow-glow',
  emerald: 'hover:shadow-[0_8px_30px_rgba(16,185,129,.18)]',
  amber: 'hover:shadow-[0_8px_30px_rgba(245,158,11,.18)]',
  red: 'hover:shadow-[0_8px_30px_rgba(239,68,68,.18)]',
};

export function StatCard({ label, value, format = (v) => `${Math.round(v)}`, hint, icon, tone, index = 0 }: StatCardProps) {
  const animated = useCountUp(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
    >
      <Card className={cn('p-5 transition-shadow duration-300', glows[tone])}>
        <div className="flex items-start justify-between">
          <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400">{label}</span>
          <span className={cn('grid h-9 w-9 place-items-center rounded-lg', tones[tone])}>{icon}</span>
        </div>
        <div className="mt-3 text-[26px] font-bold tracking-tight text-slate-800 tnum dark:text-slate-100">
          {format(animated)}
        </div>
        {hint && <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">{hint}</div>}
      </Card>
    </motion.div>
  );
}
