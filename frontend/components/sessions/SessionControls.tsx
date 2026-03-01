'use client';

import { useState } from 'react';
import { useSessionStore } from '@/store/sessionStore';
import { Session, SessionMode } from '@/types/session';
import { Eye, Hand, Power, PowerOff } from 'lucide-react';

interface SessionControlsProps {
  session: Session;
}

export function SessionControls({ session }: SessionControlsProps) {
  const { setSessionMode, attachSession, detachSession, sendCommand } = useSessionStore();
  const [commandInput, setCommandInput] = useState('');
  const userId = 'user-1'; // In a real app, this would come from auth

  const isAttached = session.attachedUsers.includes(userId);
  const isGuideMode = session.mode === 'guide';

  const handleAttach = () => {
    attachSession(session.id, userId);
  };

  const handleDetach = () => {
    detachSession(session.id, userId);
  };

  const handleModeToggle = () => {
    const newMode: SessionMode = session.mode === 'observe' ? 'guide' : 'observe';
    setSessionMode(session.id, newMode);
  };

  const handleSendCommand = () => {
    if (!commandInput.trim() || !isGuideMode) return;
    sendCommand(session.id, commandInput);
    setCommandInput('');
  };

  return (
    <div className="flex items-center gap-2">
      {/* Mode Toggle */}
      <button
        onClick={handleModeToggle}
        disabled={!isAttached}
        className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
          isGuideMode
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        } ${!isAttached ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isGuideMode ? 'Guide Mode - You can type commands' : 'Observe Mode - Read only'}
      >
        {isGuideMode ? <Hand className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        {isGuideMode ? 'Guide' : 'Observe'}
      </button>

      {/* Attach/Detach */}
      {!isAttached ? (
        <button
          onClick={handleAttach}
          className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-sm text-white"
        >
          <Power className="w-4 h-4" />
          Attach
        </button>
      ) : (
        <button
          onClick={handleDetach}
          className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded text-sm text-white"
        >
          <PowerOff className="w-4 h-4" />
          Detach
        </button>
      )}

      {/* Command Input (only in guide mode) */}
      {isAttached && isGuideMode && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendCommand()}
            placeholder="Type command..."
            className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 w-64"
          />
          <button
            onClick={handleSendCommand}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}

