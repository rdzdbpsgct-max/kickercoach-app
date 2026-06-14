export interface LineSeries {
  label: string;
  color: string;
  /** One value per x position. Same length as the chart's xLabels. */
  points: number[];
}

interface LineChartProps {
  series: LineSeries[];
  xLabels: string[];
  minValue?: number;
  maxValue?: number;
  height?: number;
  ariaLabel?: string;
}

const VIEW_W = 320;
const PAD_L = 18;
const PAD_R = 8;
const PAD_T = 8;
const PAD_B = 18;

/**
 * Lightweight multi-series SVG line chart (no chart library).
 * Token-styled; one polyline + dots per series, horizontal gridlines.
 */
export function LineChart({
  series,
  xLabels,
  minValue = 0,
  maxValue = 5,
  height = 180,
  ariaLabel,
}: LineChartProps) {
  const plotW = VIEW_W - PAD_L - PAD_R;
  const plotH = height - PAD_T - PAD_B;
  const span = Math.max(1, maxValue - minValue);
  const n = xLabels.length;

  const x = (i: number) => PAD_L + (n <= 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const y = (v: number) => PAD_T + plotH - ((v - minValue) / span) * plotH;

  // Gridlines at each integer step (capped to keep it readable).
  const steps = Math.min(span, 5);
  const gridValues = Array.from(
    { length: steps + 1 },
    (_, i) => minValue + (i / steps) * span,
  );

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${height}`}
      className="w-full"
      role="img"
      aria-label={ariaLabel ?? "Line chart"}
    >
      {gridValues.map((gv, i) => (
        <g key={`grid-${i}`}>
          <line
            x1={PAD_L}
            x2={VIEW_W - PAD_R}
            y1={y(gv)}
            y2={y(gv)}
            className="stroke-border"
            strokeWidth={0.5}
          />
          <text
            x={PAD_L - 3}
            y={y(gv) + 3}
            textAnchor="end"
            className="fill-text-dim text-[7px]"
          >
            {Math.round(gv)}
          </text>
        </g>
      ))}

      {series.map((s, si) => {
        const pts = s.points
          .map((v, i) => `${x(i)},${y(v)}`)
          .join(" ");
        return (
          <g key={`series-${si}`}>
            <polyline
              points={pts}
              fill="none"
              stroke={s.color}
              strokeWidth={1.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {s.points.map((v, i) => (
              <circle
                key={i}
                cx={x(i)}
                cy={y(v)}
                r={1.8}
                fill={s.color}
              />
            ))}
          </g>
        );
      })}

      {xLabels.map((label, i) => (
        <text
          key={`xl-${i}`}
          x={x(i)}
          y={height - 5}
          textAnchor="middle"
          className="fill-text-dim text-[7px]"
        >
          {label}
        </text>
      ))}
    </svg>
  );
}
