import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../../store";
import { Card } from "../../components/ui";
import { LineChart, type LineSeries } from "../../components/ui/LineChart";
import { SKILL_COLORS } from "../../domain/constants";
import { buildSkillTrends } from "../../domain/logic/skillTrends";

interface SkillTrendChartProps {
  playerId: string;
}

/** Short date label like "01.02" from an ISO date string. */
function shortDate(iso: string): string {
  const [, m, d] = iso.split("-");
  return d && m ? `${d}.${m}` : iso;
}

export function SkillTrendChart({ playerId }: SkillTrendChartProps) {
  const { t } = useTranslation(["analytics", "common"]);
  const evaluations = useAppStore((s) => s.getPlayerEvaluations(playerId));

  const { dates, series } = useMemo(() => {
    const { dates, trends } = buildSkillTrends(evaluations);
    const series: LineSeries[] = trends.map((tr) => ({
      label: t(`constants.category.${tr.category}`, { ns: "common" }),
      color: SKILL_COLORS[tr.category],
      points: tr.ratings,
    }));
    return { dates, series };
  }, [evaluations, t]);

  return (
    <Card className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-text">
        {t("analytics:skillTrend.title")}
      </h3>
      {dates.length < 2 ? (
        <p className="py-6 text-center text-xs text-text-dim">
          {t("analytics:skillTrend.needMore")}
        </p>
      ) : (
        <>
          <LineChart
            series={series}
            xLabels={dates.map(shortDate)}
            minValue={0}
            maxValue={5}
            ariaLabel={t("analytics:skillTrend.title")}
          />
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {series.map((s) => (
              <span
                key={s.label}
                className="flex items-center gap-1 text-[10px] text-text-muted"
              >
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                {s.label}
              </span>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
