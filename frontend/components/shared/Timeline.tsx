'use client';

import { useTaskStore } from '@/store/taskStore';
import { Clock, User, Bot, FileText, GitBranch, CheckCircle } from 'lucide-react';

export function Timeline() {
  const { selectedTask } = useTaskStore();

  const mockEvents = [
    {
      id: 'event-1',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      type: 'status_change',
      actor: 'human' as const,
      description: 'Task created',
    },
    {
      id: 'event-2',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      type: 'agent_spawn',
      actor: 'agent' as const,
      actorId: 'agent-1',
      description: 'Agent "CodeBot" assigned to task',
    },
    {
      id: 'event-3',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      type: 'file_change',
      actor: 'agent' as const,
      actorId: 'agent-1',
      description: 'Modified src/auth.ts',
    },
    {
      id: 'event-4',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      type: 'command',
      actor: 'agent' as const,
      actorId: 'agent-1',
      description: 'Ran: npm test',
    },
  ];

  const events = selectedTask?.timeline || mockEvents;

  const getIcon = (type: string, actor: string) => {
    if (type === 'agent_spawn') return <Bot className="w-4 h-4 text-blue-400" />;
    if (type === 'file_change') return <FileText className="w-4 h-4 text-green-400" />;
    if (type === 'command') return <GitBranch className="w-4 h-4 text-purple-400" />;
    if (type === 'status_change') return <CheckCircle className="w-4 h-4 text-yellow-400" />;
    return <Clock className="w-4 h-4 text-gray-400" />;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <div className="p-4">
      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={event.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`p-2 rounded-full ${
                event.actor === 'agent' ? 'bg-blue-500/20' : 'bg-gray-500/20'
              }`}>
                {getIcon(event.type, event.actor)}
              </div>
              {index < events.length - 1 && (
                <div className={`w-0.5 h-8 ${
                  event.actor === 'agent' ? 'bg-blue-500/30' : 'bg-gray-500/30'
                }`} />
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-200">
                  {event.actor === 'agent' ? 'Agent' : 'Human'}
                </span>
                <span className="text-xs text-gray-500">
                  {formatTime(event.timestamp)}
                </span>
              </div>
              <p className="text-sm text-gray-400">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

