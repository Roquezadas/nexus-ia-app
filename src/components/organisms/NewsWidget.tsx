// src/components/organisms/NewsWidget.tsx
import React, { useEffect } from 'react';
import { useNewsStore, type NewsArticle } from '../../store/newsStore';
import { useAiStore } from '../../store/aiStore';
import { motion } from 'framer-motion';
import { Newspaper, AlertTriangle, Sparkles, Loader2 } from 'lucide-react';

const ArticleCard: React.FC<{ article: NewsArticle; index: number }> = ({ article, index }) => {
  return (
    <motion.a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="block p-3 rounded-lg hover:bg-black/10 dark:hover:bg-slate-800/50 transition-colors"
    >
      <h4 className="font-bold text-sm leading-tight truncate text-slate-800 dark:text-slate-100">{article.title}</h4>
      <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400 mt-1">
        <span>{article.source}</span>
        <span>{article.publishedAt}</span>
      </div>
    </motion.a>
  );
};

export const NewsWidget = () => {
  const { articles, loading, error, fetchNews, currentTopic } = useNewsStore();
  const { summary, isSummarizing, error: aiError, summarizeHeadlines, clearSummary } = useAiStore();

  // O useEffect agora é chamado apenas uma vez, e também limpa o resumo anterior.
  useEffect(() => {
    fetchNews();
    return () => {
      clearSummary();
    }
  }, [fetchNews, clearSummary]);

  const handleSummarize = () => {
    if (articles.length > 0) {
      const headlines = articles.map(a => a.title);
      summarizeHeadlines(headlines);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full animate-pulse">
          <p className="text-slate-500 dark:text-slate-400">Carregando notícias...</p>
        </div>
      );
    }
    
    if (articles.length > 0) {
      return (
        <div className="overflow-y-auto h-full pr-2 -mr-4">
          {articles.map((article, index) => (
            <ArticleCard key={article.url + index} article={article} index={index} />
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white/10 dark:bg-slate-900/20 p-4 rounded-2xl shadow-lg flex flex-col h-full backdrop-filter backdrop-blur-md border border-white/20 dark:border-slate-800/30"
    >
      <div className="flex items-center justify-between gap-2 mb-2 px-2 text-slate-800 dark:text-slate-100">
        <div className="flex items-center gap-2">
          <Newspaper size={20} />
          <h3 className="font-bold text-lg capitalize">Últimas de: {currentTopic}</h3>
        </div>
        {error && (
            <div title={error}>
                <AlertTriangle size={16} className="text-amber-500" />
            </div>
        )}
      </div>
      
      <div className="px-2 mb-2">
        {!loading && articles.length > 0 && !summary && (
          <button onClick={handleSummarize} disabled={isSummarizing} className="w-full flex items-center justify-center gap-2 p-2 text-sm rounded-lg bg-purple-500 text-white font-bold hover:bg-purple-600 transition-colors disabled:opacity-50">
            {isSummarizing ? <Loader2 size={16} className="animate-spin"/> : <Sparkles size={16} />}
            {isSummarizing ? 'Pensando...' : 'Resumir com IA'}
          </button>
        )}
        {summary && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 text-sm rounded-lg bg-purple-500/10 text-slate-800 dark:text-slate-200">
            <p className="font-bold mb-1 text-purple-800 dark:text-purple-300">Resumo do Núcleo Nexus:</p>
            {summary}
          </motion.div>
        )}
        {aiError && <p className="text-xs text-red-500 mt-2 text-center">{aiError}</p>}
      </div>

      <div className="flex-grow overflow-hidden">
        {renderContent()}
      </div>
    </motion.div>
  );
};