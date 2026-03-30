import { useMemo, useState, useEffect } from "react";
import { useAppStore } from "../../store";
import { Card } from "../../components/ui";
import { SimpleBarChart } from "../../components/ui/SimpleBarChart";
import type { Drill } from "../../domain/models/Drill";

export function DrillStatsChart() {
  const sessions = useAppStore((s) => s.sessions);
  const customDrills = useAppStore((s) => s.customDrills);
  const [defaultDrills, setDefaultDrills] = useState<Drill[]>([]);

  useEffect(() => {
    import("../../data/drills").then((mod) => setDefaultDrills(mod.DEFAULT_DRILLS));
  }, []);

  const allDrills = useMemo(
    () => [...defaultDrills, ...customDrills],
    [defaultDrills, customDrills],
  );

  const chartData = useMemo(() => {
    // Count drill usage across sessions
    const counts = new Map<string, number>();
    for (const session of sessions) {
      for (const drillId of session.drillIds) {
        counts.set(drillId, (counts.get(drillId) ?? 0) + 1);
      }
    }

    // Map to drill names and sort by count
    return Array.from(counts.entries())
      .map(([id, count]) => ({
        label: allDrills.find((d) => d.id === id)?.name.substring(0, 8) ?? id.substring(0, 8),
        value: count,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [sessions, allDrills]);

  return (
    <Card className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-text">Drill-Nutzung</h3>
      <p className="text-xs text-text-dim">Meistgenutzte Drills in Sessions</p>
      {chartData.length === 0 ? (
        <p className="text-xs text-text-dim py-4 text-center">
          Noch keine Drills in Sessions verwendet.
        </p>
      ) : (
        <SimpleBarChart data={chartData} />
      )}
    </Card>
  );
}
