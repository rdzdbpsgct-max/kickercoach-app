import { z } from "zod";

export const StrategyTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(["offensive", "defensive"]),
  description: z.string(),
  tips: z.array(z.string()),
});

export const MatchPlanSchema = z.object({
  id: z.string(),
  opponent: z.string(),
  date: z.string(),
  analysis: z.string(),
  gameplan: z.string(),
  timeoutStrategies: z.array(z.string()),
  notes: z.string(),
  offensiveStrategy: z.string().optional(),
  defensiveStrategy: z.string().optional(),
});
