// Fundo decorativo animado (mesh/aurora gradient) via CSS puro — sem custo de vídeo.
export function AuroraBackground() {
  return (
    <div className="aurora-bg" aria-hidden>
      <div className="aurora-blob -left-32 -top-32 h-[32rem] w-[32rem] animate-aurora bg-brand-500/40" />
      <div className="aurora-blob -right-24 top-1/3 h-[28rem] w-[28rem] animate-aurora-slow bg-emerald-400/30" />
      <div className="aurora-blob bottom-[-10rem] left-1/3 h-[26rem] w-[26rem] animate-aurora bg-amber-400/20" />
    </div>
  );
}
