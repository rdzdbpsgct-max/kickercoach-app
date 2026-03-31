import { z } from "zod";
import { CategorySchema } from "./coachCard";

export const SkillRatingEntrySchema = z.object({
  category: CategorySchema,
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export const TechniqueRatingSchema = z.object({
  techniqueId: z.string(),
  rating: z.number().int().min(1).max(5),
  successRate: z.number().min(0).max(100).optional(),
  comment: z.string().optional(),
});

export const EvaluationTypeSchema = z.enum(["session", "match", "general"]);

export const EvaluationSchema = z.object({
  id: z.string(),
  playerId: z.string(),
  sessionId: z.string().optional(),
  matchId: z.string().optional(),
  type: EvaluationTypeSchema.optional(),
  date: z.string(),
  skillRatings: z.array(SkillRatingEntrySchema),
  techniqueRatings: z.array(TechniqueRatingSchema).optional(),
  overallRating: z.number().int().min(1).max(5).optional(),
  notes: z.string(),
});
