// src/store/notesStore.ts
import { create } from 'zustand';
import { db } from '../lib/firebase';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  type Unsubscribe,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';

export interface Note {
  id: string;
  text: string;
  createdAt: any;
  tags: string[];
  userId: string;
}

interface NotesState {
  notes: Note[];
  loading: boolean;
  unsubscribe: Unsubscribe | null;
  subscribeToNotes: (userId: string) => void;
  unsubscribeFromNotes: () => void;
  addNote: (text: string, userId: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

const extractTags = (text: string): string[] => {
  const regex = /#(\w+)/g;
  const matches = text.match(regex) || [];
  return matches.map(tag => tag.substring(1).toLowerCase());
};

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  loading: true,
  unsubscribe: null,

  subscribeToNotes: (userId) => {
    get().unsubscribeFromNotes();

    const q = query(
      collection(db, "notes"), 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userNotes: Note[] = [];
      snapshot.forEach(doc => {
        userNotes.push({ id: doc.id, ...doc.data() } as Note);
      });
      set({ notes: userNotes, loading: false });
    });
    
    set({ unsubscribe });
  },

  unsubscribeFromNotes: () => {
    const { unsubscribe } = get();
    if (unsubscribe) {
      unsubscribe();
      set({ unsubscribe: null, notes: [], loading: true });
    }
  },

  addNote: async (text, userId) => {
    if (!userId) return;
    try {
      await addDoc(collection(db, "notes"), {
        text,
        userId,
        tags: extractTags(text),
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Erro ao adicionar nota: ", error);
    }
  },

  deleteNote: async (id) => {
    try {
      await deleteDoc(doc(db, "notes", id));
    } catch (error) {
      console.error("Erro ao deletar nota: ", error);
    }
  },
}));