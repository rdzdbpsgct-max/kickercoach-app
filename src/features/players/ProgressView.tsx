import { useMemo } from "react";
import { Card, Badge } from "../../components/ui";
import type { Evaluation, EvaluationType } from "../../domain/models/Evaluation";
import type { Category } from "../../domain/models/CoachCard";
import type { PlayerTechnique } from "../../domain/models/PlayerTechnique";
import type { TechniqueStatus } from "../../domain/models/PlayerTechnique";
import {
  ALL_CATEGORIES,
  TECHNIQUE_STATUS_LABELS,
  TECHNIQUE_STATUS_COLORS,
} from "../../domain/constants";

const SKILL_COLORS: Record<Category, string> = {
  Torschuss: "#ef4444",
  Passspiel: "#3b82f6",
  Ballkontrolle: "#22c55e",
  Defensive: "#f59e0b",
  Taktik: "#8b5cf6",
  Offensive: "#06b6d4",
  Mental: "#ec4899",
};

const EVALUATION_TYPE_LABELS: Record<EvaluationType, string> = {
  session: "Training",
  match: "Spiel",
  general: "Allgemein",
};

const EVALUATION_TYPE_COLORS: Record<EvaluationType, "blue" | "orange" | "green"> = {
  session: "blue",
  match: "orange",
  general: "green",
};

function StarDisplay({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`text-sm ${i < rating ? "text-kicker-orange" : "text-border"}`}
        >
          ★
        </span>
      ))}
    </span>
  );
}

interface ProgressViewProps {
  evaluations: Evaluation[];
  playerTechniques?: PlayerTechnique[];
}

export function ProgressView({ evaluations, playerTechniques }: ProgressViewProps) {
  const sorted = useMemo(
    () => [...evaluations].sort((a, b) => a.date.localeCompare(b.date)),
    [evaluations],
  );

  // Compute progress summary
  const summary = useMemo(() => {
    if (sorted.length < 2) return null;
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const changes: { category: Category; diff: number }[] = [];

    for (const cat of ALL_CATEGORIES) {
      const firstRating = first.skillRatings.find((r) => r.category === cat)?.rating ?? 0;
      const lastRating = last.skillRatings.find((r) => r.category === cat)?.rating ?? 0;
      if (firstRating !== lastRating) {
        changes.push({ category: cat, diff: lastRating - firstRating });
      }
    }

    return { since: first.date, changes };
  }, [sorted]);

  if (evaluations.length === 0) {
    return (
      <p className="text-xs text-text-dim py-2">
        Noch keine Bewertungen vorhanden.
      </p>
    );
  }

  // SVG mini line chart dimensions
  const chartW = 280;
  const chartH = 80;
  const padX = 4;
  const padY = 4;

  return (
    <div className="flex flex-col gap-3">
      {/* Technique status summary */}
      {playerTechniques && playerTechniques.length > 0 && (
        <Card className="mb-3">
          <h3 className="mb-2 text-sm font-semibold text-text">Technik-Status</h3>
          <div className="flex flex-wrap gap-2">
            {(["mastered", "proficient", "developing", "learning", "not_started"] as TechniqueStatus[]).map((status) => {
              const count = playerTechniques.filter((pt) => pt.status === status).length;
              if (count === 0) return null;
              return (
                <div key={status} className="flex items-center gap-1 text-xs">
                  <span className={`h-2.5 w-2.5 rounded-full ${TECHNIQUE_STATUS_COLORS[status]}`} />
                  <span className="text-text-muted">{TECHNIQUE_STATUS_LABELS[status]}</span>
                  <span className="font-medium text-text">{count}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Progress summary */}
      {summary && (
        <Card>
          <h3 className="text-xs font-semibold text-text-dim mb-2">
            Fortschritt seit {summary.since}
          </h3>
          {summary.changes.length === 0 ? (
            <p className="text-xs text-text-dim">Keine Veraenderungen.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {summary.changes.map(({ category, diff }) => (
                <span key={category} className="flex items-center gap-1 text-xs">
                  <Badge color="accent">{category}</Badge>
                  <span
                    className={`font-bold ${diff > 0 ? "text-kicker-green" : "text-kicker-red"}`}
                  >
                    {diff > 0 ? `+${diff}` : diff}
                  </span>
                </span>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Mini line charts per skill */}
      {sorted.length >= 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ALL_CATEGORIES.map((cat) => {
            const points = sorted.map((ev, i) => {
              const rating = ev.skillRatings.find((r) => r.category === cat)?.rating ?? 0;
              const x = padX + (i / (sorted.length - 1)) * (chartW - 2 * padX);
              const y = padY + ((5 - rating) / 4) * (chartH - 2 * padY);
              return { x, y, rating };
            });

            const pathD = points
              .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
              .join(" ");

            return (
              <Card key={cat} className="flex flex-col gap-1 py-2 px-3">
                <span className="text-[10px] font-medium text-text-dim">{cat}</span>
                <svg
                  viewBox={`0 0 ${chartW} ${chartH}`}
                  className="w-full h-16"
                  role="img"
                  aria-label={`${cat} Verlauf`}
                >
                  {/* Grid lines */}
                  {[1, 2, 3, 4, 5].map((level) => {
                    const y = padY + ((5 - level) / 4) * (chartH - 2 * padY);
                    return (
                      <line
                        key={level}
                        x1={padX}
                        y1={y}
                        x2={chartW - padX}
                        y2={y}
                        stroke="var(--color-border)"
                        strokeWidth={0.5}
                        strokeDasharray="4 4"
                      />
                    );
                  })}
                  {/* Line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={SKILL_COLORS[cat]}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Dots */}
                  {points.map((p, i) => (
                    <circle
                      key={i}
                      cx={p.x}
                      cy={p.y}
                      r={3.5}
                      fill={SKILL_COLORS[cat]}
                    />
                  ))}
                  {/* Last value label */}
                  <text
                    x={points[points.length - 1].x + 6}
                    y={points[points.length - 1].y + 3}
                    className="text-[10px] fill-text-muted font-semibold"
                  >
                    {points[points.length - 1].rating}
                  </text>
                </svg>
              </Card>
            );
          })}
        </div>
      )}

      {/* Timeline */}
      <div className="flex flex-col gap-1.5">
        <h3 className="text-xs font-semibold text-text-dim">Bewertungs-Verlauf</h3>
        {[...sorted].reverse().map((ev) => (
          <Card key={ev.id} className="py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-text">{ev.date}</span>
                {ev.type && (
                  <Badge color={EVALUATION_TYPE_COLORS[ev.type]}>
                    {EVALUATION_TYPE_LABELS[ev.type]}
                  </Badge>
                )}
                {ev.overallRating != null && (
                  <StarDisplay rating={ev.overallRating} />
                )}
              </div>
              <div className="flex gap-1.5">
                {ev.skillRatings.map((sr) => (
                  <span
                    key={sr.category}
                    className="text-[10px] text-text-dim"
                  >
                    {sr.category.slice(0, 3)}:{sr.rating}
                  </span>
                ))}
              </div>
            </div>
            {ev.notes && (
              <p className="mt-1 text-xs text-text-dim">{ev.notes}</p>
            )}
            {ev.techniqueRatings && ev.techniqueRatings.length > 0 && (
              <div className="mt-2 border-t border-border pt-2">
                <span className="text-[10px] font-semibold text-text-dim">
                  Technik-Bewertungen
                </span>
                <div className="mt-1 flex flex-col gap-1">
                  {ev.techniqueRatings.map((tr, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <span className="font-medium text-text-muted">
                        {tr.techniqueId}
                      </span>
                      <StarDisplay rating={tr.rating} />
                      {tr.successRate != null && (
                        <span className="text-text-dim">
                          {tr.successRate}% Erfolg
                        </span>
                      )}
                      {tr.comment && (
                        <span className="text-text-dim italic">
                          {tr.comment}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
