// src/components/pages/mobile/ProfileTabPage.tsx
import React from 'react';
import { useAuthStore } from '../../../store/authStore';
import { usePersonaStore } from '../../../store/personaStore'; // 1. Importe o personaStore
import { UserCircle, ShieldCheck, LogOut, BarChart, BookOpen, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export const ProfileTabPage = () => {
  const { user, logOut } = useAuthStore();
  const { currentPersona, stats } = usePersonaStore(); // 2. Puxe a persona e as estatísticas

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Seu Perfil</h1>
      
      <div className="p-6 rounded-2xl bg-white/10 dark:bg-slate-900/20 backdrop-filter backdrop-blur-md border border-white/20 dark:border-slate-800/30">
        <div className="flex items-center gap-4">
          <UserCircle size={48} className="text-slate-800 dark:text-slate-100" />
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Logado como</p>
            <p className="font-bold text-slate-800 dark:text-slate-100 break-all">{user.email}</p>
          </div>
        </div>
      </div>

      {/* 3. NOVO: Card de Persona Dinâmico */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-2xl bg-white/10 dark:bg-slate-900/20 backdrop-filter backdrop-blur-md border border-white/20 dark:border-slate-800/30"
      >
        <div className="flex items-center gap-4 mb-4">
          <ShieldCheck size={48} className="text-blue-500" />
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Sua Persona Nexus</p>
            <p className="font-bold text-2xl text-blue-500 dark:text-blue-400">{currentPersona}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center">
            <BookOpen className="text-slate-600 dark:text-slate-400"/>
            <p className="font-bold text-lg text-slate-800 dark:text-slate-100">{stats.notesCreated}</p>
            <p className="text-xs text-slate-500">Notas</p>
          </div>
          <div className="flex flex-col items-center">
            <BarChart className="text-slate-600 dark:text-slate-400"/>
            <p className="font-bold text-lg text-slate-800 dark:text-slate-100">{stats.stocksTracked}</p>
            <p className="text-xs text-slate-500">Ações</p>
          </div>
          <div className="flex flex-col items-center">
            <Globe className="text-slate-600 dark:text-slate-400"/>
            <p className="font-bold text-lg text-slate-800 dark:text-slate-100">{stats.newsTopicsResearched}</p>
            <p className="text-xs text-slate-500">Tópicos</p>
          </div>
        </div>
      </motion.div>
      
      <button 
        onClick={logOut}
        className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/20 text-red-500 font-bold hover:bg-red-500/30 transition-colors"
      >
        <LogOut size={20} />
        Sair da Conta
      </button>
    </div>
  );
};