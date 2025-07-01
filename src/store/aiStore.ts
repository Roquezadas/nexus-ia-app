// src/store/aiStore.ts
import { create } from 'zustand';

interface AiState {
  summary: string | null;
  isSummarizing: boolean;
  error: string | null;
  summarizeHeadlines: (headlines: string[]) => Promise<void>;
  clearSummary: () => void;
}

export const useAiStore = create<AiState>((set) => ({
  summary: null,
  isSummarizing: false,
  error: null,

  summarizeHeadlines: async (headlines) => {
    set({ isSummarizing: true, error: null, summary: null });
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ headlines }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha na requisição de resumo.');
      }

      const data = await response.json();
      set({ summary: data.summary, isSummarizing: false });

    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message, isSummarizing: false });
      }
    }
  },

  clearSummary: () => set({ summary: null, error: null }),
}));