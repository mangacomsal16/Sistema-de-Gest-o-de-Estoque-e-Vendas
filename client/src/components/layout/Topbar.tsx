import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TopbarProps {
  title: string;
  subtitle: string;
  onMenu: () => void;
}

export function Topbar({ title, subtitle, onMenu }: TopbarProps) {
  const { user, logout } = useAuth();
  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:px-7">
      <button onClick={onMenu} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 lg:hidden">
        <Menu size={18} />
      </button>
      <div>
        <h1 className="text-[17px] font-semibold tracking-tight text-slate-800">{title}</h1>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <span className="hidden text-xs capitalize text-slate-400 md:block">{today}</span>
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-brand-50 text-[13px] font-semibold text-brand-500">
            {user?.name?.charAt(0) ?? 'U'}
          </div>
          <div className="hidden sm:block">
            <div className="text-[13px] font-semibold leading-tight text-slate-700">{user?.name}</div>
            <div className="text-[11px] text-slate-400">{user?.email}</div>
          </div>
          <button onClick={logout} title="Sair" className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
