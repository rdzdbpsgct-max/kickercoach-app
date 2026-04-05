import { useMemo, useState, useEffect } from "react";
import { useAppStore } from "../../store";
import { Card } from "../../components/ui";
import { SimpleBarChart } from "../../components/ui/SimpleBarChart";
import type { Drill } from "../../domain/models/Drill";

type ChartMode = "usage" | "quality";

export function DrillStatsChart() {
  const sessions = useAppStore((s) => s.sessions);
  const customDrills = useAppStore((s) => s.customDrills);
  const [defaultDrills, setDefaultDrills] = useState<Drill[]>([]);
  const [mode, setMode] = useState<ChartMode>("usage");

  useEffect(() => {
    import("../../data/drills").then((mod) => mod.loadDrills().then(setDefaultDrills));
  }, []);

  const allDrills = useMemo(
    () => [...defaultDrills, ...customDrills],
    [defaultDrills, customDrills],
  );

  const getDrillName = (id: string) =>
    allDrills.find((d) => d.id === id)?.name ?? id.substring(0, 12);

  const usageData = useMemo(() => {
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
        label: getDrillName(id),
        value: count,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [sessions, allDrills]);

  const qualityData = useMemo(() => {
    // Collect quality ratings per drill from drillResults
    const ratings = new Map<string, { total: number; count: number }>();
    for (const session of sessions) {
      if (!session.drillResults) continue;
      for (const result of session.drillResults) {
        if (result.successRate == null) continue;
        const existing = ratings.get(result.drillId) ?? { total: 0, count: 0 };
        existing.total += result.successRate;
        existing.count += 1;
        ratings.set(result.drillId, existing);
      }
    }

    // Convert to chart data (average rating on 1-5 scale)
    return Array.from(ratings.entries())
      .map(([id, { total, count }]) => ({
        label: getDrillName(id),
        value: Math.round((total / count / 20) * 10) / 10, // Convert 0-100 to 1-5 scale
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [sessions, allDrills]);

  const hasQualityData = qualityData.length > 0;
  const chartData = mode === "quality" ? qualityData : usageData;

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">Drill-Statistiken</h3>
        {hasQualityData && (
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setMode("usage")}
              className={`px-2.5 py-1 text-[10px] font-medium transition-colors ${
                mode === "usage"
                  ? "bg-accent text-white"
                  : "text-text-dim hover:text-text"
              }`}
            >
              Nutzung
            </button>
            <button
              onClick={() => setMode("quality")}
              className={`px-2.5 py-1 text-[10px] font-medium transition-colors ${
                mode === "quality"
                  ? "bg-accent text-white"
                  : "text-text-dim hover:text-text"
              }`}
            >
              Qualitaet
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-text-dim">
        {mode === "usage"
          ? "Meistgenutzte Drills in Sessions"
          : "Durchschnittliche Qualitaet (1-5 Sterne)"}
      </p>
      {chartData.length === 0 ? (
        <p className="text-xs text-text-dim py-4 text-center">
          {mode === "usage"
            ? "Noch keine Drills in Sessions verwendet."
            : "Noch keine Drill-Bewertungen vorhanden."}
        </p>
      ) : (
        <SimpleBarChart
          data={chartData}
          maxValue={mode === "quality" ? 5 : undefined}
        />
      )}
    </Card>
  );
}
