import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, ShoppingCart, Boxes } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useDashboard } from '../../hooks/useDashboard';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/produtos', label: 'Produtos', icon: Package, end: false },
  { to: '/vendas', label: 'Vendas', icon: ShoppingCart, end: false },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data } = useDashboard();
  const lowCount = data?.lowStockCount ?? 0;

  return (
    <>
      {/* Fundo escuro no mobile */}
      <div
        className={cn(
          'fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm transition-opacity lg:hidden',
          open ? 'block' : 'hidden'
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          'fixed z-40 flex h-screen w-60 flex-col bg-sidebar text-slate-300 transition-transform lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Marca */}
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-indigo-400 text-white shadow-glow">
            <Boxes size={20} />
          </div>
          <div>
            <div className="font-display text-[15px] font-bold text-white">Estoque &amp; Vendas</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Gestão</div>
          </div>
        </div>

        {/* Navegação */}
        <nav className="flex-1 px-3 py-2">
          <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Menu</p>
          {NAV.map(({ to, label, icon: Icon, end }, i) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className="mb-1 block"
            >
              {({ isActive }) => (
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  className={cn(
                    'relative flex items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive ? 'text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-lg bg-brand-500"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 flex w-full items-center gap-3">
                    <Icon size={18} />
                    {label}
                    {to === '/produtos' && lowCount > 0 && (
                      <span className="ml-auto grid h-5 min-w-[20px] place-items-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white">
                        {lowCount}
                      </span>
                    )}
                  </span>
                </motion.div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Rodapé */}
        <div className="flex items-center gap-2 border-t border-white/10 px-5 py-4 text-xs text-slate-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          Sistema online
        </div>
      </aside>
    </>
  );
}
