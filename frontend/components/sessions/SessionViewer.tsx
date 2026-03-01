'use client';

import { useEffect, useRef } from 'react';
import { useSessionStore } from '@/store/sessionStore';
import { TerminalView } from './TerminalView';
import { SessionControls } from './SessionControls';
import { Session } from '@/types/session';

interface SessionViewerProps {
  session: Session;
}

export function SessionViewer({ session }: SessionViewerProps) {
  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Session Header */}
      <div className="border-b border-gray-700 p-3 bg-gray-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-200">Session: {session.id}</h3>
          <p className="text-xs text-gray-400">Task: {session.taskId}</p>
        </div>
        <SessionControls session={session} />
      </div>

      {/* Terminal View */}
      <div className="flex-1 overflow-hidden">
        <TerminalView session={session} />
      </div>
    </div>
  );
}

