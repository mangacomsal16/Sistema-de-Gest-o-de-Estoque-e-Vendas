import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

const META: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Visão geral do negócio' },
  '/produtos': { title: 'Produtos', subtitle: 'Gerencie seu estoque' },
  '/vendas': { title: 'Vendas', subtitle: 'Registre e acompanhe as vendas' },
};

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const meta = META[pathname] ?? { title: 'Painel', subtitle: '' };

  return (
    <div className="flex min-h-screen">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={meta.title} subtitle={meta.subtitle} onMenu={() => setMenuOpen(true)} />
        <main className="flex-1 p-4 lg:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
