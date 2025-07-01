// src/components/organisms/NotesWidget.tsx
import React, { useState } from 'react';
import { useNotesStore, type Note } from '../../store/notesStore';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { BookMarked, Trash2 } from 'lucide-react';

export const NotesWidget = () => {
  const [noteText, setNoteText] = useState('');
  const { notes, addNote, deleteNote, loading } = useNotesStore();
  const user = useAuthStore((state) => state.user);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (noteText.trim() && user) {
      addNote(noteText, user.uid);
      setNoteText('');
    }
  };

  return (
    <div className="bg-white/10 dark:bg-slate-900/20 p-4 rounded-2xl shadow-lg flex flex-col h-full backdrop-filter backdrop-blur-md border border-white/20 dark:border-slate-800/30">
      <div className="flex items-center gap-2 mb-2 px-2 text-slate-800 dark:text-slate-100">
        <BookMarked size={20} />
        <h3 className="font-bold text-lg">Minhas Notas</h3>
      </div>

      <form onSubmit={handleAddNote} className="px-2">
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Digite sua ideia... use #tags para conectar!"
          className="w-full h-20 p-2 rounded-lg bg-black/5 dark:bg-gray-800/30 border-none focus:ring-2 focus:ring-blue-500 transition resize-none text-slate-800 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
        />
        <button type="submit" className="w-full mt-2 p-2 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors disabled:opacity-50" disabled={!noteText.trim()}>
          Salvar Nota
        </button>
      </form>

      <hr className="my-4 border-slate-300/20 dark:border-gray-600/30" />

      <div className="flex-grow overflow-y-auto pr-2">
        <AnimatePresence>
          {loading && (
            <p className="text-center text-sm text-slate-500 animate-pulse">Carregando notas...</p>
          )}
          {!loading && notes.length === 0 && (
            <p className="text-center text-sm text-slate-500">Nenhuma nota ainda. Crie sua primeira!</p>
          )}
          {!loading && notes.length > 0 && (
            notes.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="mb-2 p-3 rounded-lg bg-black/5 dark:bg-gray-800/50"
              >
                <p className="text-sm text-slate-800 dark:text-slate-100 whitespace-pre-wrap">{note.text}</p>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex gap-2 flex-wrap">
                    {note.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 bg-blue-200 text-blue-800 dark:bg-blue-500/50 dark:text-white rounded-full">#{tag}</span>
                    ))}
                  </div>
                  <button onClick={() => deleteNote(note.id)} className="text-slate-500 hover:text-red-500 dark:text-slate-400 flex-shrink-0 ml-2">
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};