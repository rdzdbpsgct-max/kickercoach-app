import { z } from "zod";
import { CategorySchema } from "./coachCard";

export const MoodSchema = z
  .enum(["great", "good", "ok", "tired", "frustrated"])
  .optional();

export const SessionSchema = z.object({
  id: z.string(),
  name: z.string(),
  date: z.string(),
  drillIds: z.array(z.string()),
  notes: z.string(),
  totalDuration: z.number(),
  playerIds: z.array(z.string()).default([]),
  focusAreas: z.array(CategorySchema).default([]),
  rating: z.number().min(1).max(5).optional(),
  mood: MoodSchema,
});
