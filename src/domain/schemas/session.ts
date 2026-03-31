import { z } from "zod";
import { CategorySchema } from "./coachCard";

export const MoodSchema = z
  .enum(["great", "good", "ok", "tired", "frustrated"])
  .optional();

export const DrillResultSchema = z.object({
  drillId: z.string(),
  completed: z.boolean(),
  blocksCompleted: z.number().int().min(0),
  successRate: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
});

export const SessionRetrospectiveSchema = z.object({
  whatWentWell: z.string(),
  whatToImprove: z.string(),
  focusNextTime: z.string(),
});

export const SessionSchema = z.object({
  id: z.string(),
  name: z.string(),
  date: z.string(),
  drillIds: z.array(z.string()),
  drillResults: z.array(DrillResultSchema).optional(),
  notes: z.string(),
  totalDuration: z.number(),
  playerIds: z.array(z.string()).default([]),
  focusAreas: z.array(CategorySchema).default([]),
  rating: z.number().min(1).max(5).optional(),
  mood: MoodSchema,
  retrospective: SessionRetrospectiveSchema.optional(),
  createdAt: z.string().optional(),
});
