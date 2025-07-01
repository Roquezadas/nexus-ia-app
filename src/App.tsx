// src/App.tsx
import React, { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { useNotesStore } from './store/notesStore';
import { useFinanceStore } from './store/financeStore';
import { useMediaQuery } from './hooks/useMediaQuery';
import { Dashboard } from './components/pages/Dashboard';
import { AuthPage } from './components/pages/AuthPage';
import { AppRouter } from './AppRouter';

function AppContent() {
  const { user } = useAuthStore();
  const { subscribeToNotes, unsubscribeFromNotes } = useNotesStore();
  const { initializeWatchlist } = useFinanceStore();

  useEffect(() => {
    if (user) {
      subscribeToNotes(user.uid);
      initializeWatchlist(user.uid);
    } else {
      unsubscribeFromNotes();
    }
    // A função de limpeza do useEffect cuidará da desinscrição ao deslogar ou desmontar
    return () => unsubscribeFromNotes();
  }, [user, subscribeToNotes, unsubscribeFromNotes, initializeWatchlist]);

  const isDesktop = useMediaQuery('(min-width: 1024px)');
  
  return isDesktop ? <Dashboard /> : <AppRouter />;
}


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