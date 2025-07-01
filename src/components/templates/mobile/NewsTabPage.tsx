// src/components/pages/mobile/NewsTabPage.tsx
import { NewsWidget } from '../../organisms/NewsWidget';

export const NewsTabPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">Notícias</h1>
      {/* Dando mais altura para a lista de notícias */}
      <div className="h-[calc(100vh-10rem)]">
        <NewsWidget />
      </div>
    </div>
  );
};