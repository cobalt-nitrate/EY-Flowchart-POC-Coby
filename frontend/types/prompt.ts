export interface Prompt {
  id: string;
  agentId?: string; // If null, it's a global prompt
  name: string;
  description: string;
  content: string;
  category: 'task_planning' | 'code_generation' | 'review' | 'debugging' | 'documentation' | 'other';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: string[];
  category: string;
}

