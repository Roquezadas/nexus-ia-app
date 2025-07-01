// src/components/organisms/ConnectionsMap.tsx
import React, { useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  type Node,
  type Edge,
} from 'reactflow';

// Precisamos importar o CSS do React Flow
import 'reactflow/dist/style.css';
import { useMapStore } from '../../store/mapStore';
import { useNewsStore } from '../../store/newsStore';

export const ConnectionsMap = () => {
  const { nodes, edges, generateMapData } = useMapStore();
  const articles = useNewsStore((state) => state.articles);

  // Este useEffect vai regenerar os dados do mapa sempre que os artigos mudarem
  useEffect(() => {
    generateMapData();
  }, [articles, generateMapData]);

  return (
    <div className="bg-slate-200/50 dark:bg-gray-800/50 rounded-3xl shadow-neumorphic-light dark:shadow-neumorphic-dark h-96 w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView // Dá um zoom para encaixar todos os nós na tela
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};