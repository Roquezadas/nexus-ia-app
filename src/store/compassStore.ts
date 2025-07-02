// src/store/compassStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface RoadmapPhase {
  title: string;
  description: string;
  keywords: string[];
}

interface CompassState {
  goal: string;
  roadmap: RoadmapPhase[];
  loading: boolean;
  error: string | null;
  setGoal: (goal: string) => void;
  generateRoadmap: () => Promise<void>;
}

export const useCompassStore = create<CompassState>()(
  persist(
    (set, get) => ({
      goal: '',
      roadmap: [],
      loading: false,
      error: null,

      setGoal: (goal) => set({ goal }),

      generateRoadmap: async () => {
        const { goal } = get();
        if (!goal) return;

        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/generate-roadmap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ goal }),
          });
          if (!response.ok) throw new Error('Falha na resposta da IA.');

          const data = await response.json();
          set({ roadmap: data.roadmap, loading: false });
        } catch (error) {
          if (error instanceof Error) set({ error: error.message, loading: false });
        }
      },
    }),
    {
      name: 'nexus-compass-storage', // Salva a meta e o roteiro no localStorage
    }
  )
);