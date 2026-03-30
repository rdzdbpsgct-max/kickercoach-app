import { z } from "zod";
import { CategorySchema } from "./coachCard";

export const SessionTemplateSchema = z.object({
  name: z.string(),
  drillIds: z.array(z.string()),
  focusAreas: z.array(CategorySchema),
  estimatedDuration: z.number(),
});

export const TrainingWeekSchema = z.object({
  weekNumber: z.number().int().min(1),
  sessionTemplates: z.array(SessionTemplateSchema),
});

export const TrainingPlanSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  playerIds: z.array(z.string()),
  weeks: z.array(TrainingWeekSchema),
  goal: z.string().optional(),
  createdAt: z.string(),
});
