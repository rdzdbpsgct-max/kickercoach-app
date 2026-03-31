import { z } from "zod";

export const MatchSetSchema = z.object({
  setNumber: z.number(),
  scoreHome: z.number().min(0),
  scoreAway: z.number().min(0),
});

export const MatchResultSchema = z.enum(["win", "loss", "draw"]);

export const MatchSchema = z.object({
  id: z.string(),
  opponent: z.string(),
  date: z.string(),
  sets: z.array(MatchSetSchema),
  result: MatchResultSchema.optional(),
  playerIds: z.array(z.string()),
  teamId: z.string().optional(),
  planId: z.string().optional(),
  observations: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string(),
});
