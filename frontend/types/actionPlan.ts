export interface ActionPlan {
  id: string;
  taskId: string;
  status: 'draft' | 'reviewing' | 'approved' | 'rejected';
  chainOfThoughts: string;
  agents: AgentStep[];
  toolSequence: ToolCall[];
  clarifyingQuestions: ClarifyingQuestion[];
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
}

export interface AgentStep {
  id: string;
  agentId?: string; // If null, agent needs to be created
  agentName: string;
  role: string;
  tools: string[];
  order: number;
  status: 'pending' | 'validated' | 'needs_creation';
}

export interface ToolCall {
  id: string;
  agentId: string;
  toolName: string;
  toolExists: boolean;
  parameters: Record<string, any>;
  order: number;
  description: string;
}

export interface ClarifyingQuestion {
  id: string;
  question: string;
  answer?: string;
  askedBy: string; // Agent ID or 'system'
  required: boolean;
}

