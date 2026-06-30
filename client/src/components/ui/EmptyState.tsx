import { ReactNode } from 'react';

export function EmptyState({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-3 text-slate-300">{icon}</div>
      <h4 className="text-[15px] font-semibold text-slate-700">{title}</h4>
      <p className="mt-1 max-w-xs text-sm text-slate-500">{description}</p>
    </div>
  );
}
