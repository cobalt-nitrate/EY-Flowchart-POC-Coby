import { create } from 'zustand';
import { ActionPlan } from '@/types/actionPlan';

interface ActionPlanStore {
  actionPlans: Map<string, ActionPlan>; // taskId -> ActionPlan
  generateActionPlan: (taskId: string, taskDescription: string) => Promise<ActionPlan>;
  updateActionPlan: (taskId: string, updates: Partial<ActionPlan>) => void;
  approveActionPlan: (taskId: string) => void;
  rejectActionPlan: (taskId: string) => void;
  getActionPlan: (taskId: string) => ActionPlan | undefined;
}

// Mock AI planning function
const generateMockActionPlan = (taskId: string, taskDescription: string): ActionPlan => {
  return {
    id: `plan-${Date.now()}`,
    taskId,
    status: 'reviewing',
    chainOfThoughts: `Analyzing task: "${taskDescription}"

1. First, I need to understand the requirements...
2. This will require multiple agents working in sequence...
3. Agent 1 should handle the initial setup...
4. Agent 2 will implement the core functionality...
5. Agent 3 will handle testing and validation...

The approach ensures proper separation of concerns and allows for parallel work where possible.`,
    agents: [
      {
        id: 'agent-step-1',
        agentId: 'agent-1',
        agentName: 'CodeBot',
        role: 'Initial setup and scaffolding',
        tools: ['file_creator', 'package_manager'],
        order: 1,
        status: 'validated',
      },
      {
        id: 'agent-step-2',
        agentId: undefined,
        agentName: 'APISpecialist',
        role: 'API implementation',
        tools: ['api_generator', 'database_migrator'],
        order: 2,
        status: 'needs_creation',
      },
      {
        id: 'agent-step-3',
        agentId: 'agent-3',
        agentName: 'TestRunner',
        role: 'Testing and validation',
        tools: ['test_runner', 'coverage_analyzer'],
        order: 3,
        status: 'validated',
      },
    ],
    toolSequence: [
      {
        id: 'tool-1',
        agentId: 'agent-1',
        toolName: 'file_creator',
        toolExists: true,
        parameters: { path: 'src/api/routes.ts', template: 'express' },
        order: 1,
        description: 'Create API route structure',
      },
      {
        id: 'tool-2',
        agentId: 'agent-1',
        toolName: 'package_manager',
        toolExists: true,
        parameters: { action: 'install', packages: ['express', 'cors'] },
        order: 2,
        description: 'Install required dependencies',
      },
      {
        id: 'tool-3',
        agentId: 'agent-2',
        toolName: 'api_generator',
        toolExists: false,
        parameters: {},
        order: 3,
        description: 'Generate API endpoints',
      },
    ],
    clarifyingQuestions: [
      {
        id: 'q-1',
        question: 'What authentication method should be used?',
        required: true,
        askedBy: 'agent-1',
      },
      {
        id: 'q-2',
        question: 'Should this support real-time updates?',
        required: false,
        askedBy: 'agent-2',
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const useActionPlanStore = create<ActionPlanStore>((set, get) => ({
  actionPlans: new Map(),

  generateActionPlan: async (taskId: string, taskDescription: string) => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const plan = generateMockActionPlan(taskId, taskDescription);
    set(state => {
      const newPlans = new Map(state.actionPlans);
      newPlans.set(taskId, plan);
      return { actionPlans: newPlans };
    });
    return plan;
  },

  updateActionPlan: (taskId: string, updates: Partial<ActionPlan>) => {
    set(state => {
      const newPlans = new Map(state.actionPlans);
      const existing = newPlans.get(taskId);
      if (existing) {
        newPlans.set(taskId, {
          ...existing,
          ...updates,
          updatedAt: new Date().toISOString(),
        });
      }
      return { actionPlans: newPlans };
    });
  },

  approveActionPlan: (taskId: string) => {
    set(state => {
      const newPlans = new Map(state.actionPlans);
      const existing = newPlans.get(taskId);
      if (existing) {
        newPlans.set(taskId, {
          ...existing,
          status: 'approved',
          approvedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      return { actionPlans: newPlans };
    });
  },

  rejectActionPlan: (taskId: string) => {
    set(state => {
      const newPlans = new Map(state.actionPlans);
      const existing = newPlans.get(taskId);
      if (existing) {
        newPlans.set(taskId, {
          ...existing,
          status: 'rejected',
          updatedAt: new Date().toISOString(),
        });
      }
      return { actionPlans: newPlans };
    });
  },

  getActionPlan: (taskId: string) => {
    return get().actionPlans.get(taskId);
  },
}));

