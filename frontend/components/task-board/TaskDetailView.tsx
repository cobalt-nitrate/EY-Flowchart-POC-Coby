'use client';

import { Task } from '@/types/task';
import { Timeline } from '@/components/shared/Timeline';
import { ReviewPanel } from '@/components/review/ReviewPanel';
import { ActionPlanView } from '@/components/action-plan/ActionPlanView';
import { useAgentStore } from '@/store/agentStore';
import { useTaskStore } from '@/store/taskStore';
import { Bot, Clock, FileText, CheckCircle, XCircle, AlertCircle, Plus, X, ListChecks } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TaskDetailViewProps {
  task: Task;
}

export function TaskDetailView({ task }: TaskDetailViewProps) {
  const { agents, fetchAgents } = useAgentStore();
  const { updateTask } = useTaskStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'action-plan' | 'timeline' | 'artifacts' | 'reviews'>('overview');
  const [showAssignAgentModal, setShowAssignAgentModal] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const assignedAgents = agents.filter(a => task.assignedAgents.includes(a.id));
  const availableAgents = agents.filter(a => !task.assignedAgents.includes(a.id));

  const handleAssignAgent = async (agentId: string) => {
    const updatedAgents = [...task.assignedAgents, agentId];
    await updateTask(task.id, { assignedAgents: updatedAgents });
    setShowAssignAgentModal(false);
  };

  const handleUnassignAgent = async (agentId: string) => {
    const updatedAgents = task.assignedAgents.filter(id => id !== agentId);
    await updateTask(task.id, { assignedAgents: updatedAgents });
  };

  const priorityColors = {
    low: 'bg-gray-600 text-gray-200',
    medium: 'bg-blue-600 text-white',
    high: 'bg-orange-600 text-white',
    critical: 'bg-red-600 text-white',
  };

  const statusColors = {
    backlog: 'bg-gray-600 text-gray-200',
    in_progress: 'bg-blue-600 text-white',
    review: 'bg-yellow-600 text-white',
    done: 'bg-green-600 text-white',
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-700 p-4 bg-gray-800">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-100 mb-2">{task.title}</h1>
            <p className="text-gray-400">{task.description}</p>
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded text-xs font-medium ${statusColors[task.status]}`}>
              {task.status.replace('_', ' ').toUpperCase()}
            </span>
            <span className={`px-3 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
              {task.priority.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-700">
          {(['overview', 'action-plan', 'timeline', 'artifacts', 'reviews'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-gray-100 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Agent Assignments */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-200">Assigned Agents</h3>
                <button
                  onClick={() => setShowAssignAgentModal(true)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-xs text-white"
                >
                  <Plus className="w-3 h-3" />
                  Assign Agent
                </button>
              </div>
              {assignedAgents.length > 0 ? (
                <div className="space-y-2">
                  {assignedAgents.map(agent => (
                    <div
                      key={agent.id}
                      className="flex items-center gap-3 p-3 bg-gray-800 rounded border border-gray-700"
                    >
                      <Bot className="w-5 h-5 text-blue-400" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-200">{agent.name}</div>
                        <div className="text-xs text-gray-400">{agent.personality} • {agent.model}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded text-xs ${
                          agent.status === 'working' ? 'bg-green-500/20 text-green-400' :
                          agent.status === 'blocked' ? 'bg-red-500/20 text-red-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {agent.status}
                        </div>
                        <button
                          onClick={() => handleUnassignAgent(agent.id)}
                          className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-red-400 transition-colors"
                          title="Unassign agent"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-gray-800 rounded border border-gray-700 text-center">
                  <p className="text-sm text-gray-400 mb-3">No agents assigned</p>
                  <button
                    onClick={() => setShowAssignAgentModal(true)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-xs text-white"
                  >
                    Assign an Agent
                  </button>
                </div>
              )}
            </div>

            {/* Assign Agent Modal */}
            {showAssignAgentModal && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <div
                  className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-md shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-100">Assign Agent</h3>
                    <button
                      onClick={() => setShowAssignAgentModal(false)}
                      className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-4 max-h-96 overflow-y-auto">
                    {availableAgents.length > 0 ? (
                      <div className="space-y-2">
                        {availableAgents.map(agent => (
                          <button
                            key={agent.id}
                            onClick={() => handleAssignAgent(agent.id)}
                            className="w-full flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-600 rounded border border-gray-600 text-left transition-colors"
                          >
                            <Bot className="w-5 h-5 text-blue-400" />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-200">{agent.name}</div>
                              <div className="text-xs text-gray-400">{agent.personality} • {agent.model}</div>
                            </div>
                            <div className={`px-2 py-1 rounded text-xs ${
                              agent.status === 'working' ? 'bg-green-500/20 text-green-400' :
                              agent.status === 'blocked' ? 'bg-red-500/20 text-red-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {agent.status}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-4">
                        All available agents are already assigned to this task.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Task Metadata */}
            <div>
              <h3 className="text-sm font-semibold text-gray-200 mb-3">Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-800 rounded border border-gray-700">
                  <div className="text-xs text-gray-400 mb-1">Created</div>
                  <div className="text-sm text-gray-200">
                    {new Date(task.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="p-3 bg-gray-800 rounded border border-gray-700">
                  <div className="text-xs text-gray-400 mb-1">Last Updated</div>
                  <div className="text-sm text-gray-200">
                    {new Date(task.updatedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'action-plan' && (
          <ActionPlanView taskId={task.id} taskDescription={task.description} />
        )}

        {activeTab === 'timeline' && <Timeline />}

        {activeTab === 'artifacts' && (
          <div>
            <h3 className="text-sm font-semibold text-gray-200 mb-3">Artifacts</h3>
            {task.artifacts.length > 0 ? (
              <div className="space-y-2">
                {task.artifacts.map(artifact => (
                  <div
                    key={artifact.id}
                    className="flex items-center gap-3 p-3 bg-gray-800 rounded border border-gray-700"
                  >
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-200">{artifact.path}</div>
                      <div className="text-xs text-gray-400">
                        {artifact.type} • {new Date(artifact.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No artifacts yet</p>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            {task.reviews.length > 0 ? (
              <div className="space-y-4">
                {task.reviews.map(review => (
                  <div key={review.id} className="h-[600px]">
                    <ReviewPanel review={review} taskId={task.id} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-gray-400">No reviews yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

