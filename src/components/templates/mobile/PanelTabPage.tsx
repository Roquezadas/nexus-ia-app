// src/components/pages/mobile/PanelTabPage.tsx
import React from 'react';
import { WeatherWidget } from '../../organisms/WeatherWidget';
import { NotesWidget } from '../../organisms/NotesWidget';
import { useAuthStore } from '../../../store/authStore';

export const PanelTabPage = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-md text-slate-600 dark:text-slate-400">Bem-vindo(a) de volta,</p>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 truncate">{user?.email}</h1>
      </div>
      
      <WeatherWidget />

      {/* Dando uma altura fixa para o widget de notas funcionar bem */}
      <div className="h-[50vh]">
        <NotesWidget />
      </div>
    </div>
  );
};