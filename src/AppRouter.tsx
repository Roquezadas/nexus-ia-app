// src/AppRouter.tsx
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { MobileTabLayout } from './components/templates/mobile/MobileTabLayout';

// Corrigindo os caminhos dos imports para a pasta 'pages'
import { PanelTabPage } from './components/templates/mobile/PanelTabPage';
import { FinanceTabPage } from './components/templates/mobile/FinanceTabPage';
import { ProfileTabPage } from './components/templates/mobile/ProfileTabPage';
import { CompassTabPage } from './components/templates/mobile/CompassTabPage';
import { NewsTabPage } from './components/templates/mobile/NewsTabPage';
// A importação de NotesTabPage foi removida, pois ela agora faz parte do PanelTabPage

const router = createBrowserRouter([
  {
    path: '/',
    element: <MobileTabLayout />,
    children: [
      // A rota padrão continua sendo a do painel principal
      { index: true, element: <Navigate to="/panel" replace /> },

      // Rotas para as abas visíveis na barra de navegação
      { path: 'panel', element: <PanelTabPage /> },
      { path: 'compass', element: <CompassTabPage /> }, // Adicionamos a nova rota do Compasso
      { path: 'finance', element: <FinanceTabPage /> },
      { path: 'profile', element: <ProfileTabPage /> },

      // A rota para a página de notícias continua existindo para que os atalhos
      // do Nexus Compass funcionem, mas ela não tem mais uma aba dedicada na barra inferior.
      { path: 'news', element: <NewsTabPage /> },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};