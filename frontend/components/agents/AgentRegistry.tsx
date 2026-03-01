'use client';

import { useEffect, useState } from 'react';
import { useAgentStore } from '@/store/agentStore';
import { Agent } from '@/types/agent';
import { PromptLibrary } from '@/components/prompts/PromptLibrary';
import { Bot, Settings, CheckCircle, XCircle, BookOpen, X } from 'lucide-react';

export function AgentRegistry() {
  const { agents, fetchAgents } = useAgentStore();
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const personalityColors = {
    code: 'bg-blue-500/20 text-blue-400',
    docs: 'bg-green-500/20 text-green-400',
    research: 'bg-purple-500/20 text-purple-400',
    test: 'bg-yellow-500/20 text-yellow-400',
    infra: 'bg-orange-500/20 text-orange-400',
  };

  return (
    <div className="h-full flex bg-gray-900">
      {/* Agent List */}
      <div className="w-80 border-r border-gray-700 bg-gray-800 overflow-y-auto">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-gray-100">Agent Registry</h2>
          <p className="text-xs text-gray-400 mt-1">Manage your AI agents</p>
        </div>
        <div className="p-2 space-y-2">
          {agents.map(agent => (
            <div
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className={`p-3 rounded cursor-pointer transition-colors ${
                selectedAgent?.id === agent.id
                  ? 'bg-gray-700 border border-blue-500'
                  : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-5 h-5 text-blue-400" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-200">{agent.name}</div>
                  <div className="text-xs text-gray-400">{agent.model}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs ${personalityColors[agent.personality]}`}>
                  {agent.personality}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs ${
                  agent.status === 'working' ? 'bg-green-500/20 text-green-400' :
                  agent.status === 'blocked' ? 'bg-red-500/20 text-red-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {agent.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Profile */}
      <div className="flex-1 overflow-y-auto">
        {selectedAgent ? (
          <div className="p-6">
            <div className="max-w-3xl">
              <h1 className="text-2xl font-semibold text-gray-100 mb-6">{selectedAgent.name}</h1>

              {/* Basic Info */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-200 mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-800 rounded border border-gray-700">
                    <div className="text-xs text-gray-400 mb-1">Personality</div>
                    <div className="text-sm text-gray-200">{selectedAgent.personality}</div>
                  </div>
                  <div className="p-3 bg-gray-800 rounded border border-gray-700">
                    <div className="text-xs text-gray-400 mb-1">Model</div>
                    <div className="text-sm text-gray-200">{selectedAgent.model}</div>
                  </div>
                  <div className="p-3 bg-gray-800 rounded border border-gray-700">
                    <div className="text-xs text-gray-400 mb-1">Status</div>
                    <div className="text-sm text-gray-200">{selectedAgent.status}</div>
                  </div>
                  <div className="p-3 bg-gray-800 rounded border border-gray-700">
                    <div className="text-xs text-gray-400 mb-1">Created</div>
                    <div className="text-sm text-gray-200">
                      {new Date(selectedAgent.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscriptions */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-200 mb-3">Subscribed Task Types</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedAgent.subscribedTaskTypes.map(type => (
                    <span
                      key={type}
                      className="px-3 py-1 bg-gray-800 rounded border border-gray-700 text-sm text-gray-300"
                    >
                      {type.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Prompt Library */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-200">Prompt Library</h3>
                  <button
                    onClick={() => setShowPromptLibrary(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-xs text-white"
                  >
                    <BookOpen className="w-3 h-3" />
                    View Prompts
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  Manage prompts for this agent
                </p>
              </div>

              {/* Performance */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-200 mb-3">Performance</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-800 rounded border border-gray-700">
                    <div className="text-xs text-gray-400 mb-1">Tasks Completed</div>
                    <div className="text-lg font-semibold text-gray-200">
                      {selectedAgent.performance.tasksCompleted}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-800 rounded border border-gray-700">
                    <div className="text-xs text-gray-400 mb-1">Success Rate</div>
                    <div className="text-lg font-semibold text-gray-200">
                      {selectedAgent.performance.successRate}%
                    </div>
                  </div>
                  <div className="p-3 bg-gray-800 rounded border border-gray-700">
                    <div className="text-xs text-gray-400 mb-1">Avg. Time</div>
                    <div className="text-lg font-semibold text-gray-200">
                      {Math.round(selectedAgent.performance.averageCompletionTime / 60000)}m
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Select an agent to view details
          </div>
        )}
      </div>

      {/* Prompt Library Modal */}
      {showPromptLibrary && selectedAgent && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div
            className="bg-gray-900 rounded-lg w-full max-w-4xl h-[80vh] flex flex-col border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-gray-100">Prompt Library</h2>
              <button
                onClick={() => setShowPromptLibrary(false)}
                className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <PromptLibrary agentId={selectedAgent.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

