export interface StrategyTemplate {
  id: string;
  name: string;
  category: "offensive" | "defensive";
  description: string;
  tips: string[];
}

export interface MatchPlan {
  id: string;
  opponent: string;
  date: string;
  analysis: string;
  gameplan: string;
  timeoutStrategies: string[];
  notes: string;
  offensiveStrategy?: string;
  defensiveStrategy?: string;
}
