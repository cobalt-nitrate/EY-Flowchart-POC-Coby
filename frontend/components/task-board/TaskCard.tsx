'use client';

import { Task } from '@/types/task';
import { useTaskStore } from '@/store/taskStore';
import { Clock, User } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const priorityColors = {
    low: 'bg-gray-600',
    medium: 'bg-blue-600',
    high: 'bg-orange-600',
    critical: 'bg-red-600',
  };

  const handleClick = () => {
    onClick(task);
  };

  return (
    <div
      onClick={handleClick}
      className="p-3 bg-gray-700 rounded border border-gray-600 hover:border-blue-500 cursor-pointer transition-colors"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-medium text-gray-100 flex-1">{task.title}</h4>
        <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`} />
      </div>
      <p className="text-xs text-gray-400 mb-3 line-clamp-2">{task.description}</p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {new Date(task.createdAt).toLocaleDateString()}
        </div>
        {task.assignedAgents.length > 0 && (
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {task.assignedAgents.length} agent{task.assignedAgents.length > 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}

