export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'done';
export type TaskType = 'backend_fix' | 'infra_change' | 'refactor' | 'feature' | 'bug' | 'docs';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  assignedAgents: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  artifacts: Artifact[];
  timeline: TimelineEvent[];
  reviews: Review[];
}

export interface Artifact {
  id: string;
  type: 'file' | 'diff' | 'log' | 'test_output';
  path: string;
  content?: string;
  generatedBy?: string;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'agent_spawn' | 'file_change' | 'human_edit' | 'command' | 'status_change' | 'review';
  actor: 'agent' | 'human';
  actorId?: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface Review {
  id: string;
  taskId: string;
  status: 'pending' | 'approved' | 'changes_requested' | 'blocked';
  reviewerId?: string;
  summary?: string;
  comments: ReviewComment[];
  diffs: CodeDiff[];
  testResults?: TestResults;
  createdAt: string;
  resolvedAt?: string;
}

export interface ReviewComment {
  id: string;
  text: string;
  authorId: string;
  createdAt: string;
}

export interface CodeDiff {
  id: string;
  filePath: string;
  oldContent: string;
  newContent: string;
  hunks: DiffHunk[];
}

export interface DiffHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: DiffLine[];
}

export interface DiffLine {
  type: 'normal' | 'add' | 'delete' | 'context';
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

export interface TestResults {
  passed: number;
  failed: number;
  total: number;
  details: TestDetail[];
}

export interface TestDetail {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  message?: string;
  duration: number;
}

