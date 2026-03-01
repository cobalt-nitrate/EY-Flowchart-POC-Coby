'use client';

import { useEffect } from 'react';
import { Task } from '@/types/task';
import { TaskDetailView } from './TaskDetailView';
import { X } from 'lucide-react';

interface TaskDetailModalProps {
  task: Task | null;
  onClose: () => void;
}

export function TaskDetailModal({ task, onClose }: TaskDetailModalProps) {
  // Handle Esc key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!task) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-gray-900 rounded-lg border border-gray-700 w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="flex items-center justify-end p-2 border-b border-gray-700">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-gray-200 transition-colors"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task Detail Content */}
        <div className="flex-1 overflow-hidden">
          <TaskDetailView task={task} />
        </div>
      </div>
    </div>
  );
}

