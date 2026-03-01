import { Agent } from '../models/Agent';
import { getMockAgents } from '../data/mockData';

let agents: Agent[] = getMockAgents();

export const agentService = {
  getAll: (): Agent[] => {
    return agents;
  },

  getById: (id: string): Agent | undefined => {
    return agents.find(a => a.id === id);
  },

  spawn: (config: Partial<Agent>): Agent => {
    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: config.name || 'Unnamed Agent',
      personality: config.personality || 'code',
      model: config.model || 'gpt-4',
      status: 'idle',
      subscribedTaskTypes: config.subscribedTaskTypes || [],
      createdAt: new Date().toISOString(),
      performance: {
        tasksCompleted: 0,
        averageCompletionTime: 0,
        successRate: 100,
        lastActiveAt: new Date().toISOString(),
      },
      ...config,
    };
    agents.push(newAgent);
    return newAgent;
  },

  update: (id: string, updates: Partial<Agent>): Agent | undefined => {
    const index = agents.findIndex(a => a.id === id);
    if (index === -1) return undefined;

    agents[index] = {
      ...agents[index],
      ...updates,
    };
    return agents[index];
  },
};

