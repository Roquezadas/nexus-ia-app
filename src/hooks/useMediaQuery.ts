// src/hooks/useMediaQuery.ts
import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);

    // Adiciona o listener para mudanças no tamanho da tela
    mediaQueryList.addEventListener('change', listener);

    // Limpa o listener quando o componente for desmontado
    return () => mediaQueryList.removeEventListener('change', listener);
  }, [query]);

  return matches;
};