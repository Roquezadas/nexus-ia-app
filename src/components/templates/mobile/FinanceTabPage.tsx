// src/components/pages/mobile/FinanceTabPage.tsx
import { FinanceWidget } from '../../organisms/financeWidget';

export const FinanceTabPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">Análise Financeira</h1>
      <div className="h-[calc(100vh-10rem)]">
        <FinanceWidget />
      </div>
    </div>
  );
};