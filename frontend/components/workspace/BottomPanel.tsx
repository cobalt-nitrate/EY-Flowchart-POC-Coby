'use client';

import { useState } from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { Timeline } from '@/components/shared/Timeline';
import { Clock, FileText, MessageSquare, Terminal } from 'lucide-react';

export default function BottomPanel() {
  const { bottomPanelTab, setBottomPanelTab } = useWorkspaceStore();

  return (
    <div className="h-full flex flex-col">
      {/* Tab Bar */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setBottomPanelTab('timeline')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            bottomPanelTab === 'timeline'
              ? 'bg-gray-700 text-gray-100 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
          }`}
        >
          <Clock className="w-4 h-4" />
          Timeline
        </button>
        <button
          onClick={() => setBottomPanelTab('logs')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            bottomPanelTab === 'logs'
              ? 'bg-gray-700 text-gray-100 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
          }`}
        >
          <FileText className="w-4 h-4" />
          Logs
        </button>
        <button
          onClick={() => setBottomPanelTab('reviews')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            bottomPanelTab === 'reviews'
              ? 'bg-gray-700 text-gray-100 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Reviews
        </button>
        <button
          onClick={() => setBottomPanelTab('sessions')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            bottomPanelTab === 'sessions'
              ? 'bg-gray-700 text-gray-100 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
          }`}
        >
          <Terminal className="w-4 h-4" />
          Sessions
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {bottomPanelTab === 'timeline' && <Timeline />}
        {bottomPanelTab === 'logs' && (
          <div className="p-4 font-mono text-xs text-gray-400">
            <div>[2024-01-30 10:00:00] System initialized</div>
            <div>[2024-01-30 10:00:05] Agent "CodeBot" spawned</div>
            <div>[2024-01-30 10:00:10] Task "Fix authentication bug" assigned</div>
          </div>
        )}
        {bottomPanelTab === 'reviews' && (
          <div className="p-4 text-sm text-gray-400">
            <p>Pending reviews will appear here</p>
          </div>
        )}
        {bottomPanelTab === 'sessions' && (
          <div className="p-4 text-sm text-gray-400">
            <p>Active sessions will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}

