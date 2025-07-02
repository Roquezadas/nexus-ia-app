// src/App.tsx
import React, { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { useNotesStore } from './store/notesStore';
import { useFinanceStore } from './store/financeStore';
import { usePersonaStore } from './store/personaStore'; // 1. Importe o personaStore
import { useMediaQuery } from './hooks/useMediaQuery';
import { Dashboard } from './components/pages/Dashboard';
import { AuthPage } from './components/pages/AuthPage';
import { AppRouter } from './AppRouter';

function AppContent() {
  const { user } = useAuthStore();
  const { subscribeToNotes, unsubscribeFromNotes, notes } = useNotesStore();
  const { initializeWatchlist, watchlist } = useFinanceStore();
  const { calculatePersona } = usePersonaStore(); // 2. Puxe a função de cálculo

  useEffect(() => {
    if (user) {
      subscribeToNotes(user.uid);
      initializeWatchlist(user.uid);
    } else {
      unsubscribeFromNotes();
    }
    return () => unsubscribeFromNotes();
  }, [user, subscribeToNotes, unsubscribeFromNotes, initializeWatchlist]);

  // 3. NOVO: useEffect para recalcular a persona quando os dados mudam
  useEffect(() => {
    if (user) {
      calculatePersona();
    }
  }, [notes, watchlist, user, calculatePersona]);


  const isDesktop = useMediaQuery('(min-width: 1024px)');
  
  return isDesktop ? <Dashboard /> : <AppRouter />;
}

// O componente App principal continua igual
function App() {
  const { user, isInitialized, initialize } = useAuthStore();

  useEffect(() => {
    const unsubscribeAuth = initialize();
    return () => unsubscribeAuth();
  }, [initialize]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-white animate-pulse">Carregando Nexus IA...</p>
      </div>
    );
  }

  return user ? <AppContent /> : <AuthPage />;
}

export default App;