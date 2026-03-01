export type AgentStatus = 'idle' | 'working' | 'blocked';

export type AgentPersonality = 'code' | 'docs' | 'research' | 'test' | 'infra';

export interface Agent {
  id: string;
  name: string;
  personality: AgentPersonality;
  model: string;
  status: AgentStatus;
  subscribedTaskTypes: string[];
  currentTaskId?: string;
  createdAt: string;
  performance: AgentPerformance;
}

export interface AgentPerformance {
  tasksCompleted: number;
  averageCompletionTime: number;
  successRate: number;
  lastActiveAt: string;
}

export interface AgentMessage {
  id: string;
  agentId: string;
  role: 'agent' | 'human';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface AgentSubscription {
  agentId: string;
  taskTypes: string[];
  priority: number;
}

