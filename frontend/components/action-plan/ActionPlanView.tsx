'use client';

import { useState, useEffect } from 'react';
import { useActionPlanStore } from '@/store/actionPlanStore';
import { useAgentStore } from '@/store/agentStore';
import { ActionPlan } from '@/types/actionPlan';
import { Bot, RefreshCw, CheckCircle, XCircle, AlertTriangle, Edit2, Save, X, Clock, Wrench, MessageSquare } from 'lucide-react';

interface ActionPlanViewProps {
  taskId: string;
  taskDescription: string;
}

export function ActionPlanView({ taskId, taskDescription }: ActionPlanViewProps) {
  const { getActionPlan, generateActionPlan, updateActionPlan, approveActionPlan, rejectActionPlan } = useActionPlanStore();
  const { agents } = useAgentStore();
  const [plan, setPlan] = useState<ActionPlan | undefined>(getActionPlan(taskId));
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingChainOfThoughts, setEditingChainOfThoughts] = useState(false);
  const [chainOfThoughts, setChainOfThoughts] = useState('');

  useEffect(() => {
    const currentPlan = getActionPlan(taskId);
    setPlan(currentPlan);
    if (currentPlan) {
      setChainOfThoughts(currentPlan.chainOfThoughts);
    }
  }, [taskId, getActionPlan]);

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    const newPlan = await generateActionPlan(taskId, taskDescription);
    setPlan(newPlan);
    setChainOfThoughts(newPlan.chainOfThoughts);
    setIsGenerating(false);
  };

  const handleSaveChainOfThoughts = () => {
    if (plan) {
      updateActionPlan(taskId, { chainOfThoughts });
      setEditingChainOfThoughts(false);
    }
  };

  const validateAgents = () => {
    if (!plan) return { allValid: false, missing: [] };
    const missing = plan.agents.filter(a => !a.agentId);
    return { allValid: missing.length === 0, missing };
  };

  const validateTools = () => {
    if (!plan) return { allValid: false, missing: [] };
    const missing = plan.toolSequence.filter(t => !t.toolExists);
    return { allValid: missing.length === 0, missing };
  };

  const agentValidation = validateAgents();
  const toolValidation = validateTools();
  const canApprove = agentValidation.allValid && toolValidation.allValid && plan?.clarifyingQuestions.every(q => q.answer || !q.required);

  if (!plan) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400 mb-4">No action plan generated yet</p>
        <button
          onClick={handleGeneratePlan}
          disabled={isGenerating}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded text-sm text-white"
        >
          {isGenerating ? 'Generating...' : 'Generate Action Plan'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-100">Action Plan</h3>
          <span className={`px-2 py-1 rounded text-xs ${
            plan.status === 'approved' ? 'bg-green-500/20 text-green-400' :
            plan.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
            'bg-yellow-500/20 text-yellow-400'
          }`}>
            {plan.status.toUpperCase()}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded text-sm text-gray-200"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            Re-plan
          </button>
          {plan.status === 'reviewing' && (
            <>
              <button
                onClick={() => rejectActionPlan(taskId)}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded text-sm text-white"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
              <button
                onClick={() => approveActionPlan(taskId)}
                disabled={!canApprove}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm text-white"
              >
                <CheckCircle className="w-4 h-4" />
                Approve & Execute
              </button>
            </>
          )}
        </div>
      </div>

      {/* Validation Warnings */}
      {(!agentValidation.allValid || !toolValidation.allValid) && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded">
          <div className="flex items-start gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-yellow-400 mb-2">Action Required</h4>
              {!agentValidation.allValid && (
                <div className="mb-2">
                  <p className="text-sm text-yellow-300 mb-1">Missing Agents:</p>
                  <ul className="list-disc list-inside text-sm text-yellow-200 ml-2">
                    {agentValidation.missing.map(a => (
                      <li key={a.id}>{a.agentName} - needs to be created</li>
                    ))}
                  </ul>
                </div>
              )}
              {!toolValidation.allValid && (
                <div>
                  <p className="text-sm text-yellow-300 mb-1">Missing Tools:</p>
                  <ul className="list-disc list-inside text-sm text-yellow-200 ml-2">
                    {toolValidation.missing.map(t => (
                      <li key={t.id}>{t.toolName} - needs to be created</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chain of Thoughts */}
      <div className="bg-gray-800 rounded border border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-200">Chain of Thoughts</h4>
          {!editingChainOfThoughts ? (
            <button
              onClick={() => setEditingChainOfThoughts(true)}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-gray-200"
            >
              <Edit2 className="w-3 h-3" />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSaveChainOfThoughts}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                <Save className="w-3 h-3" />
                Save
              </button>
              <button
                onClick={() => {
                  setEditingChainOfThoughts(false);
                  setChainOfThoughts(plan.chainOfThoughts);
                }}
                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-gray-200"
              >
                <X className="w-3 h-3" />
                Cancel
              </button>
            </div>
          )}
        </div>
        {editingChainOfThoughts ? (
          <textarea
            value={chainOfThoughts}
            onChange={(e) => setChainOfThoughts(e.target.value)}
            className="w-full h-48 px-3 py-2 bg-gray-900 border border-gray-600 rounded text-sm text-gray-200 font-mono"
            placeholder="Edit chain of thoughts..."
          />
        ) : (
          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">{plan.chainOfThoughts}</pre>
        )}
      </div>

      {/* Agents Timeline */}
      <div>
        <h4 className="text-sm font-semibold text-gray-200 mb-3">Agent Sequence</h4>
        <div className="space-y-3">
          {plan.agents.map((agent, index) => {
            const agentData = agent.agentId ? agents.find(a => a.id === agent.agentId) : null;
            return (
              <div
                key={agent.id}
                className="flex gap-4 p-4 bg-gray-800 rounded border border-gray-700"
              >
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    agent.status === 'validated' ? 'bg-green-500/20' :
                    agent.status === 'needs_creation' ? 'bg-yellow-500/20' :
                    'bg-gray-500/20'
                  }`}>
                    <span className="text-xs font-semibold text-gray-300">{index + 1}</span>
                  </div>
                  {index < plan.agents.length - 1 && (
                    <div className="w-0.5 h-8 bg-gray-700 mt-1" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className={`w-5 h-5 ${
                      agent.status === 'validated' ? 'text-green-400' :
                      agent.status === 'needs_creation' ? 'text-yellow-400' :
                      'text-gray-400'
                    }`} />
                    <span className="text-sm font-medium text-gray-200">{agent.agentName}</span>
                    {agent.status === 'needs_creation' && (
                      <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                        Needs Creation
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{agent.role}</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.tools.map(tool => (
                      <span key={tool} className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tool Sequence */}
      <div>
        <h4 className="text-sm font-semibold text-gray-200 mb-3">Tool Calling Sequence</h4>
        <div className="space-y-2">
          {plan.toolSequence.map((tool, index) => (
            <div
              key={tool.id}
              className="flex items-center gap-3 p-3 bg-gray-800 rounded border border-gray-700"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">{index + 1}</span>
              </div>
              <Wrench className={`w-4 h-4 ${
                tool.toolExists ? 'text-green-400' : 'text-yellow-400'
              }`} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-200">{tool.toolName}</span>
                  {!tool.toolExists && (
                    <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                      Missing
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">{tool.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clarifying Questions */}
      {plan.clarifyingQuestions.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-200 mb-3">Clarifying Questions</h4>
          <div className="space-y-3">
            {plan.clarifyingQuestions.map(question => (
              <div key={question.id} className="p-3 bg-gray-800 rounded border border-gray-700">
                <div className="flex items-start gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-blue-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-200">{question.question}</p>
                    {question.required && (
                      <span className="text-xs text-yellow-400">Required</span>
                    )}
                  </div>
                </div>
                <textarea
                  value={question.answer || ''}
                  onChange={(e) => {
                    const updatedQuestions = plan.clarifyingQuestions.map(q =>
                      q.id === question.id ? { ...q, answer: e.target.value } : q
                    );
                    updateActionPlan(taskId, { clarifyingQuestions: updatedQuestions });
                  }}
                  className="w-full mt-2 px-3 py-2 bg-gray-900 border border-gray-600 rounded text-sm text-gray-200"
                  placeholder="Your answer..."
                  rows={2}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

