import { z } from "zod";

export const NoteCategory = z.enum(["tactical", "technical", "mental", "communication"]);

export const NotePrioritySchema = z.enum(["low", "medium", "high"]);

export const CoachingNoteSchema = z.object({
  id: z.string(),
  playerId: z.string().optional(),
  sessionId: z.string().optional(),
  matchPlanId: z.string().optional(),
  date: z.string(),
  category: NoteCategory,
  text: z.string().min(1),
  priority: NotePrioritySchema.optional(),
  actionItems: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  resolved: z.boolean().optional(),
});
