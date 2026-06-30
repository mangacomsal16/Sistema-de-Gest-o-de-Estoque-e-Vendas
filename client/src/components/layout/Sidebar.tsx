import { NavLink } from 'react-router-dom';
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
          'fixed inset-0 z-30 bg-slate-900/40 lg:hidden',
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
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-indigo-400 text-white">
            <Boxes size={20} />
          </div>
          <div>
            <div className="text-[15px] font-semibold text-white">Estoque &amp; Vendas</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Gestão</div>
          </div>
        </div>

        {/* Navegação */}
        <nav className="flex-1 px-3 py-2">
          <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Menu</p>
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                  isActive ? 'bg-brand-500 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                )
              }
            >
              <Icon size={18} />
              {label}
              {to === '/produtos' && lowCount > 0 && (
                <span className="ml-auto grid h-5 min-w-[20px] place-items-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white">
                  {lowCount}
                </span>
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
