// src/store/newsStore.ts
import { create } from 'zustand';

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
}

const mockArticles: NewsArticle[] = [
  { title: 'IA Generativa revoluciona o mercado de trabalho', description: 'Novos modelos de linguagem estão mudando a forma como as empresas operam.', url: '#', source: 'Nexus News (Exemplo)', publishedAt: new Date().toLocaleDateString('pt-BR') },
  { title: 'Novos processadores prometem saltos de performance', description: 'A competição no mercado de semicondutores se acirra com novos lançamentos.', url: '#', source: 'Nexus News (Exemplo)', publishedAt: new Date().toLocaleDateString('pt-BR') },
  { title: 'A importância da cibersegurança em um mundo conectado', description: 'Especialistas alertam para o aumento de ataques e a necessidade de proteção.', url: '#', source: 'Nexus News (Exemplo)', publishedAt: new Date().toLocaleDateString('pt-BR') },
];

interface NewsState {
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  currentTopic: string;
  fetchNews: (topic?: string) => Promise<void>;
}

const API_KEY = import.meta.env.VITE_GNEWS_API_KEY;

export const useNewsStore = create<NewsState>((set, get) => ({
  articles: [],
  loading: true,
  error: null,
  currentTopic: 'tecnologia',

  fetchNews: async (topic) => {
    const topicToSearch = topic || get().currentTopic; 
    set({ loading: true, error: null });
    
    if (!API_KEY) {
      set({ articles: mockArticles, loading: false, error: "Chave da API não configurada." });
      return;
    }
    
    try {
      const encodedTopic = encodeURIComponent(topicToSearch);
      const response = await fetch(
        `https://gnews.io/api/v4/search?q=${encodedTopic}&country=br&lang=pt&max=10&apikey=${API_KEY}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors[0] || 'Limite da API atingido ou chave inválida.');
      }

      const rawData = await response.json();
      
      if (rawData.articles.length === 0) {
        set({ articles: mockArticles, loading: false, error: `Nenhuma notícia real encontrada para "${topicToSearch}", mostrando exemplos.` });
        return;
      }

      const formattedArticles: NewsArticle[] = rawData.articles.map((article: any) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        source: article.source.name,
        publishedAt: new Date(article.publishedAt).toLocaleDateString('pt-BR'),
      }));
      
      set({ articles: formattedArticles, loading: false });

    } catch (error) {
      if (error instanceof Error) {
        console.error("Erro na API de Notícias:", error.message);
        set({ error: error.message, articles: mockArticles, loading: false });
      }
    }
  },
}));