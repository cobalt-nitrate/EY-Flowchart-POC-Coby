import { create } from 'zustand';
import { Agent, AgentMessage } from '@/types/agent';
import { agentAPI } from '@/lib/api';

interface AgentStore {
  agents: Agent[];
  activeAgents: Agent[];
  selectedAgent: Agent | null;
  messages: Map<string, AgentMessage[]>;
  isLoading: boolean;
  error: string | null;
  fetchAgents: () => Promise<void>;
  fetchAgent: (id: string) => Promise<void>;
  spawnAgent: (config: Partial<Agent>) => Promise<Agent>;
  updateAgent: (id: string, updates: Partial<Agent>) => Promise<void>;
  selectAgent: (agent: Agent | null) => void;
  addMessage: (agentId: string, message: AgentMessage) => void;
}

export const useAgentStore = create<AgentStore>((set, get) => ({
  agents: [],
  activeAgents: [],
  selectedAgent: null,
  messages: new Map(),
  isLoading: false,
  error: null,

  fetchAgents: async () => {
    set({ isLoading: true, error: null });
    try {
      const agents = await agentAPI.getAll();
      const activeAgents = agents.filter(a => a.status !== 'idle' || a.currentTaskId);
      set({ agents, activeAgents, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchAgent: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const agent = await agentAPI.getById(id);
      set({ selectedAgent: agent, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  spawnAgent: async (config: Partial<Agent>) => {
    set({ isLoading: true, error: null });
    try {
      const newAgent = await agentAPI.spawn(config);
      set(state => ({
        agents: [...state.agents, newAgent],
        activeAgents: [...state.activeAgents, newAgent],
        isLoading: false,
      }));
      return newAgent;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateAgent: async (id: string, updates: Partial<Agent>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedAgent = await agentAPI.update(id, updates);
      set(state => ({
        agents: state.agents.map(a => a.id === id ? updatedAgent : a),
        activeAgents: state.activeAgents.map(a => a.id === id ? updatedAgent : a),
        selectedAgent: state.selectedAgent?.id === id ? updatedAgent : state.selectedAgent,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  selectAgent: (agent: Agent | null) => {
    set({ selectedAgent: agent });
  },

  addMessage: (agentId: string, message: AgentMessage) => {
    set(state => {
      const messages = new Map(state.messages);
      const agentMessages = messages.get(agentId) || [];
      messages.set(agentId, [...agentMessages, message]);
      return { messages };
    });
  },
}));

