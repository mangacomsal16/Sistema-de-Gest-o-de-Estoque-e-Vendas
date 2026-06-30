import { Loader2 } from 'lucide-react';

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
      <Loader2 className="animate-spin" size={28} />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}
