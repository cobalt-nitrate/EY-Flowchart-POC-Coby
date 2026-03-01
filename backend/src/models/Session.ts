export type SessionMode = 'observe' | 'guide';
export type SessionStatus = 'active' | 'paused' | 'completed';

export interface Session {
  id: string;
  taskId: string;
  agentId: string;
  status: SessionStatus;
  mode: SessionMode;
  attachedUsers: string[];
  terminal: TerminalState;
  fileSystem: FileSystemState;
  browser?: BrowserState;
  createdAt: string;
  updatedAt: string;
}

export interface TerminalState {
  history: TerminalCommand[];
  currentOutput: string;
  isExecuting: boolean;
}

export interface TerminalCommand {
  id: string;
  command: string;
  output: string;
  executedBy: 'agent' | 'human';
  executorId: string;
  timestamp: string;
  exitCode?: number;
}

export interface FileSystemState {
  currentDirectory: string;
  files: SessionFile[];
  changes: FileChange[];
}

export interface SessionFile {
  path: string;
  content: string;
  modifiedAt: string;
  modifiedBy: 'agent' | 'human';
  modifiedById: string;
}

export interface FileChange {
  id: string;
  filePath: string;
  type: 'created' | 'modified' | 'deleted';
  timestamp: string;
  actor: 'agent' | 'human';
  actorId: string;
}

export interface BrowserState {
  url: string;
  title: string;
  screenshots: BrowserScreenshot[];
}

export interface BrowserScreenshot {
  id: string;
  url: string;
  timestamp: string;
  dataUrl: string;
}

