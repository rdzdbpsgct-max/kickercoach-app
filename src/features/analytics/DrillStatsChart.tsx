import { useMemo, useState, useEffect } from "react";
import { useAppStore } from "../../store";
import { Card } from "../../components/ui";
import { SimpleBarChart } from "../../components/ui/SimpleBarChart";
import { STAR_RATING_SCALE } from "../../domain/constants";
import { buildNameMap } from "../../domain/logic/drill";
import { useTranslation } from "react-i18next";
import type { Drill } from "../../domain/models/Drill";

type ChartMode = "usage" | "quality";

export function DrillStatsChart() {
  const { t } = useTranslation("analytics");
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

  const drillNameMap = useMemo(() => buildNameMap(allDrills), [allDrills]);
  const resolveName = (id: string) => drillNameMap.get(id) ?? id.substring(0, 12);

  const usageData = useMemo(() => {
    const counts = new Map<string, number>();
    for (const session of sessions) {
      for (const drillId of session.drillIds) {
        counts.set(drillId, (counts.get(drillId) ?? 0) + 1);
      }
    }

    return Array.from(counts.entries())
      .map(([id, count]) => ({
        label: resolveName(id),
        value: count,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [sessions, drillNameMap]);

  const qualityData = useMemo(() => {
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

    return Array.from(ratings.entries())
      .map(([id, { total, count }]) => ({
        label: resolveName(id),
        value: Math.round((total / count / STAR_RATING_SCALE) * 10) / 10,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [sessions, drillNameMap]);

  const hasQualityData = qualityData.length > 0;
  const chartData = mode === "quality" ? qualityData : usageData;

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">{t("drillStats.title")}</h3>
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
              {t("drillStats.usage")}
            </button>
            <button
              onClick={() => setMode("quality")}
              className={`px-2.5 py-1 text-[10px] font-medium transition-colors ${
                mode === "quality"
                  ? "bg-accent text-white"
                  : "text-text-dim hover:text-text"
              }`}
            >
              {t("drillStats.quality")}
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-text-dim">
        {mode === "usage"
          ? t("drillStats.usageDescription")
          : t("drillStats.qualityDescription")}
      </p>
      {chartData.length === 0 ? (
        <p className="text-xs text-text-dim py-4 text-center">
          {mode === "usage"
            ? t("drillStats.emptyUsage")
            : t("drillStats.emptyQuality")}
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
