import { Task } from '../models/Task';
import { Agent } from '../models/Agent';
import { Session } from '../models/Session';

export function getMockTasks(): Task[] {
  return [
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
        {
          id: 'event-3',
          timestamp: new Date(Date.now() - 5400000).toISOString(),
          type: 'file_change',
          actor: 'agent',
          actorId: 'agent-1',
          description: 'Modified src/auth/oauth.ts',
          metadata: { filePath: 'src/auth/oauth.ts' },
        },
        {
          id: 'event-4',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          type: 'command',
          actor: 'agent',
          actorId: 'agent-1',
          description: 'Ran: npm test',
          metadata: { command: 'npm test', exitCode: 0 },
        },
      ],
      reviews: [],
    },
    {
      id: 'task-2',
      title: 'Add user profile page',
      description: 'Create a new user profile page with avatar upload',
      type: 'feature',
      priority: 'medium',
      status: 'review',
      assignedAgents: ['agent-2'],
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 1800000).toISOString(),
      artifacts: [
        {
          id: 'artifact-1',
          type: 'file',
          path: 'src/pages/profile.tsx',
          content: `import React, { useState } from 'react';\n\nexport default function ProfilePage() {\n  const [avatar, setAvatar] = useState(null);\n  \n  return (\n    <div>\n      <h1>User Profile</h1>\n    </div>\n  );\n}`,
          generatedBy: 'agent-2',
          createdAt: new Date(Date.now() - 1800000).toISOString(),
        },
        {
          id: 'artifact-2',
          type: 'file',
          path: 'src/components/AvatarUpload.tsx',
          content: `import React from 'react';\n\nexport function AvatarUpload() {\n  return <div>Avatar Upload Component</div>;\n}`,
          generatedBy: 'agent-2',
          createdAt: new Date(Date.now() - 1500000).toISOString(),
        },
      ],
      timeline: [],
      reviews: [
        {
          id: 'review-1',
          taskId: 'task-2',
          status: 'pending',
          summary: 'Created user profile page with avatar upload functionality. Includes form validation and error handling.',
          comments: [],
          diffs: [
            {
              id: 'diff-1',
              filePath: 'src/pages/profile.tsx',
              oldContent: '',
              newContent: `import React, { useState } from 'react';\n\nexport default function ProfilePage() {\n  const [avatar, setAvatar] = useState(null);\n  \n  return (\n    <div>\n      <h1>User Profile</h1>\n      {/* Profile content */}\n    </div>\n  );\n}`,
              hunks: [
                {
                  oldStart: 0,
                  oldLines: 0,
                  newStart: 1,
                  newLines: 12,
                  lines: [
                    { type: 'add', content: "import React, { useState } from 'react';" },
                    { type: 'add', content: '' },
                    { type: 'add', content: "export default function ProfilePage() {" },
                    { type: 'add', content: '  const [avatar, setAvatar] = useState(null);' },
                    { type: 'add', content: '  ' },
                    { type: 'add', content: '  return (' },
                    { type: 'add', content: '    <div>' },
                    { type: 'add', content: '      <h1>User Profile</h1>' },
                    { type: 'add', content: '      {/* Profile content */}' },
                    { type: 'add', content: '    </div>' },
                    { type: 'add', content: '  );' },
                    { type: 'add', content: '}' },
                  ],
                },
              ],
            },
          ],
          testResults: {
            passed: 8,
            failed: 0,
            total: 8,
            details: [
              { name: 'Profile page renders', status: 'passed', duration: 45 },
              { name: 'Avatar upload works', status: 'passed', duration: 120 },
              { name: 'Form validation', status: 'passed', duration: 89 },
            ],
          },
          createdAt: new Date(Date.now() - 1800000).toISOString(),
        },
      ],
    },
    {
      id: 'task-3',
      title: 'Refactor API routes',
      description: 'Consolidate duplicate API route handlers',
      type: 'refactor',
      priority: 'low',
      status: 'backlog',
      assignedAgents: [],
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      updatedAt: new Date(Date.now() - 259200000).toISOString(),
      artifacts: [],
      timeline: [],
      reviews: [],
    },
  ];
}

export function getMockAgents(): Agent[] {
  return [
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
    {
      id: 'agent-2',
      name: 'DocGen',
      personality: 'docs',
      model: 'gpt-4',
      status: 'idle',
      subscribedTaskTypes: ['docs', 'feature'],
      createdAt: new Date(Date.now() - 518400000).toISOString(),
      performance: {
        tasksCompleted: 8,
        averageCompletionTime: 1800000,
        successRate: 100,
        lastActiveAt: new Date(Date.now() - 7200000).toISOString(),
      },
    },
    {
      id: 'agent-3',
      name: 'TestRunner',
      personality: 'test',
      model: 'gpt-4',
      status: 'idle',
      subscribedTaskTypes: ['bug', 'feature'],
      createdAt: new Date(Date.now() - 432000000).toISOString(),
      performance: {
        tasksCompleted: 15,
        averageCompletionTime: 2400000,
        successRate: 98,
        lastActiveAt: new Date(Date.now() - 10800000).toISOString(),
      },
    },
  ];
}

export function getMockSessions(): Session[] {
  return [
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
}

