// src/AppRouter.tsx
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { MobileTabLayout } from './components/templates/mobile/MobileTabLayout';
import { PanelTabPage } from './components/templates/mobile/PanelTabPage';
import { NotesTabPage } from './components/templates/mobile/NotesTabPage';
import { FinanceTabPage } from './components/templates/mobile/FinanceTabPage';
import { NewsTabPage } from './components/templates/mobile/NewsTabPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MobileTabLayout />,
    children: [
      // Rota padrão: redireciona para a aba do painel
      { index: true, element: <Navigate to="/panel" replace /> },
      { path: 'panel', element: <PanelTabPage /> },
      { path: 'notes', element: <NotesTabPage /> },
      { path: 'finance', element: <FinanceTabPage /> },
      { path: 'news', element: <NewsTabPage /> },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};