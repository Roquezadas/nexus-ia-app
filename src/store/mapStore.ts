// src/store/mapStore.ts
import { create } from 'zustand';
import { type Node, type Edge } from 'reactflow';
import { useNewsStore } from './newsStore';
import { useNotesStore } from './notesStore'; // <-- 1. Importe o store de notas

interface MapState {
  nodes: Node[];
  edges: Edge[];
  generateMapData: () => void;
}

export const useMapStore = create<MapState>((set) => ({
  nodes: [],
  edges: [],
  
  generateMapData: () => {
    // Pegamos os estados atuais de notícias e notas
    const newsState = useNewsStore.getState();
    const notesState = useNotesStore.getState(); // <-- 2. Obtenha o estado das notas

    const articles = newsState.articles;
    const notes = notesState.notes;

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    let yPos = 150;

    // --- Processar Notícias (como antes) ---
    if (articles.length > 0) {
      const techNode: Node = {
        id: 'tech-center', type: 'input', data: { label: 'Tecnologia' },
        position: { x: 400, y: 5 },
      };
      newNodes.push(techNode);

      articles.forEach((article, index) => {
        const articleNode: Node = {
          id: `news-${index}`, data: { label: article.title },
          position: { x: index * 150, y: yPos },
        };
        newNodes.push(articleNode);
        newEdges.push({
          id: `edge-tech-news-${index}`, source: 'tech-center', target: articleNode.id, animated: true,
        });
      });
      yPos += 150; // Aumenta o Y para a próxima camada de nós
    }

    // --- 3. Processar Notas ---
    if (notes.length > 0) {
      const notesCenterNode: Node = {
        id: 'notes-center', type: 'output', data: { label: 'Minhas Notas' },
        position: { x: 400, y: yPos },
      };
      newNodes.push(notesCenterNode);
      yPos += 150;

      notes.forEach((note, index) => {
        const noteNode: Node = {
          id: note.id,
          data: { label: note.text },
          position: { x: index * 200, y: yPos },
          style: { backgroundColor: '#cce5ff', borderColor: '#007bff' } // Estilo customizado para notas
        };
        newNodes.push(noteNode);
        newEdges.push({
          id: `edge-notes-center-${note.id}`, source: notesCenterNode.id, target: noteNode.id,
        });

        // **A LÓGICA DE CONEXÃO**
        // Se uma nota tem a tag #tecnologia, conecte-a ao nó de Tecnologia
        if (note.tags.includes('tecnologia')) {
          newEdges.push({
            id: `edge-note-tech-${note.id}`,
            source: 'tech-center', // O nó de Tecnologia
            target: note.id,      // O nó desta nota
            animated: true,
            style: { stroke: '#ff007f' }, // Cor da aresta diferente
          });
        }
      });
    }

    set({ nodes: newNodes, edges: newEdges });
  },
}));