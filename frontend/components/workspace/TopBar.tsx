'use client';

import { useWorkspaceStore } from '@/store/workspaceStore';
import { useTaskStore } from '@/store/taskStore';
import { useProjectStore } from '@/store/projectStore';
import { CreateProjectModal } from '@/components/projects/CreateProjectModal';
import { ChevronDown, GitBranch, CheckCircle, XCircle, Clock, LayoutDashboard, Bot, FileText, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function TopBar() {
  const { currentWorkspace, activeBranch, setWorkspace, setBranch } = useWorkspaceStore();
  const { selectedTask } = useTaskStore();
  const { currentProject, projects, setCurrentProject } = useProjectStore();
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProjectDropdown(false);
      }
    };
    if (showProjectDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showProjectDropdown]);

  return (
    <div className="h-12 border-b border-gray-700 bg-gray-800 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        {/* Navigation */}
        <div className="flex items-center gap-2 border-r border-gray-700 pr-4">
          <Link
            href="/"
            className={`p-2 rounded hover:bg-gray-700 ${pathname === '/' ? 'bg-gray-700' : ''}`}
            title="Workspace"
          >
            <LayoutDashboard className="w-4 h-4 text-gray-300" />
          </Link>
          <Link
            href="/tasks"
            className={`p-2 rounded hover:bg-gray-700 ${pathname?.startsWith('/tasks') ? 'bg-gray-700' : ''}`}
            title="Tasks"
          >
            <FileText className="w-4 h-4 text-gray-300" />
          </Link>
          <Link
            href="/agents"
            className={`p-2 rounded hover:bg-gray-700 ${pathname?.startsWith('/agents') ? 'bg-gray-700' : ''}`}
            title="Agents"
          >
            <Bot className="w-4 h-4 text-gray-300" />
          </Link>
        </div>

        {/* Project Selector */}
        <div className="flex items-center gap-2 relative">
          <span className="text-sm font-medium text-gray-300">Project</span>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProjectDropdown(!showProjectDropdown)}
              className="flex items-center gap-1 px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 cursor-pointer"
            >
              <span className="text-sm text-gray-200">{currentProject?.name || 'No Project'}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {showProjectDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg z-50 min-w-[200px]">
                <div className="p-2 border-b border-gray-700">
                  <button
                    onClick={() => {
                      setShowCreateProject(true);
                      setShowProjectDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-300 hover:bg-gray-700 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    Create Project
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {projects.map(project => (
                    <button
                      key={project.id}
                      onClick={() => {
                        setCurrentProject(project);
                        setShowProjectDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-700 ${
                        currentProject?.id === project.id ? 'bg-gray-700 text-blue-400' : 'text-gray-300'
                      }`}
                    >
                      {project.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Active Task */}
        {selectedTask && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-300">Active Task</span>
            <Link
              href={`/tasks/${selectedTask.id}`}
              className="flex items-center gap-1 px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 cursor-pointer"
            >
              <span className="text-sm text-gray-200">{selectedTask.title}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </Link>
          </div>
        )}

        {/* Branch */}
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-gray-400" />
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 cursor-pointer">
            <span className="text-sm text-gray-200">{activeBranch}</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-400">Running</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-xs text-gray-400">System OK</span>
        </div>
      </div>

      {showCreateProject && (
        <CreateProjectModal onClose={() => setShowCreateProject(false)} />
      )}
    </div>
  );
}
