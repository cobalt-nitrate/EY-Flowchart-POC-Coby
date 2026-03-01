'use client';

import { useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { FileTree } from '@/components/shared/FileTree';
import { Folder, File, GitBranch, Package, TestTube } from 'lucide-react';

export default function LeftPane() {
  const [selectedSection, setSelectedSection] = useState<'files' | 'artifacts' | 'diffs' | 'tests'>('files');

  return (
    <div className="h-full flex flex-col">
      {/* Section Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setSelectedSection('files')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
            selectedSection === 'files'
              ? 'bg-gray-700 text-gray-100 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
          }`}
        >
          <div className="flex items-center justify-center gap-1">
            <Folder className="w-3 h-3" />
            Files
          </div>
        </button>
        <button
          onClick={() => setSelectedSection('artifacts')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
            selectedSection === 'artifacts'
              ? 'bg-gray-700 text-gray-100 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
          }`}
        >
          <div className="flex items-center justify-center gap-1">
            <Package className="w-3 h-3" />
            Artifacts
          </div>
        </button>
        <button
          onClick={() => setSelectedSection('diffs')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
            selectedSection === 'diffs'
              ? 'bg-gray-700 text-gray-100 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
          }`}
        >
          <div className="flex items-center justify-center gap-1">
            <GitBranch className="w-3 h-3" />
            Diffs
          </div>
        </button>
        <button
          onClick={() => setSelectedSection('tests')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
            selectedSection === 'tests'
              ? 'bg-gray-700 text-gray-100 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
          }`}
        >
          <div className="flex items-center justify-center gap-1">
            <TestTube className="w-3 h-3" />
            Tests
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {selectedSection === 'files' && (
          <div className="h-full">
            <FileTree />
          </div>
        )}
        {selectedSection === 'artifacts' && (
          <div className="p-4 text-sm text-gray-400">
            <p>Generated files will appear here</p>
          </div>
        )}
        {selectedSection === 'diffs' && (
          <div className="p-4 text-sm text-gray-400">
            <p>Code diffs will appear here</p>
          </div>
        )}
        {selectedSection === 'tests' && (
          <div className="p-4 text-sm text-gray-400">
            <p>Test outputs will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}

