import WorkspaceLayout from '@/components/workspace/WorkspaceLayout';
import { AgentRegistry } from '@/components/agents/AgentRegistry';

export default function AgentsPage() {
  return (
    <WorkspaceLayout>
      <AgentRegistry />
    </WorkspaceLayout>
  );
}

