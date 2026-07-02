import { Menu, LogOut, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface TopbarProps {
  title: string;
  subtitle: string;
  onMenu: () => void;
}

export function Topbar({ title, subtitle, onMenu }: TopbarProps) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="glass sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 dark:border-slate-800 dark:bg-slate-950/70 lg:px-7"
    >
      <button
        onClick={onMenu}
        className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300 lg:hidden"
      >
        <Menu size={18} />
      </button>
      <div>
        <h1 className="font-display text-[17px] font-bold tracking-tight text-slate-800 dark:text-slate-100">{title}</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <span className="hidden text-xs capitalize text-slate-400 md:block">{today}</span>

        <button
          onClick={toggle}
          title="Alternar tema"
          className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid place-items-center"
            >
              {theme === 'dark' ? <Moon size={17} /> : <Sun size={17} />}
            </motion.span>
          </AnimatePresence>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-brand-50 text-[13px] font-semibold text-brand-500 dark:bg-brand-500/15">
            {user?.name?.charAt(0) ?? 'U'}
          </div>
          <div className="hidden sm:block">
            <div className="text-[13px] font-semibold leading-tight text-slate-700 dark:text-slate-200">{user?.name}</div>
            <div className="text-[11px] text-slate-400">{user?.email}</div>
          </div>
          <button
            onClick={logout}
            title="Sair"
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
