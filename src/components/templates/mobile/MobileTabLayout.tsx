// src/components/templates/mobile/MobileTabLayout.tsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Compass, TrendingUp, UserCircle } from 'lucide-react';
import { clsx } from 'clsx';

const TabLink: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    clsx(
      'flex flex-col items-center justify-center gap-1 w-full h-full transition-colors',
      {
        'text-blue-500': isActive,
        'text-slate-500 dark:text-slate-400': !isActive,
      }
    );

  return (
    <NavLink to={to} className={navLinkClasses}>
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </NavLink>
  );
};

export const MobileTabLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 pb-20">
      <main className="p-4">
        <Outlet />
      </main>
      <footer className="fixed bottom-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-filter backdrop-blur-lg border-t border-slate-200 dark:border-slate-800">
        <nav className="h-full grid grid-cols-4">
          <TabLink to="/panel" icon={<LayoutDashboard size={20} />} label="Painel" />
          <TabLink to="/compass" icon={<Compass size={20} />} label="Compasso" />
          <TabLink to="/finance" icon={<TrendingUp size={20} />} label="Finanças" />
          <TabLink to="/profile" icon={<UserCircle size={20} />} label="Perfil" />
        </nav>
      </footer>
    </div>
  );
};