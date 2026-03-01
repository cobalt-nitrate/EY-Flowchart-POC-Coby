// Frontend mock data for initial state
import { Task } from '@/types/task';
import { Agent } from '@/types/agent';
import { Session } from '@/types/session';

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Fix authentication bug',
    description: 'Users are unable to log in with OAuth providers',
    type: 'bug',
    priority: 'high',
    status: 'in_progress',
    assignedAgents: ['agent-1'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    artifacts: [],
    timeline: [
      {
        id: 'event-1',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        type: 'status_change',
        actor: 'human',
        description: 'Task created',
      },
      {
        id: 'event-2',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        type: 'agent_spawn',
        actor: 'agent',
        actorId: 'agent-1',
        description: 'Agent "CodeBot" assigned to task',
      },
    ],
    reviews: [],
  },
];

export const mockAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'CodeBot',
    personality: 'code',
    model: 'gpt-4',
    status: 'working',
    subscribedTaskTypes: ['bug', 'backend_fix', 'refactor'],
    currentTaskId: 'task-1',
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    performance: {
      tasksCompleted: 12,
      averageCompletionTime: 3600000,
      successRate: 95,
      lastActiveAt: new Date(Date.now() - 3600000).toISOString(),
    },
  },
];

export const mockSessions: Session[] = [
  {
    id: 'session-1',
    taskId: 'task-1',
    agentId: 'agent-1',
    status: 'active',
    mode: 'observe',
    attachedUsers: [],
    terminal: {
      history: [
        {
          id: 'cmd-1',
          command: 'npm install',
          output: 'added 245 packages',
          executedBy: 'agent',
          executorId: 'agent-1',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          exitCode: 0,
        },
      ],
      currentOutput: '',
      isExecuting: false,
    },
    fileSystem: {
      currentDirectory: '/workspace',
      files: [],
      changes: [],
    },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3000000).toISOString(),
  },
];

