// src/components/atoms/ThemeToggle.tsx
import { Sun, Moon } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useUIStore();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-slate-300 dark:bg-gray-700 text-slate-800 dark:text-slate-200 shadow-neumorphic-light dark:shadow-neumorphic-dark"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};