import type { StateCreator } from "zustand";
import type { Session } from "../../domain/models/Session";
import type { AppState } from "../types";
import { SessionSchema } from "../../domain/schemas/session";
import { validateOrWarn } from "../../utils/validate";

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
  addSession: (session) => {
    const validated = validateOrWarn(session, SessionSchema, "addSession");
    set((s) => ({ sessions: [...s.sessions, validated] }));
  },
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
