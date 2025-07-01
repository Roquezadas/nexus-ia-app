// src/store/authStore.ts
import { create } from 'zustand';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { auth } from '../lib/firebase'; // Importamos nossa instância de auth

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean; // Para saber se já verificamos o estado inicial de login
  initialize: () => () => void; // Função que retorna a função de 'unsubscribe'
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  isInitialized: false,

  // Esta função escuta as mudanças de autenticação do Firebase em tempo real
  initialize: () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      set({ user, isInitialized: true });
    });
    return unsubscribe; // Retornamos a função para nos desinscrevermos quando o app for desmontado
  },

  signUp: async (email, password) => {
    set({ loading: true, error: null });
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error; // Lançamos o erro para o componente poder tratá-lo
    }
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      await signInWithEmailAndPassword(auth, email, password);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  logOut: async () => {
    set({ loading: true, error: null });
    try {
      await signOut(auth);
      set({ user: null, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));