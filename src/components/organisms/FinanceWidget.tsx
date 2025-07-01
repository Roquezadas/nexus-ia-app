// src/components/organisms/FinanceWidget.tsx
import React, { useState, useEffect } from 'react';
import { useFinanceStore } from '../../store/financeStore';
import { useAuthStore } from '../../store/authStore';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, Building2, XCircle, PlusCircle, Loader, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

export const FinanceWidget = () => {
  const { 
    watchlist, 
    watchlistData, 
    activeSymbol, 
    loading, 
    error, 
    addToWatchlist,
    removeFromWatchlist,
    setActiveSymbol 
  } = useFinanceStore();
  
  const { user } = useAuthStore();
  const [symbolInput, setSymbolInput] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (symbolInput.trim() && user) {
      // Adiciona na watchlist e limpa o input
      addToWatchlist(symbolInput.trim().toUpperCase(), user.uid);
      setSymbolInput('');
    }
  };

  // Pega os dados da ação atualmente ativa no mapa de dados
  const activeStockData = activeSymbol ? watchlistData.get(activeSymbol) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/10 dark:bg-slate-900/20 p-4 rounded-2xl shadow-lg flex flex-col h-full backdrop-filter backdrop-blur-md border border-white/20 dark:border-slate-800/30"
    >
      <div className="flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-100">
        <TrendingUp size={20} />
        <h3 className="font-bold text-lg">Minha Watchlist</h3>
      </div>
      
      <div className="flex gap-4 h-full overflow-hidden">
        {/* Coluna da Lista de Ações (Esquerda) */}
        <div className="w-1/3 flex flex-col border-r border-white/10 dark:border-slate-800/50 pr-4">
          <form onSubmit={handleAdd} className="flex gap-2 mb-2">
            <input
              type="text"
              value={symbolInput}
              onChange={(e) => setSymbolInput(e.target.value)}
              placeholder="Ex: AAPL"
              className="w-full p-2 rounded-lg text-sm bg-black/5 dark:bg-gray-800/30 border-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 dark:text-slate-100 placeholder:text-slate-500"
            />
            <button type="submit" className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50" disabled={!symbolInput.trim()}>
              <PlusCircle size={20} />
            </button>
          </form>
          <div className="flex-grow overflow-y-auto">
            {watchlist.map(symbol => (
              <button 
                key={symbol}
                onClick={() => setActiveSymbol(symbol)}
                className={clsx(
                  "w-full text-left p-2 rounded-lg mb-1 flex justify-between items-center transition-colors",
                  activeSymbol === symbol 
                    ? "bg-blue-500/30" 
                    : "hover:bg-black/10 dark:hover:bg-slate-800/50"
                )}
              >
                <div className="flex items-center gap-2">
                  {loading.has(symbol) && <Loader size={14} className="animate-spin" />}
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{symbol}</span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); if(user) removeFromWatchlist(symbol, user.uid); }}
                  className="p-1 text-slate-500 hover:text-red-500 rounded-full opacity-50 hover:opacity-100"
                  title={`Remover ${symbol}`}
                >
                  <XCircle size={16} />
                </button>
              </button>
            ))}
          </div>
        </div>

        {/* Coluna do Gráfico e Informações (Direita) */}
        <div className="w-2/3 flex flex-col">
          {!activeSymbol && <p className="m-auto text-slate-500">Selecione uma ação da sua watchlist.</p>}
          
          {activeSymbol && (
            <>
              <div className="text-slate-800 dark:text-slate-200 min-h-[40px] mb-2">
                {activeStockData?.info ? (
                  <div>
                    <h4 className="font-bold truncate text-xl">{activeStockData.info.Name}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <Building2 size={12} />
                      <span>{activeStockData.info.Sector}</span>
                    </div>
                  </div>
                ) : (
                  loading.has(activeSymbol) && <div className="w-3/4 h-5 bg-slate-500/20 rounded animate-pulse"></div>
                )}
              </div>
              <div className="relative flex-grow w-full h-full">
                {loading.has(activeSymbol) && <p className="text-center pt-16 animate-pulse text-slate-600 dark:text-slate-300">Carregando...</p>}
                {error && <div className="text-center pt-16 text-red-500 flex flex-col items-center gap-2"><AlertTriangle/>{error}</div>}
                {activeStockData && activeStockData.chartData.length > 0 && (
                   <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={activeStockData.chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                       <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} stroke="currentColor" />
                       <XAxis dataKey="date" fontSize={10} tick={{ fill: 'currentColor' }} className="text-slate-600 dark:text-slate-400" />
                       <YAxis domain={['dataMin', 'dataMax']} fontSize={10} tick={{ fill: 'currentColor' }} className="text-slate-600 dark:text-slate-400" />
                       <Tooltip />
                       <Line type="monotone" dataKey="price" name="Preço" stroke="#3b82f6" strokeWidth={2} dot={false} />
                     </LineChart>
                   </ResponsiveContainer>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};