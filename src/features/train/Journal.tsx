import { useState } from "react";
import { formatTime } from "../../domain/logic/time";
import { calculateSessionStats } from "../../domain/logic/session";
import { Card, Badge, EmptyState, ConfirmDialog } from "../../components/ui";
import { useAppStore } from "../../store";
import type { Session } from "../../store";

interface JournalProps {
  sessions: Session[];
  onSelect: (session: Session) => void;
  onDelete: (id: string) => void;
}

function StarRating({ rating }: { rating?: number }) {
  if (!rating) return null;
  return (
    <span className="text-xs text-kicker-orange">
      {Array.from({ length: 5 }, (_, i) =>
        i < rating ? "\u2605" : "\u2606",
      ).join("")}
    </span>
  );
}

export default function Journal({
  sessions,
  onSelect,
  onDelete,
}: JournalProps) {
  const stats = calculateSessionStats(sessions);
  const players = useAppStore((s) => s.players);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getPlayerName = (id: string) =>
    players.find((p) => p.id === id)?.name ?? "?";

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      {/* Stats */}
      {sessions.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="text-center">
            <div className="text-lg font-bold text-accent">
              {stats.totalSessions}
            </div>
            <div className="text-[11px] text-text-dim">Sessions</div>
          </Card>
          <Card className="text-center">
            <div className="text-lg font-bold text-accent">
              {stats.totalMinutes}
            </div>
            <div className="text-[11px] text-text-dim">Gesamt (min)</div>
          </Card>
          <Card className="text-center">
            <div className="text-lg font-bold text-accent">
              {stats.averageMinutes} min
            </div>
            <div className="text-[11px] text-text-dim">Durchschnitt</div>
          </Card>
          <Card className="text-center">
            <div className="text-lg font-bold text-accent">
              {stats.longestSession} min
            </div>
            <div className="text-[11px] text-text-dim">Laengste</div>
          </Card>
        </div>
      )}

      {/* List */}
      {sessions.length === 0 ? (
        <EmptyState
          icon="&#128221;"
          title="Noch keine Sessions"
          description="Noch keine Sessions aufgezeichnet."
        />
      ) : (
        <div className="flex flex-col gap-2 overflow-auto">
          {[...sessions].reverse().map((session) => (
            <Card key={session.id} interactive>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onSelect(session)}
                  className="flex-1 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text">
                      {session.name}
                    </span>
                    <StarRating rating={session.rating} />
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-text-dim">
                    <span>
                      {session.date} &middot;{" "}
                      {formatTime(session.totalDuration)} &middot;{" "}
                      {session.drillIds.length} Drills
                    </span>
                    {session.playerIds.length > 0 && (
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
                  {session.notes && (
                    <div className="mt-1 line-clamp-1 text-xs text-text-dim">
                      {session.notes}
                    </div>
                  )}
                </button>
                <button
                  onClick={() => setDeleteId(session.id)}
                  aria-label="Session loeschen"
                  className="ml-3 rounded-lg border border-border px-2.5 py-1 text-xs text-text-dim hover:border-kicker-red/50 hover:text-kicker-red transition-all"
                >
                  &#10005;
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) onDelete(deleteId);
        }}
        title="Session loeschen"
        message="Moechtest du diese Session wirklich loeschen?"
      />
    </div>
  );
}
