// src/components/pages/mobile/CompassTabPage.tsx
import React from 'react';
import { useCompassStore } from '../../../store/compassStore';
import { useNewsStore } from '../../../store/newsStore';
import { motion } from 'framer-motion';
import { Compass, Sparkles, Loader2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CompassTabPage = () => {
  const { goal, setGoal, roadmap, loading, generateRoadmap } = useCompassStore();
  const { fetchNews } = useNewsStore();
  const navigate = useNavigate();

  const handleSearchKeyword = (keyword: string) => {
    // Ação integrada: busca notícias sobre a palavra-chave e navega para a aba de notícias
    fetchNews(keyword);
    navigate('/news'); // Supondo que você queira navegar para a aba de notícias
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Compass size={32} className="text-blue-500"/>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Nexus Compasso</h1>
          <p className="text-sm text-slate-500">Seu GPS para grandes objetivos.</p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white/10 dark:bg-slate-900/20 backdrop-filter backdrop-blur-md border border-white/20 dark:border-slate-800/30">
        <label htmlFor="goal" className="font-bold text-slate-800 dark:text-slate-100">Defina sua próxima grande meta:</label>
        <textarea
          id="goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Ex: Dominar React e me tornar um desenvolvedor frontend sênior..."
          className="w-full mt-2 h-24 p-2 rounded-lg bg-black/5 dark:bg-gray-800/30 border-none focus:ring-2 focus:ring-blue-500 transition resize-none text-slate-800 dark:text-slate-100 placeholder:text-slate-500"
        />
        <button onClick={generateRoadmap} disabled={loading || !goal} className="w-full mt-2 flex items-center justify-center gap-2 p-2 text-sm rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
          {loading ? 'Gerando Rota...' : 'Gerar Rota com IA'}
        </button>
      </div>

      {roadmap.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Seu Roteiro Personalizado</h2>
          {roadmap.map((phase, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="p-4 rounded-2xl bg-white/10 dark:bg-slate-900/20 backdrop-filter backdrop-blur-md border border-white/20 dark:border-slate-800/30"
            >
              <h3 className="font-bold text-lg text-blue-500 dark:text-blue-400">Fase {index + 1}: {phase.title}</h3>
              <p className="text-sm mt-1 mb-3 text-slate-600 dark:text-slate-300">{phase.description}</p>
              <div className="flex flex-wrap gap-2">
                {phase.keywords.map(keyword => (
                  <button 
                    key={keyword} 
                    onClick={() => handleSearchKeyword(keyword)}
                    className="flex items-center gap-1 text-xs px-2 py-1 bg-slate-300 text-slate-700 dark:bg-slate-700 dark:text-slate-200 rounded-full hover:bg-slate-400 dark:hover:bg-slate-600"
                  >
                    <Search size={12} />
                    {keyword}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};