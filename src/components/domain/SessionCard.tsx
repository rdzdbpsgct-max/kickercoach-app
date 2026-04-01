import { Card, Badge } from "../ui";
import { formatTime } from "../../domain/logic/time";
import type { Session } from "../../domain/models/Session";

const MOOD_LABELS: Record<string, string> = {
  great: "Super",
  good: "Gut",
  ok: "OK",
  tired: "Muede",
  frustrated: "Frustriert",
};

const MOOD_COLORS: Record<string, "green" | "blue" | "orange" | "red"> = {
  great: "green",
  good: "blue",
  ok: "orange",
  tired: "orange",
  frustrated: "red",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-xs text-kicker-orange">
      {Array.from({ length: 5 }, (_, i) =>
        i < rating ? "\u2605" : "\u2606",
      ).join("")}
    </span>
  );
}

interface SessionCardProps {
  session: Session;
  onClick?: () => void;
  playerNames?: Record<string, string>;
  compact?: boolean;
}

export function SessionCard({
  session,
  onClick,
  playerNames,
  compact = false,
}: SessionCardProps) {
  const getPlayerName = (id: string) => playerNames?.[id] ?? "?";

  if (compact) {
    return (
      <div
        onClick={onClick}
        className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${
          onClick ? "cursor-pointer hover:bg-card-hover transition-colors" : ""
        }`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-text truncate">
              {session.name}
            </span>
            {session.rating && <StarRating rating={session.rating} />}
          </div>
          <div className="text-[10px] text-text-dim">
            {session.date} &middot; {session.drillIds.length} Drills
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card interactive={!!onClick} onClick={onClick}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-text">
          {session.name}
        </span>
        {session.rating && <StarRating rating={session.rating} />}
        {session.mood && (
          <Badge color={MOOD_COLORS[session.mood]}>
            {MOOD_LABELS[session.mood]}
          </Badge>
        )}
      </div>
      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-text-dim">
        <span>
          {session.date} &middot; {formatTime(session.totalDuration)} &middot;{" "}
          {session.drillIds.length} Drills
        </span>
        {session.playerIds.length > 0 && playerNames && (
          <span className="flex items-center gap-1">
            &middot;
            {session.playerIds.map((id) => (
              <Badge key={id} color="blue">
                {getPlayerName(id)}
              </Badge>
            ))}
          </span>
        )}
      </div>
      {session.focusAreas.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1">
          {session.focusAreas.map((area) => (
            <Badge key={area} color="accent">
              {area}
            </Badge>
          ))}
        </div>
      )}
      {session.drillResults && session.drillResults.length > 0 && (
        <div className="mt-1 flex items-center gap-1 text-[10px] text-text-dim">
          <span>Ergebnisse:</span>
          <span className="font-medium text-kicker-green">
            {session.drillResults.filter((r) => r.completed).length}/
            {session.drillResults.length} abgeschlossen
          </span>
        </div>
      )}
      {session.retrospective && (
        <div className="mt-1 text-[10px] text-accent">
          Retrospektive vorhanden
        </div>
      )}
      {session.notes && (
        <div className="mt-1 line-clamp-1 text-xs text-text-dim">
          {session.notes}
        </div>
      )}
    </Card>
  );
}
