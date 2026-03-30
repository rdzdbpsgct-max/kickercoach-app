import { z } from "zod";
import { CategorySchema } from "./coachCard";

export const SkillRatingEntrySchema = z.object({
  category: CategorySchema,
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export const EvaluationSchema = z.object({
  id: z.string(),
  playerId: z.string(),
  sessionId: z.string().optional(),
  date: z.string(),
  skillRatings: z.array(SkillRatingEntrySchema),
  notes: z.string(),
});
