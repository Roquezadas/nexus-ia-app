// src/components/pages/mobile/NotesTabPage.tsx
import { NotesWidget } from '../../organisms/NotesWidget';

export const NotesTabPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">Minhas Notas</h1>
      {/* Usamos uma altura maior para preencher a tela */}
      <div className="h-[calc(100vh-10rem)]">
        <NotesWidget />
      </div>
    </div>
  );
};