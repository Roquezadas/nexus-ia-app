// src/components/pages/Dashboard.tsx
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { DashboardLayout } from '../templates/DashboardLayout';
import { WeatherWidget } from '../organisms/WeatherWidget';
import { NewsWidget } from '../organisms/NewsWidget';
import { ConnectionsMap } from '../organisms/ConnectionsMap';
import { NotesWidget } from '../organisms/NotesWidget';
import { FinanceWidget } from '../organisms/FinanceWidget';

// Componente Wrapper para adicionar estilo e animação aos itens do grid
const GridItem = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full h-full">
    {children}
  </div>
);

export const Dashboard = () => {
  // Layout atualizado dos widgets. 'h' é a altura.
  const layout = [
    { i: 'weather', x: 0, y: 0, w: 3, h: 3 },
    { i: 'news', x: 3, y: 0, w: 3, h: 3 },
    { i: 'notes', x: 6, y: 0, w: 6, h: 6 },
    { i: 'finance', x: 0, y: 3, w: 6, h: 4 },
    { i: 'map', x: 6, y: 6, w: 6, h: 2 },
  ];

  return (
    <DashboardLayout>
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={100}
        width={1200}
        isDraggable={true}
        isResizable={true}
      >
        <div key="weather">
          <GridItem><WeatherWidget /></GridItem>
        </div>
        <div key="news">
          <GridItem><NewsWidget /></GridItem>
        </div>
        <div key="notes">
          <GridItem><NotesWidget /></GridItem>
        </div>
        <div key="finance">
          <GridItem><FinanceWidget /></GridItem>
        </div>
        <div key="map">
          <GridItem><ConnectionsMap /></GridItem>
        </div>
      </GridLayout>
    </DashboardLayout>
  );
};