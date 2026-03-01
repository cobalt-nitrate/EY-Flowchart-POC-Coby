'use client';

import { useState } from 'react';
import { usePromptStore } from '@/store/promptStore';
import { useAgentStore } from '@/store/agentStore';
import { Prompt } from '@/types/prompt';
import { Search, Plus, Edit2, Trash2, Copy, X, BookOpen } from 'lucide-react';

interface PromptLibraryProps {
  agentId?: string;
  onSelect?: (prompt: Prompt) => void;
}

export function PromptLibrary({ agentId, onSelect }: PromptLibraryProps) {
  const { prompts, templates, getPromptsForAgent, getGlobalPrompts, createPrompt, updatePrompt, deletePrompt } = usePromptStore();
  const { agents } = useAgentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

  const agentPrompts = agentId ? getPromptsForAgent(agentId) : [];
  const globalPrompts = getGlobalPrompts();
  const allPrompts = agentId ? [...agentPrompts, ...globalPrompts] : globalPrompts;

  const filteredPrompts = allPrompts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'task_planning', 'code_generation', 'review', 'debugging', 'documentation', 'other'];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-700 p-4 bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-gray-100">
              {agentId ? `Prompts for ${agents.find(a => a.id === agentId)?.name || 'Agent'}` : 'Prompt Library'}
            </h2>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white"
          >
            <Plus className="w-4 h-4" />
            New Prompt
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts..."
              className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-gray-200 focus:outline-none focus:border-blue-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Prompts List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredPrompts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No prompts found</p>
            {searchQuery && <p className="text-sm mt-2">Try a different search term</p>}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPrompts.map(prompt => (
              <div
                key={prompt.id}
                className="p-4 bg-gray-800 rounded border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-200">{prompt.name}</h3>
                      <span className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-400">
                        {prompt.category.replace('_', ' ')}
                      </span>
                      {prompt.usageCount > 0 && (
                        <span className="text-xs text-gray-500">
                          Used {prompt.usageCount} times
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{prompt.description}</p>
                    {prompt.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {prompt.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-400">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 ml-4">
                    {onSelect && (
                      <button
                        onClick={() => onSelect(prompt)}
                        className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-blue-400"
                        title="Select prompt"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setEditingPrompt(prompt)}
                      className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-yellow-400"
                      title="Edit prompt"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this prompt?')) {
                          deletePrompt(prompt.id);
                        }
                      }}
                      className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-red-400"
                      title="Delete prompt"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-gray-900 rounded border border-gray-700">
                  <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
                    {prompt.content}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingPrompt) && (
        <PromptEditor
          prompt={editingPrompt}
          agentId={agentId}
          onClose={() => {
            setShowCreateModal(false);
            setEditingPrompt(null);
          }}
          onSave={(promptData) => {
            if (editingPrompt) {
              updatePrompt(editingPrompt.id, promptData);
            } else {
              createPrompt({ ...promptData, agentId });
            }
            setShowCreateModal(false);
            setEditingPrompt(null);
          }}
        />
      )}
    </div>
  );
}

interface PromptEditorProps {
  prompt: Prompt | null;
  agentId?: string;
  onClose: () => void;
  onSave: (prompt: Partial<Prompt>) => void;
}

function PromptEditor({ prompt, agentId, onSave, onClose }: PromptEditorProps) {
  const [formData, setFormData] = useState({
    name: prompt?.name || '',
    description: prompt?.description || '',
    content: prompt?.content || '',
    category: prompt?.category || 'other' as Prompt['category'],
    tags: prompt?.tags.join(', ') || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div
        className="bg-gray-800 rounded-lg w-full max-w-2xl mx-4 border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100">
            {prompt ? 'Edit Prompt' : 'Create Prompt'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-200 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Prompt['category'] })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-200 focus:outline-none focus:border-blue-500"
              >
                <option value="task_planning">Task Planning</option>
                <option value="code_generation">Code Generation</option>
                <option value="review">Review</option>
                <option value="debugging">Debugging</option>
                <option value="documentation">Documentation</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-200 focus:outline-none focus:border-blue-500"
                placeholder="review, quality, security"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Content *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-200 font-mono text-sm focus:outline-none focus:border-blue-500"
              rows={10}
              required
              placeholder="Enter prompt content..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white"
            >
              {prompt ? 'Update' : 'Create'} Prompt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

