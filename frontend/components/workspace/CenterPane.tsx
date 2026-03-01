'use client';

import { useState } from 'react';
import { CodeEditor } from '@/components/shared/CodeEditor';
import { X, FileText, Globe } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  type: 'code' | 'docs' | 'browser' | 'diff';
  content?: string;
}

export default function CenterPane() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 'welcome', label: 'Welcome', type: 'docs' },
  ]);
  const [activeTab, setActiveTab] = useState<string>('welcome');

  const closeTab = (tabId: string) => {
    setTabs(tabs.filter(t => t.id !== tabId));
    if (activeTab === tabId && tabs.length > 1) {
      const index = tabs.findIndex(t => t.id === tabId);
      setActiveTab(tabs[index - 1]?.id || tabs[index + 1]?.id || '');
    }
  };

  const activeTabData = tabs.find(t => t.id === activeTab);

  return (
    <div className="h-full flex flex-col">
      {/* Tab Bar */}
      {tabs.length > 0 && (
        <div className="flex border-b border-gray-700 bg-gray-800 overflow-x-auto">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`flex items-center gap-2 px-4 py-2 border-r border-gray-700 cursor-pointer transition-colors ${
                activeTab === tab.id
                  ? 'bg-gray-900 text-gray-100'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.type === 'code' && <FileText className="w-4 h-4" />}
              {tab.type === 'docs' && <FileText className="w-4 h-4" />}
              {tab.type === 'browser' && <Globe className="w-4 h-4" />}
              <span className="text-sm whitespace-nowrap">{tab.label}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className="ml-1 hover:bg-gray-700 rounded p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Editor Area */}
      <div className="flex-1 overflow-hidden">
        {activeTabData && (
          <>
            {activeTabData.type === 'code' && (
              <CodeEditor
                value={activeTabData.content || ''}
                language="typescript"
                onChange={(value) => {
                  setTabs(tabs.map(t => 
                    t.id === activeTab ? { ...t, content: value } : t
                  ));
                }}
              />
            )}
            {activeTabData.type === 'docs' && (
              <div className="h-full p-8 overflow-y-auto">
                <div className="max-w-3xl mx-auto prose prose-invert">
                  <h1 className="text-3xl font-bold text-gray-100 mb-4">Agentic Workbench</h1>
                  <p className="text-gray-300 mb-4">
                    Welcome to the Agentic Workbench. This is a collaborative environment where humans and AI agents work together on tasks.
                  </p>
                  <h2 className="text-2xl font-semibold text-gray-100 mt-8 mb-4">Getting Started</h2>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>Create a task from the Task Board</li>
                    <li>Spawn an agent to work on the task</li>
                    <li>Monitor progress in real-time</li>
                    <li>Review and approve changes</li>
                  </ul>
                </div>
              </div>
            )}
            {activeTabData.type === 'browser' && (
              <div className="h-full p-4 bg-white">
                <div className="h-full border border-gray-300 rounded bg-white">
                  <div className="p-2 border-b border-gray-300 bg-gray-100 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="flex-1 mx-4 px-3 py-1 bg-white rounded text-sm text-gray-600">
                      https://example.com
                    </div>
                  </div>
                  <div className="p-8 text-gray-600">
                    Browser preview will appear here
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

