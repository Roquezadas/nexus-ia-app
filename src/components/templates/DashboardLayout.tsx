// src/components/templates/DashboardLayout.tsx
import React, { useEffect } from 'react';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore'; // 1. Importe o authStore
import { ThemeToggle } from '../atoms/ThemeToggle';
import { clsx } from 'clsx';
import { NexusAssistWidget } from '../organisms/NexusAssistWidget';
import { AnimatedGradientBackground } from '../atoms/AnimatedGradientBackground';
import { LogOut } from 'lucide-react'; // Ícone para o botão de sair

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const theme = useUIStore((state) => state.theme);
  const { user, logOut } = useAuthStore(); // 2. Puxe o usuário e a função de logout

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <div className={clsx('relative min-h-screen', theme)}>
      <AnimatedGradientBackground />
      
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <header className="flex justify-between items-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">Nexus IA</h1>
          
          {/* 3. Novo container para as informações do usuário e controles */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-sm text-slate-700 dark:text-slate-300">
                  {user.email}
                </span>
                <button 
                  onClick={logOut} 
                  className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-slate-800/50 transition-colors"
                  title="Sair"
                >
                  <LogOut size={18} className="text-slate-700 dark:text-slate-300" />
                </button>
              </div>
            )}
            <ThemeToggle />
          </div>
        </header>
        <main>{children}</main>
      </div>
      
      <NexusAssistWidget />
    </div>
  );
};