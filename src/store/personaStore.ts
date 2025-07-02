// src/store/personaStore.ts
import { create } from 'zustand';
import { useNotesStore } from './notesStore';
import { useFinanceStore } from './financeStore';
import { useNewsStore } from './newsStore';

export type Persona = 'O Estrategista' | 'O Visionário' | 'O Conector' | 'O Polímata' | 'Iniciante';

interface PersonaState {
  currentPersona: Persona;
  stats: {
    notesCreated: number;
    stocksTracked: number;
    newsTopicsResearched: number;
    connectionsMade: number; // Placeholder para o futuro
  };
  calculatePersona: () => void;
}

// Função para determinar a persona baseada nas estatísticas
const determinePersona = (stats: PersonaState['stats']): Persona => {
  const { notesCreated, stocksTracked, newsTopicsResearched } = stats;

  if (notesCreated < 3 && stocksTracked < 3 && newsTopicsResearched < 3) {
    return 'Iniciante';
  }

  const isStrategist = stocksTracked > notesCreated && stocksTracked > newsTopicsResearched;
  if (isStrategist) return 'O Estrategista';

  const isVisionary = notesCreated > stocksTracked && notesCreated > newsTopicsResearched;
  if (isVisionary) return 'O Visionário';

  const isConnector = newsTopicsResearched > stocksTracked && newsTopicsResearched > notesCreated;
  if (isConnector) return 'O Conector';

  return 'O Polímata'; // Se for equilibrado
};

export const usePersonaStore = create<PersonaState>((set) => ({
  currentPersona: 'Iniciante',
  stats: {
    notesCreated: 0,
    stocksTracked: 0,
    newsTopicsResearched: 1, // Começa com 1 por causa do tópico inicial
    connectionsMade: 0,
  },
  calculatePersona: () => {
    // Pega os dados mais recentes dos outros stores
    const { notes } = useNotesStore.getState();
    const { watchlist } = useFinanceStore.getState();
    const { currentTopic } = useNewsStore.getState(); // Usaremos o tópico como proxy para "tópicos pesquisados"

    const newStats = {
      notesCreated: notes.length,
      stocksTracked: watchlist.length,
      // Lógica simples: vamos incrementar um contador a cada busca, mas por agora usamos o tamanho da watchlist
      newsTopicsResearched: new Set([currentTopic]).size, // Simplificado por enquanto
      connectionsMade: 0,
    };
    
    const newPersona = determinePersona(newStats);

    set({ stats: newStats, currentPersona: newPersona });
  },
}));