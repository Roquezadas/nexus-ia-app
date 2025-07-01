// src/store/uiStore.ts
import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface UIState {
  theme: Theme;
  toggleTheme: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'light', // Tema padrão
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light',
  })),
}));