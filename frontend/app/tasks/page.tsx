import WorkspaceLayout from '@/components/workspace/WorkspaceLayout';
import { TaskBoard } from '@/components/task-board/TaskBoard';

export default function TasksPage() {
  return (
    <WorkspaceLayout>
      <TaskBoard />
    </WorkspaceLayout>
  );
}

