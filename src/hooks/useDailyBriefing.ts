// src/hooks/useDailyBriefing.ts
import { useAuthStore } from '../store/authStore';
import { useWeatherStore } from '../store/weatherStore';
import { useFinanceStore } from '../store/financeStore';
import { useNewsStore } from '../store/newsStore';
import { useNotesStore } from '../store/notesStore';

export const useDailyBriefing = () => {
  const { user } = useAuthStore();
  const { data: weatherData } = useWeatherStore();
  const { activeSymbol } = useFinanceStore();
  const { articles, currentTopic } = useNewsStore();
  const { notes } = useNotesStore();

  const generateBriefing = (speak = false): string => {
    if (!user) return "";

    const userName = user.email?.split('@')[0] || 'usuário';
    let briefing = `Bom dia, ${userName}. `;

    if (weatherData) {
      briefing += `O tempo agora na sua localização é de ${weatherData.temperature} graus com ${weatherData.conditionDescription}. `;
    }

    if (activeSymbol) {
      briefing += `Você está de olho em ${activeSymbol}. `;
    }
    
    if (articles.length > 0) {
      briefing += `As últimas notícias sobre ${currentTopic} estão disponíveis. `;
    }

    const importantNotes = notes.filter(n => n.text.toLowerCase().includes('#importante'));
    if (importantNotes.length > 0) {
      briefing += `Você tem ${importantNotes.length} nota(s) marcada(s) como importante. `;
    } else if (notes.length > 0) {
      briefing += `Você tem ${notes.length} notas salvas. `;
    }

    briefing += "Tenha um ótimo dia!";

    if (speak && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(briefing);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
    
    return briefing;
  };

  return { generateBriefing };
};