import { z } from "zod";

export const TechniqueStatusSchema = z.enum([
  "not_started",
  "learning",
  "developing",
  "proficient",
  "mastered",
]);

export const PlayerTechniqueSchema = z.object({
  id: z.string(),
  playerId: z.string(),
  techniqueId: z.string(),
  status: TechniqueStatusSchema,
  currentSuccessRate: z.number().min(0).max(100).optional(),
  lastPracticedAt: z.string().optional(),
  notes: z.string().optional(),
});
