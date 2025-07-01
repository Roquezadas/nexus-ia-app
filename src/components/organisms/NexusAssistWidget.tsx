// src/components/organisms/NexusAssistWidget.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, X, Send } from 'lucide-react';
import { useNotesStore } from '../../store/notesStore';
import { useNewsStore } from '../../store/newsStore';
import { useFinanceStore } from '../../store/financeStore';
import { useAuthStore } from '../../store/authStore'; // 1. Importe o authStore

export const NexusAssistWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [command, setCommand] = useState('');
  const [feedback, setFeedback] = useState('');
  
  const user = useAuthStore((state) => state.user); // 2. Obtenha o usuário logado
  const addNote = useNotesStore((state) => state.addNote);
  const fetchNews = useNewsStore((state) => state.fetchNews);
  const fetchStockData = useFinanceStore((state) => state.fetchStockData);

  const processCommand = () => {
    const trimmedCommand = command.trim().toLowerCase();

    if (trimmedCommand.startsWith('criar nota:')) {
      const noteText = command.substring(11).trim();
      // 3. Verifique se o usuário existe antes de criar a nota
      if (noteText && user) {
        addNote(noteText, user.uid); // 4. Passe o user.uid como segundo argumento
        setFeedback(`Nota criada: "${noteText}"`);
      } else if (!user) {
        setFeedback('Erro: Você precisa estar logado para criar uma nota.');
      } else {
        setFeedback('Erro: O conteúdo da nota não pode estar vazio.');
      }
    } 
    else if (trimmedCommand.startsWith('buscar notícias sobre:')) {
      const topic = command.substring(21).trim();
      if (topic) {
        fetchNews(topic);
        setFeedback(`Buscando notícias sobre "${topic}"...`);
      } else {
        setFeedback('Erro: O tópico da busca não pode estar vazio.');
      }
    }
    else if (trimmedCommand.startsWith('acompanhar ação:')) {
      const symbol = command.substring(16).trim().toUpperCase();
      if (symbol) {
        fetchStockData(symbol);
        setFeedback(`Buscando dados da ação "${symbol}"...`);
      } else {
        setFeedback('Erro: O símbolo da ação não pode estar vazio.');
      }
    }
    else {
      setFeedback('Comando não reconhecido.');
    }

    setCommand('');
    if (isOpen) {
        setTimeout(() => {
            setFeedback('');
            // Não fecharemos mais automaticamente para o usuário ver o feedback do erro
            if(!feedback.toLowerCase().includes('erro')) {
              setIsOpen(false);
            }
        }, 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processCommand();
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg z-50"
        aria-label="Abrir Nexus Assist"
      >
        <BrainCircuit size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-slate-200 dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl p-6" // Aumentei um pouco a largura
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Nexus Assist</h3>
                <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-slate-300 dark:hover:bg-gray-700">
                  <X size={20} />
                </button>
              </div>

              {/* Lista de Comandos Atualizada */}
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                <p>Comandos disponíveis:</p>
                <ul className="list-disc list-inside mt-2">
                  <li><code className="bg-slate-300 dark:bg-gray-700 px-1 rounded">criar nota: [seu texto]</code></li>
                  <li><code className="bg-slate-300 dark:bg-gray-700 px-1 rounded">buscar notícias sobre: [tópico]</code></li>
                  <li><code className="bg-slate-300 dark:bg-gray-700 px-1 rounded">acompanhar ação: [símbolo]</code></li>
                </ul>
              </div>

              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="Digite seu comando..."
                  className="flex-grow p-2 rounded-lg bg-white dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 focus:outline-none"
                  autoFocus
                />
                <button type="submit" className="p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:bg-slate-400" disabled={!command}>
                  <Send size={20} />
                </button>
              </form>
              
              {feedback && (
                <p className="text-center text-sm mt-4 text-green-600 dark:text-green-400 animate-pulse">{feedback}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};