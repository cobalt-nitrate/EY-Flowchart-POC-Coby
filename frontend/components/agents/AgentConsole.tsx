'use client';

import { useState } from 'react';
import { useAgentStore } from '@/store/agentStore';
import { AgentTab } from './AgentTab';
import { Plus, MessageSquare } from 'lucide-react';

export function AgentConsole() {
  const { activeAgents, spawnAgent } = useAgentStore();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [showSpawnModal, setShowSpawnModal] = useState(false);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-700 p-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-200">Agents</h2>
        <button
          onClick={() => setShowSpawnModal(true)}
          className="p-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white"
          title="Spawn Agent"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Agent Tabs */}
      <div className="flex border-b border-gray-700 overflow-x-auto">
        <button
          onClick={() => setSelectedAgentId(null)}
          className={`px-4 py-2 text-sm font-medium transition-colors border-r border-gray-700 ${
            selectedAgentId === null
              ? 'bg-gray-700 text-gray-100'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Global Chat
          </div>
        </button>
        {activeAgents.map(agent => (
          <button
            key={agent.id}
            onClick={() => setSelectedAgentId(agent.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-r border-gray-700 whitespace-nowrap ${
              selectedAgentId === agent.id
                ? 'bg-gray-700 text-gray-100'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-750 hover:text-gray-200'
            }`}
          >
            {agent.name}
            {agent.status === 'working' && (
              <span className="ml-2 w-2 h-2 rounded-full bg-green-500 inline-block" />
            )}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto">
        {selectedAgentId === null ? (
          <div className="p-4 h-full flex flex-col items-center justify-center text-gray-400">
            <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-sm">Global workspace chat</p>
            <p className="text-xs mt-2">Send messages to all agents</p>
          </div>
        ) : (
          <AgentTab agentId={selectedAgentId} />
        )}
      </div>

      {/* Spawn Modal (simplified for now) */}
      {showSpawnModal && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Spawn Agent</h3>
            <p className="text-sm text-gray-400 mb-4">
              Agent spawning functionality will be implemented here.
            </p>
            <button
              onClick={() => setShowSpawnModal(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

