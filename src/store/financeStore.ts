// src/store/financeStore.ts
import { create } from 'zustand';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export interface TimeSeriesData {
  date: string;
  price: number;
}
export interface CompanyInfo {
  Name: string;
  Sector: string;
}

export interface StockData {
  info: CompanyInfo | null;
  chartData: TimeSeriesData[];
}

interface FinanceState {
  watchlist: string[];
  watchlistData: Map<string, StockData>;
  activeSymbol: string | null;
  loading: Set<string>;
  error: string | null;
  initializeWatchlist: (userId: string) => Promise<void>;
  addToWatchlist: (symbol: string, userId: string) => Promise<void>;
  removeFromWatchlist: (symbol: string, userId: string) => Promise<void>;
  fetchStockData: (symbol: string) => void;
  setActiveSymbol: (symbol: string | null) => void;
}

const fetchFromApi = async (symbol: string): Promise<StockData> => {
  const API_KEY = import.meta.env.VITE_ALPHAVANTAGE_API_KEY;
  if (!API_KEY) throw new Error("Chave da API de Finanças não configurada.");
  
  const [seriesResponse, overviewResponse] = await Promise.all([
    fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`),
    fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`)
  ]);

  if (!seriesResponse.ok || !overviewResponse.ok) {
    throw new Error("Falha na comunicação com a API de finanças.");
  }

  const seriesData = await seriesResponse.json();
  const overviewData = await overviewResponse.json();

  if (seriesData['Note'] || seriesData['Error Message'] || !seriesData['Time Series (Daily)']) {
    throw new Error(seriesData['Note'] || seriesData['Error Message'] || `Símbolo '${symbol}' não encontrado.`);
  }

  const timeSeries = seriesData['Time Series (Daily)'];
  const chartData: TimeSeriesData[] = Object.keys(timeSeries).slice(0, 100).map(date => ({
    date: new Date(date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
    price: parseFloat(timeSeries[date]['4. close']),
  })).reverse();

  const info: CompanyInfo | null = overviewData.Name ? { Name: overviewData.Name, Sector: overviewData.Sector } : null;

  return { info, chartData };
};

export const useFinanceStore = create<FinanceState>((set, get) => ({
  watchlist: [],
  watchlistData: new Map(),
  activeSymbol: null,
  loading: new Set(),
  error: null,

  setActiveSymbol: (symbol) => set({ activeSymbol: symbol }),

  initializeWatchlist: async (userId) => {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists() && userDoc.data().watchlist && userDoc.data().watchlist.length > 0) {
      const watchlist = userDoc.data().watchlist;
      set({ watchlist, activeSymbol: watchlist[0] || null });
      watchlist.forEach((symbol: string) => get().fetchStockData(symbol));
    } else {
      const defaultWatchlist = ['PETR4.SA', 'AAPL'];
      await setDoc(userDocRef, { watchlist: defaultWatchlist }, { merge: true });
      set({ watchlist: defaultWatchlist, activeSymbol: defaultWatchlist[0] });
      defaultWatchlist.forEach(symbol => get().fetchStockData(symbol));
    }
  },

  addToWatchlist: async (symbol, userId) => {
    if (get().watchlist.includes(symbol)) return; // Não adiciona se já existir

    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      watchlist: arrayUnion(symbol)
    });

    set(state => ({ watchlist: [...state.watchlist, symbol] }));
    get().fetchStockData(symbol);
  },

  removeFromWatchlist: async (symbol, userId) => {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      watchlist: arrayRemove(symbol)
    });

    set(state => {
      const newWatchlist = state.watchlist.filter(s => s !== symbol);
      const newWatchlistData = new Map(state.watchlistData);
      newWatchlistData.delete(symbol);
      return {
        watchlist: newWatchlist,
        watchlistData: newWatchlistData,
        activeSymbol: state.activeSymbol === symbol ? newWatchlist[0] || null : state.activeSymbol
      };
    });
  },
  
  fetchStockData: async (symbol) => {
    set(state => ({ loading: new Set(state.loading).add(symbol), error: null }));
    try {
      const stockData = await fetchFromApi(symbol);
      set(state => ({
        watchlistData: new Map(state.watchlistData).set(symbol, stockData),
        loading: new Set(Array.from(state.loading).filter(s => s !== symbol))
      }));
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Erro ao buscar dados para ${symbol}:`, error.message);
        set(state => ({ 
          error: `Falha ao buscar dados para ${symbol}.`,
          loading: new Set(Array.from(state.loading).filter(s => s !== symbol))
        }));
      }
    }
  },
}));