'use client';

import { useAgentStore } from '@/store/agentStore';
import { AgentChat } from './AgentChat';
import { Bot, Loader2 } from 'lucide-react';

interface AgentTabProps {
  agentId: string;
}

export function AgentTab({ agentId }: AgentTabProps) {
  const { agents, messages } = useAgentStore();
  const agent = agents.find(a => a.id === agentId);
  const agentMessages = messages.get(agentId) || [];

  if (!agent) {
    return (
      <div className="p-4 text-center text-gray-400">
        Agent not found
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Agent Info */}
      <div className="border-b border-gray-700 p-3 bg-gray-800">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-400" />
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-200">{agent.name}</div>
            <div className="text-xs text-gray-400">
              {agent.personality} • {agent.model}
            </div>
          </div>
          <div className={`px-2 py-1 rounded text-xs ${
            agent.status === 'working' ? 'bg-green-500/20 text-green-400' :
            agent.status === 'blocked' ? 'bg-red-500/20 text-red-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>
            {agent.status}
          </div>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-hidden">
        <AgentChat agentId={agentId} />
      </div>
    </div>
  );
}

