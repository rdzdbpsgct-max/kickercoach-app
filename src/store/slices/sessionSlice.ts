import type { StateCreator } from "zustand";
import type { Session } from "../../domain/models/Session";
import type { AppState } from "../types";

export interface SessionSlice {
  sessions: Session[];
  addSession: (session: Session) => void;
  updateSession: (id: string, updates: Partial<Session>) => void;
  deleteSession: (id: string) => void;
}

export const createSessionSlice: StateCreator<
  AppState,
  [],
  [],
  SessionSlice
> = (set) => ({
  sessions: [],
  addSession: (session) =>
    set((s) => ({ sessions: [...s.sessions, session] })),
  updateSession: (id, updates) =>
    set((s) => ({
      sessions: s.sessions.map((ses) =>
        ses.id === id ? { ...ses, ...updates } : ses,
      ),
    })),
  deleteSession: (id) =>
    set((s) => ({
      sessions: s.sessions.filter((ses) => ses.id !== id),
      evaluations: s.evaluations.filter((e) => e.sessionId !== id),
      coachingNotes: s.coachingNotes.filter((n) => n.sessionId !== id),
    })),
});
