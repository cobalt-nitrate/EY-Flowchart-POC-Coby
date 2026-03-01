import { create } from 'zustand';
import { Session } from '@/types/session';
import { sessionAPI } from '@/lib/api';

interface SessionStore {
  sessions: Session[];
  activeSession: Session | null;
  isLoading: boolean;
  error: string | null;
  fetchSessions: () => Promise<void>;
  fetchSession: (id: string) => Promise<void>;
  attachSession: (sessionId: string, userId: string) => Promise<void>;
  detachSession: (sessionId: string, userId: string) => Promise<void>;
  setSessionMode: (sessionId: string, mode: 'observe' | 'guide') => Promise<void>;
  sendCommand: (sessionId: string, command: string) => Promise<void>;
  selectSession: (session: Session | null) => void;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  sessions: [],
  activeSession: null,
  isLoading: false,
  error: null,

  fetchSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const sessions = await sessionAPI.getAll();
      set({ sessions, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchSession: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const session = await sessionAPI.getById(id);
      set({ activeSession: session, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  attachSession: async (sessionId: string, userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const session = await sessionAPI.attach(sessionId, userId);
      set(state => ({
        sessions: state.sessions.map(s => s.id === sessionId ? session : s),
        activeSession: session,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  detachSession: async (sessionId: string, userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const session = await sessionAPI.detach(sessionId, userId);
      set(state => ({
        sessions: state.sessions.map(s => s.id === sessionId ? session : s),
        activeSession: state.activeSession?.id === sessionId ? null : state.activeSession,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  setSessionMode: async (sessionId: string, mode: 'observe' | 'guide') => {
    set({ isLoading: true, error: null });
    try {
      const session = await sessionAPI.setMode(sessionId, mode);
      set(state => ({
        sessions: state.sessions.map(s => s.id === sessionId ? session : s),
        activeSession: state.activeSession?.id === sessionId ? session : state.activeSession,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  sendCommand: async (sessionId: string, command: string) => {
    set({ isLoading: true, error: null });
    try {
      await sessionAPI.sendCommand(sessionId, command);
      await get().fetchSession(sessionId);
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  selectSession: (session: Session | null) => {
    set({ activeSession: session });
  },
}));

