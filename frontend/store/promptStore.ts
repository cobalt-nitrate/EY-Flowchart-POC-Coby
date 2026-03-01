import { create } from 'zustand';
import { Prompt, PromptTemplate } from '@/types/prompt';

interface PromptStore {
  prompts: Prompt[];
  templates: PromptTemplate[];
  getPromptsForAgent: (agentId: string) => Prompt[];
  getGlobalPrompts: () => Prompt[];
  createPrompt: (prompt: Partial<Prompt>) => Prompt;
  updatePrompt: (id: string, updates: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
}

const mockPrompts: Prompt[] = [
  {
    id: 'prompt-1',
    agentId: 'agent-1',
    name: 'Code Review Template',
    description: 'Standard code review checklist',
    content: 'Review the code for:\n1. Code quality and best practices\n2. Security vulnerabilities\n3. Performance issues\n4. Test coverage',
    category: 'review',
    tags: ['review', 'quality', 'security'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 12,
  },
  {
    id: 'prompt-2',
    name: 'Task Planning Template',
    description: 'Break down complex tasks into steps',
    content: 'Analyze the task and create an action plan:\n1. Understand requirements\n2. Identify dependencies\n3. Plan agent assignments\n4. Define tool sequence',
    category: 'task_planning',
    tags: ['planning', 'task'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 8,
  },
  {
    id: 'prompt-3',
    agentId: 'agent-2',
    name: 'API Generation Prompt',
    description: 'Generate REST API endpoints',
    content: 'Generate REST API endpoints with:\n- Proper HTTP methods\n- Request/response validation\n- Error handling\n- Documentation',
    category: 'code_generation',
    tags: ['api', 'rest', 'endpoints'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 15,
  },
];

const mockTemplates: PromptTemplate[] = [
  {
    id: 'template-1',
    name: 'Bug Fix Analysis',
    description: 'Template for analyzing and fixing bugs',
    template: 'Analyze the bug: {{bug_description}}\n\nSteps:\n1. Reproduce the issue\n2. Identify root cause\n3. Propose solution\n4. Test fix',
    variables: ['bug_description'],
    category: 'debugging',
  },
  {
    id: 'template-2',
    name: 'Feature Implementation',
    description: 'Template for implementing new features',
    template: 'Implement feature: {{feature_name}}\n\nRequirements:\n- {{requirements}}\n\nConsiderations:\n- Performance\n- Security\n- Testing',
    variables: ['feature_name', 'requirements'],
    category: 'code_generation',
  },
];

export const usePromptStore = create<PromptStore>((set, get) => ({
  prompts: mockPrompts,
  templates: mockTemplates,

  getPromptsForAgent: (agentId: string) => {
    return get().prompts.filter(p => p.agentId === agentId);
  },

  getGlobalPrompts: () => {
    return get().prompts.filter(p => !p.agentId);
  },

  createPrompt: (promptData: Partial<Prompt>) => {
    const newPrompt: Prompt = {
      id: `prompt-${Date.now()}`,
      name: promptData.name || 'Untitled Prompt',
      description: promptData.description || '',
      content: promptData.content || '',
      category: promptData.category || 'other',
      tags: promptData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
      ...promptData,
    };
    set(state => ({
      prompts: [...state.prompts, newPrompt],
    }));
    return newPrompt;
  },

  updatePrompt: (id: string, updates: Partial<Prompt>) => {
    set(state => ({
      prompts: state.prompts.map(p =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
    }));
  },

  deletePrompt: (id: string) => {
    set(state => ({
      prompts: state.prompts.filter(p => p.id !== id),
    }));
  },
}));

