import { create } from 'zustand';

interface WorkspaceState {
  currentWorkspace: string;
  activeBranch: string;
  leftPaneWidth: number;
  rightPaneWidth: number;
  bottomPanelHeight: number;
  bottomPanelTab: 'timeline' | 'logs' | 'reviews' | 'sessions';
  setWorkspace: (workspace: string) => void;
  setBranch: (branch: string) => void;
  setLeftPaneWidth: (width: number) => void;
  setRightPaneWidth: (width: number) => void;
  setBottomPanelHeight: (height: number) => void;
  setBottomPanelTab: (tab: 'timeline' | 'logs' | 'reviews' | 'sessions') => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  currentWorkspace: 'default',
  activeBranch: 'main',
  leftPaneWidth: 250,
  rightPaneWidth: 350,
  bottomPanelHeight: 200,
  bottomPanelTab: 'timeline',

  setWorkspace: (workspace: string) => set({ currentWorkspace: workspace }),
  setBranch: (branch: string) => set({ activeBranch: branch }),
  setLeftPaneWidth: (width: number) => set({ leftPaneWidth: width }),
  setRightPaneWidth: (width: number) => set({ rightPaneWidth: width }),
  setBottomPanelHeight: (height: number) => set({ bottomPanelHeight: height }),
  setBottomPanelTab: (tab: 'timeline' | 'logs' | 'reviews' | 'sessions') => set({ bottomPanelTab: tab }),
}));

