import { useTranslation } from "react-i18next";

interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface SimpleBarChartProps {
  data: BarData[];
  maxValue?: number;
  height?: number;
}

export function SimpleBarChart({ data, maxValue, height = 160 }: SimpleBarChartProps) {
  const { t } = useTranslation("common");
  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);
  const barWidth = Math.min(40, Math.max(16, Math.floor(280 / data.length)));
  const gap = 4;
  const svgWidth = data.length * (barWidth + gap) + gap;
  const chartHeight = height - 24;

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${height}`}
      className="w-full max-w-sm"
      role="img"
      aria-label={t("ui.barChart")}
    >
      {data.map((d, i) => {
        const barHeight = max > 0 ? (d.value / max) * chartHeight : 0;
        const x = gap + i * (barWidth + gap);
        const y = chartHeight - barHeight;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={3}
              fill={d.color ?? "var(--color-accent)"}
              className="transition-all duration-300"
            />
            {d.value > 0 && (
              <text
                x={x + barWidth / 2}
                y={y - 4}
                textAnchor="middle"
                className="fill-text-muted text-[9px]"
              >
                {d.value}
              </text>
            )}
            <text
              x={x + barWidth / 2}
              y={height - 4}
              textAnchor="middle"
              className="fill-text-dim text-[8px]"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
