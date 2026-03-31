import { useState, useMemo } from "react";
import { formatTime } from "../../domain/logic/time";
import { calculateSessionStats } from "../../domain/logic/session";
import { Card, Badge, Button, EmptyState, ConfirmDialog, SearchBar } from "../../components/ui";
import { printCurrentPage } from "../../utils/print";
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
  const players = useAppStore((s) => s.players);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterPlayerId, setFilterPlayerId] = useState<string | "">("");

  const getPlayerName = (id: string) =>
    players.find((p) => p.id === id)?.name ?? "?";

  const filteredSessions = useMemo(() => {
    let result = sessions;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.notes.toLowerCase().includes(q),
      );
    }
    if (filterPlayerId) {
      result = result.filter((s) => s.playerIds.includes(filterPlayerId));
    }
    return result;
  }, [sessions, search, filterPlayerId]);

  const stats = calculateSessionStats(filteredSessions);

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      {/* Actions */}
      {sessions.length > 0 && (
        <div className="flex justify-end no-print">
          <Button variant="secondary" size="sm" onClick={printCurrentPage}>
            Drucken
          </Button>
        </div>
      )}
      {/* Search & Filter */}
      {sessions.length > 0 && (
        <div className="flex flex-col gap-2">
          <SearchBar value={search} onChange={setSearch} placeholder="Session suchen..." />
          {players.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setFilterPlayerId("")}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  !filterPlayerId
                    ? "border-2 border-accent bg-accent-dim text-accent-hover"
                    : "border border-border text-text-muted hover:border-accent/50"
                }`}
              >
                Alle
              </button>
              {players.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setFilterPlayerId(p.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    filterPlayerId === p.id
                      ? "border-2 border-accent bg-accent-dim text-accent-hover"
                      : "border border-border text-text-muted hover:border-accent/50"
                  }`}
                >
                  {p.name}
                </button>
              ))}
              <span className="ml-auto text-xs text-text-dim">
                {filteredSessions.length} Sessions
              </span>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      {filteredSessions.length > 0 && (
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
      {filteredSessions.length === 0 ? (
        <EmptyState
          icon="&#128221;"
          title={sessions.length === 0 ? "Noch keine Sessions" : "Keine Treffer"}
          description={sessions.length === 0 ? "Noch keine Sessions aufgezeichnet." : "Versuche einen anderen Filter oder Suchbegriff."}
        />
      ) : (
        <div className="flex flex-col gap-2 overflow-auto">
          {[...filteredSessions].reverse().map((session) => (
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
                  {session.drillResults && session.drillResults.length > 0 && (
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-text-dim">
                      <span>Ergebnisse:</span>
                      <span className="font-medium text-kicker-green">
                        {session.drillResults.filter((r) => r.completed).length}/{session.drillResults.length} abgeschlossen
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
