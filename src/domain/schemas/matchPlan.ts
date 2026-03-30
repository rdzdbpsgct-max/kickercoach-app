import { z } from "zod";

export const StrategyTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(["offensive", "defensive"]),
  description: z.string(),
  tips: z.array(z.string()),
});

export const MatchSetSchema = z.object({
  setNumber: z.number().int().min(1),
  scoreHome: z.number().int().min(0),
  scoreAway: z.number().int().min(0),
});

export const MatchResultSchema = z.enum(["win", "loss", "draw"]);

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
  playerIds: z.array(z.string()).optional(),
  sets: z.array(MatchSetSchema).optional(),
  result: MatchResultSchema.optional(),
});
