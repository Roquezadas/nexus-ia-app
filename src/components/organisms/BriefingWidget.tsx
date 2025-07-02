// src/components/organisms/BriefingWidget.tsx
import { useState, useEffect } from 'react';
import { useDailyBriefing } from '../../hooks/useDailyBriefing';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';

export const BriefingWidget = () => {
  const [briefingText, setBriefingText] = useState('');
  const { generateBriefing } = useDailyBriefing();

  useEffect(() => {
    // Gera o texto do briefing quando o componente é montado
    setBriefingText(generateBriefing(false));
  }, [generateBriefing]);

  const handleSpeak = () => {
    // Gera e fala o briefing ao clicar
    generateBriefing(true);
  };

  if (!briefingText) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="col-span-12 p-4 mb-6 rounded-2xl flex items-center justify-between bg-white/10 dark:bg-slate-900/20 backdrop-filter backdrop-blur-md border border-white/20 dark:border-slate-800/30"
    >
      <p className="text-sm md:text-base text-slate-800 dark:text-slate-200">{briefingText}</p>
      <button onClick={handleSpeak} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-slate-800/50" title="Ouvir briefing">
        <Volume2 className="text-slate-800 dark:text-slate-200" />
      </button>
    </motion.div>
  );
};