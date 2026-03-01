'use client';

import { useTaskStore } from '@/store/taskStore';
import { TaskCard } from './TaskCard';
import { CreateTaskModal } from './CreateTaskModal';
import { TaskDetailModal } from './TaskDetailModal';
import { LoadingState } from '@/components/shared/LoadingState';
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Task, TaskStatus } from '@/types/task';

export function TaskBoard() {
  const { tasks, fetchTasks, isLoading, selectTask } = useTaskStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (isLoading && tasks.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingState message="Loading tasks..." />
      </div>
    );
  }

  const columns: { status: TaskStatus; label: string }[] = [
    { status: 'backlog', label: 'Backlog' },
    { status: 'in_progress', label: 'In Progress' },
    { status: 'review', label: 'Review (HITL)' },
    { status: 'done', label: 'Done' },
  ];

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-700 p-4 flex items-center justify-between bg-gray-800">
        <h1 className="text-xl font-semibold text-gray-100">Task Board</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      </div>

      {/* Kanban Columns */}
      <div className="flex-1 overflow-x-auto p-4">
        <div className="flex gap-4 h-full min-w-max">
          {columns.map(column => (
            <div
              key={column.status}
              className="flex flex-col w-80 bg-gray-800 rounded-lg border border-gray-700"
            >
              {/* Column Header */}
              <div className="p-3 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-200">
                    {column.label}
                  </h3>
                  <span className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-400">
                    {getTasksByStatus(column.status).length}
                  </span>
                </div>
              </div>

              {/* Tasks */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {getTasksByStatus(column.status).map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={(task) => {
                      selectTask(task);
                      setSelectedTask(task);
                    }}
                  />
                ))}
                {getTasksByStatus(column.status).length === 0 && (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCreateModal && (
        <CreateTaskModal onClose={() => setShowCreateModal(false)} />
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}

