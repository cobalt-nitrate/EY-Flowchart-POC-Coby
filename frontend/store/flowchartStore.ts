import { create } from 'zustand';
import { DiagramGraph, DiagramNode, DiagramEdge, ChatMessage } from '@/types/flowchart';

const MAX_HISTORY = 50;

interface StreamingGraph {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

interface FlowchartStore {
  currentGraph: DiagramGraph | null;
  streamingGraph: StreamingGraph | null;
  chatMessages: ChatMessage[];
  historyStack: DiagramGraph[];
  redoStack: DiagramGraph[];
  isGenerating: boolean;
  error: string | null;

  setGraph: (graph: DiagramGraph) => void;
  setStreamingGraph: (graph: StreamingGraph | null) => void;
  undo: () => void;
  redo: () => void;
  addMessage: (msg: ChatMessage) => void;
  updateLastMessage: (content: string) => void;
  finalizeLastMessage: (content: string, thinkingText: string) => void;
  setGenerating: (val: boolean) => void;
  setError: (err: string | null) => void;
  clearSession: () => void;
}

export const useFlowchartStore = create<FlowchartStore>((set, get) => ({
  currentGraph: null,
  streamingGraph: null,
  chatMessages: [],
  historyStack: [],
  redoStack: [],
  isGenerating: false,
  error: null,

  setGraph: (graph: DiagramGraph) => {
    const { currentGraph, historyStack } = get();
    const newHistory = currentGraph
      ? [...historyStack.slice(-MAX_HISTORY + 1), currentGraph]
      : historyStack;
    set({ currentGraph: graph, streamingGraph: null, historyStack: newHistory, redoStack: [], error: null });
  },

  setStreamingGraph: (graph: StreamingGraph | null) => {
    set({ streamingGraph: graph });
  },

  undo: () => {
    const { currentGraph, historyStack, redoStack } = get();
    if (historyStack.length === 0) return;
    const previous = historyStack[historyStack.length - 1];
    set({
      currentGraph: previous,
      historyStack: historyStack.slice(0, -1),
      redoStack: currentGraph ? [currentGraph, ...redoStack] : redoStack,
    });
  },

  redo: () => {
    const { currentGraph, historyStack, redoStack } = get();
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    set({
      currentGraph: next,
      historyStack: currentGraph ? [...historyStack, currentGraph] : historyStack,
      redoStack: redoStack.slice(1),
    });
  },

  addMessage: (msg: ChatMessage) => {
    set(state => ({ chatMessages: [...state.chatMessages, msg] }));
  },

  updateLastMessage: (content: string) => {
    set(state => {
      const msgs = [...state.chatMessages];
      if (msgs.length > 0) {
        msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], content, isLoading: false };
      }
      return { chatMessages: msgs };
    });
  },

  finalizeLastMessage: (content: string, thinkingText: string) => {
    set(state => {
      const msgs = [...state.chatMessages];
      if (msgs.length > 0) {
        msgs[msgs.length - 1] = {
          ...msgs[msgs.length - 1],
          content,
          isLoading: false,
          thinkingText: thinkingText || undefined,
        };
      }
      return { chatMessages: msgs };
    });
  },

  setGenerating: (val: boolean) => set({ isGenerating: val }),

  setError: (err: string | null) => set({ error: err }),

  clearSession: () => set({
    currentGraph: null,
    streamingGraph: null,
    chatMessages: [],
    historyStack: [],
    redoStack: [],
    isGenerating: false,
    error: null,
  }),
}));
