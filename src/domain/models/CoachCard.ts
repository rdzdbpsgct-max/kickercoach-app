export type Difficulty = "beginner" | "intermediate" | "advanced";

export type Category =
  | "Torschuss"
  | "Passspiel"
  | "Ballkontrolle"
  | "Defensive"
  | "Taktik";

export interface CoachCard {
  id: string;
  title: string;
  summary: string;
  difficulty: Difficulty;
  category: Category;
  tags: string[];
  steps: string[];
  commonMistakes: string[];
  coachCues: string[];
}
