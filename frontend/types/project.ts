export interface Project {
  id: string;
  name: string;
  description: string;
  type: 'web' | 'api' | 'mobile' | 'desktop' | 'other';
  repository?: string;
  createdAt: string;
  updatedAt: string;
  files: ProjectFile[];
}

export interface ProjectFile {
  id: string;
  path: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  size?: number;
  createdAt: string;
  modifiedAt: string;
  createdBy?: string; // Agent ID or 'human'
}

