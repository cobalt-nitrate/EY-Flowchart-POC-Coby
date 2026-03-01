import { Session } from '../models/Session';
import { getMockSessions } from '../data/mockData';

let sessions: Session[] = getMockSessions();

export const sessionService = {
  getAll: (): Session[] => {
    return sessions;
  },

  getById: (id: string): Session | undefined => {
    return sessions.find(s => s.id === id);
  },

  attach: (sessionId: string, userId: string): Session | undefined => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return undefined;

    if (!session.attachedUsers.includes(userId)) {
      session.attachedUsers.push(userId);
    }
    return session;
  },

  detach: (sessionId: string, userId: string): Session | undefined => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return undefined;

    session.attachedUsers = session.attachedUsers.filter(id => id !== userId);
    return session;
  },

  setMode: (sessionId: string, mode: 'observe' | 'guide'): Session | undefined => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return undefined;

    session.mode = mode;
    session.updatedAt = new Date().toISOString();
    return session;
  },

  sendCommand: (sessionId: string, command: string): { success: boolean; output: string } | undefined => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return undefined;

    // Mock command execution
    const commandEntry = {
      id: `cmd-${Date.now()}`,
      command,
      output: `Mock output for: ${command}\n[Exit code: 0]`,
      executedBy: 'human' as const,
      executorId: 'user-1',
      timestamp: new Date().toISOString(),
      exitCode: 0,
    };

    session.terminal.history.push(commandEntry);
    session.terminal.currentOutput = commandEntry.output;
    session.updatedAt = new Date().toISOString();

    return {
      success: true,
      output: commandEntry.output,
    };
  },
};

