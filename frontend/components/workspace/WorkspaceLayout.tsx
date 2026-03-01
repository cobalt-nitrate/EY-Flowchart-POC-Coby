'use client';

import { useWorkspaceStore } from '@/store/workspaceStore';
import TopBar from './TopBar';
import LeftPane from './LeftPane';
import CenterPane from './CenterPane';
import RightPane from './RightPane';
import BottomPanel from './BottomPanel';

export default function WorkspaceLayout({ children }: { children?: React.ReactNode }) {
  const { leftPaneWidth, rightPaneWidth, bottomPanelHeight } = useWorkspaceStore();

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Top Bar */}
      <TopBar />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden" style={{ height: `calc(100vh - 48px - ${bottomPanelHeight}px)` }}>
        {/* Left Pane */}
        <div 
          className="border-r border-gray-700 bg-gray-800 overflow-y-auto"
          style={{ width: `${leftPaneWidth}px`, minWidth: '200px', maxWidth: '500px' }}
        >
          <LeftPane />
        </div>

        {/* Center Pane */}
        <div className="flex-1 overflow-hidden bg-gray-900">
          {children || <CenterPane />}
        </div>

        {/* Right Pane */}
        <div 
          className="border-l border-gray-700 bg-gray-800 overflow-y-auto"
          style={{ width: `${rightPaneWidth}px`, minWidth: '250px', maxWidth: '600px' }}
        >
          <RightPane />
        </div>
      </div>

      {/* Bottom Panel */}
      <div 
        className="border-t border-gray-700 bg-gray-800 overflow-hidden"
        style={{ height: `${bottomPanelHeight}px`, minHeight: '150px', maxHeight: '400px' }}
      >
        <BottomPanel />
      </div>
    </div>
  );
}

