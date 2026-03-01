'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useTaskStore } from '@/store/taskStore';
import WorkspaceLayout from '@/components/workspace/WorkspaceLayout';
import { TaskDetailView } from '@/components/task-board/TaskDetailView';
import { LoadingState } from '@/components/shared/LoadingState';

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params.id as string;
  const { fetchTask, selectedTask, isLoading } = useTaskStore();

  useEffect(() => {
    if (taskId) {
      fetchTask(taskId);
    }
  }, [taskId, fetchTask]);

  return (
    <WorkspaceLayout>
      {isLoading ? (
        <LoadingState message="Loading task..." />
      ) : selectedTask ? (
        <TaskDetailView task={selectedTask} />
      ) : (
        <div className="h-full flex items-center justify-center text-gray-400">
          Task not found
        </div>
      )}
    </WorkspaceLayout>
  );
}

