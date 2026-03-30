import { useMemo } from "react";
import { useAppStore } from "../../store";
import { Card } from "../../components/ui";
import { SimpleBarChart } from "../../components/ui/SimpleBarChart";

export function TrainingFrequencyChart() {
  const sessions = useAppStore((s) => s.sessions);

  const weekData = useMemo(() => {
    const now = new Date();
    const weeks: { label: string; value: number }[] = [];

    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - i * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const count = sessions.filter((s) => {
        const d = new Date(s.date);
        return d >= weekStart && d < weekEnd;
      }).length;

      const label = `KW${getISOWeek(weekStart)}`;
      weeks.push({ label, value: count });
    }

    return weeks;
  }, [sessions]);

  return (
    <Card className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-text">Trainingsfrequenz</h3>
      <p className="text-xs text-text-dim">Sessions pro Woche (letzte 8 Wochen)</p>
      {sessions.length === 0 ? (
        <p className="text-xs text-text-dim py-4 text-center">Noch keine Sessions vorhanden.</p>
      ) : (
        <SimpleBarChart data={weekData} />
      )}
    </Card>
  );
}

function getISOWeek(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
