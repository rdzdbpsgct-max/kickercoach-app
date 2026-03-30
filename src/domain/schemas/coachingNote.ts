import { z } from "zod";

export const NoteCategory = z.enum(["tactical", "technical", "mental", "communication"]);

export const CoachingNoteSchema = z.object({
  id: z.string(),
  playerId: z.string().optional(),
  sessionId: z.string().optional(),
  matchPlanId: z.string().optional(),
  date: z.string(),
  category: NoteCategory,
  text: z.string().min(1),
});
