// src/components/pages/AuthPage.tsx
import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { motion } from 'framer-motion';
import { AnimatedGradientBackground } from '../atoms/AnimatedGradientBackground';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signUp, loading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <AnimatedGradientBackground />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md p-8 space-y-6 bg-white/10 dark:bg-slate-900/20 rounded-2xl shadow-lg backdrop-filter backdrop-blur-md border border-white/20 dark:border-slate-800/30"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Bem-vindo ao Nexus IA</h1>
          <p className="text-slate-600 dark:text-slate-400">{isLogin ? 'Faça login para continuar' : 'Crie sua conta para começar'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-2 rounded-lg bg-black/5 dark:bg-gray-800/30 border-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 dark:text-slate-100 placeholder:text-slate-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            required
            className="w-full px-4 py-2 rounded-lg bg-black/5 dark:bg-gray-800/30 border-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 dark:text-slate-100 placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors disabled:bg-slate-500"
          >
            {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
          </button>
        </form>

        {error && <p className="text-center text-red-500 text-sm">{error}</p>}

        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
          <button onClick={() => setIsLogin(!isLogin)} className="font-bold text-blue-500 hover:underline ml-1">
            {isLogin ? 'Cadastre-se' : 'Faça login'}
          </button>
        </p>
      </motion.div> {/* <--- AQUI ESTÁ A TAG DE FECHAMENTO QUE FALTAVA */}
    </div>
  );
};