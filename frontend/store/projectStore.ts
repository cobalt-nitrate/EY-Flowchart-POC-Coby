import { create } from 'zustand';
import { Project } from '@/types/project';

interface ProjectStore {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  setCurrentProject: (project: Project | null) => void;
  createProject: (project: Partial<Project>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  addFile: (projectId: string, file: Partial<Project['files'][0]>) => void;
  deleteFile: (projectId: string, fileId: string) => void;
}

const mockProjects: Project[] = [
  {
    id: 'project-1',
    name: 'Agentic Workbench',
    description: 'Main workspace project',
    type: 'web',
    repository: 'https://github.com/example/agentic-workbench',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    files: [
      {
        id: 'file-1',
        path: '/src',
        name: 'src',
        type: 'folder',
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      },
    ],
  },
];

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: mockProjects,
  currentProject: mockProjects[0] || null,
  isLoading: false,
  error: null,

  setCurrentProject: (project: Project | null) => {
    set({ currentProject: project });
  },

  createProject: (projectData: Partial<Project>) => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: projectData.name || 'Untitled Project',
      description: projectData.description || '',
      type: projectData.type || 'web',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      files: [],
      ...projectData,
    };
    set(state => ({
      projects: [...state.projects, newProject],
      currentProject: newProject,
    }));
    return newProject;
  },

  updateProject: (id: string, updates: Partial<Project>) => {
    set(state => ({
      projects: state.projects.map(p =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
      currentProject: state.currentProject?.id === id
        ? { ...state.currentProject, ...updates, updatedAt: new Date().toISOString() }
        : state.currentProject,
    }));
  },

  addFile: (projectId: string, fileData: Partial<Project['files'][0]>) => {
    const newFile: Project['files'][0] = {
      id: `file-${Date.now()}`,
      path: fileData.path || '/',
      name: fileData.name || 'untitled',
      type: fileData.type || 'file',
      content: fileData.content || '',
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      ...fileData,
    };
    set(state => ({
      projects: state.projects.map(p =>
        p.id === projectId
          ? { ...p, files: [...p.files, newFile] }
          : p
      ),
      currentProject: state.currentProject?.id === projectId
        ? { ...state.currentProject, files: [...state.currentProject.files, newFile] }
        : state.currentProject,
    }));
  },

  deleteFile: (projectId: string, fileId: string) => {
    set(state => ({
      projects: state.projects.map(p =>
        p.id === projectId
          ? { ...p, files: p.files.filter(f => f.id !== fileId) }
          : p
      ),
      currentProject: state.currentProject?.id === projectId
        ? { ...state.currentProject, files: state.currentProject.files.filter(f => f.id !== fileId) }
        : state.currentProject,
    }));
  },
}));

