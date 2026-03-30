import { useMemo } from "react";
import { useAppStore } from "../../store";
import { Card } from "../../components/ui";
import { SimpleBarChart } from "../../components/ui/SimpleBarChart";
import type { Category } from "../../domain/models/CoachCard";

interface SkillProgressChartProps {
  playerId: string;
}

const CATEGORY_COLORS: Record<Category, string> = {
  Torschuss: "#ef4444",
  Passspiel: "#3b82f6",
  Ballkontrolle: "#22c55e",
  Defensive: "#f59e0b",
  Taktik: "#8b5cf6",
  Offensive: "#06b6d4",
  Mental: "#ec4899",
};

export function SkillProgressChart({ playerId }: SkillProgressChartProps) {
  const evaluations = useAppStore((s) => s.getPlayerEvaluations(playerId));
  const players = useAppStore((s) => s.players);
  const player = players.find((p) => p.id === playerId);

  const chartData = useMemo(() => {
    if (!player) return [];

    // Use latest evaluation if available, otherwise player's skillRatings
    const latestEval = evaluations.length > 0
      ? evaluations[evaluations.length - 1]
      : null;

    const categories: Category[] = [
      "Torschuss", "Passspiel", "Ballkontrolle", "Defensive", "Taktik", "Offensive", "Mental",
    ];

    return categories.map((cat) => {
      const rating = latestEval
        ? latestEval.skillRatings.find((r) => r.category === cat)?.rating ?? player.skillRatings[cat]
        : player.skillRatings[cat];
      return {
        label: cat.substring(0, 3),
        value: rating,
        color: CATEGORY_COLORS[cat],
      };
    });
  }, [player, evaluations]);

  if (!player) return null;

  return (
    <Card className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-text">
        Skill-Profil: {player.name}
      </h3>
      <p className="text-xs text-text-dim">
        Aktuelle Bewertungen (1-5)
        {evaluations.length > 0 && ` \u00B7 ${evaluations.length} Bewertungen`}
      </p>
      <SimpleBarChart data={chartData} maxValue={5} />
    </Card>
  );
}
