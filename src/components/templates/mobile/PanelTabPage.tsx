// src/components/pages/mobile/PanelTabPage.tsx
import React from 'react';
import { WeatherWidget } from '../../organisms/WeatherWidget';
import { useNotesStore } from '../../../store/notesStore';
import { useFinanceStore } from '../../../store/financeStore';
import { useNewsStore } from '../../../store/newsStore';
import { useNavigate } from 'react-router-dom';
import { BookMarked, TrendingUp, Newspaper } from 'lucide-react';

const SummaryCard = ({ icon, title, subtitle, onClick }: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}) => (
  <button onClick={onClick} className="w-full p-4 rounded-2xl flex items-center gap-4 bg-white/10 dark:bg-slate-900/20 backdrop-filter backdrop-blur-md border border-white/20 dark:border-slate-800/30 text-left hover:bg-white/20 dark:hover:bg-slate-800/40 transition-colors">
    <div className="p-3 bg-blue-500/20 text-blue-400 dark:text-blue-300 rounded-full">{icon}</div>
    <div>
      <h3 className="font-bold text-slate-800 dark:text-slate-100">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>
    </div>
  </button>
);

export const PanelTabPage = () => {
  const navigate = useNavigate();
  const { notes } = useNotesStore();
  // CORREÇÃO AQUI: de 'currentSymbol' para 'activeSymbol'
  const { activeSymbol } = useFinanceStore();
  const { currentTopic } = useNewsStore();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Painel Principal</h1>
      <WeatherWidget />
      
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 pt-4">Atalhos</h2>
      <div className="space-y-4">
        <SummaryCard 
          icon={<BookMarked />}
          title="Minhas Notas"
          subtitle={notes.length > 0 ? `${notes.length} notas salvas` : 'Crie sua primeira nota'}
          onClick={() => navigate('/notes')}
        />
        <SummaryCard 
          icon={<TrendingUp />}
          title="Finanças"
          // E AQUI TAMBÉM
          subtitle={activeSymbol ? `Acompanhando ${activeSymbol}` : 'Configure sua watchlist'}
          onClick={() => navigate('/finance')}
        />
        <SummaryCard 
          icon={<Newspaper />}
          title="Notícias"
          subtitle={`Vendo notícias de ${currentTopic}`}
          onClick={() => navigate('/news')}
        />
      </div>
    </div>
  );
};