import type { Session } from "../../domain/models/Session";
import { formatTime } from "../../domain/logic/time";
import { calculateSessionStats } from "../../domain/logic/session";

interface JournalProps {
  sessions: Session[];
  onSelect: (session: Session) => void;
  onDelete: (id: string) => void;
}

export default function Journal({
  sessions,
  onSelect,
  onDelete,
}: JournalProps) {
  const stats = calculateSessionStats(sessions);

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      {/* Stats */}
      {sessions.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          <StatBox label="Sessions" value={String(stats.totalSessions)} />
          <StatBox label="Gesamt (min)" value={String(stats.totalMinutes)} />
          <StatBox
            label="Durchschnitt"
            value={`${stats.averageMinutes} min`}
          />
          <StatBox label="Laengste" value={`${stats.longestSession} min`} />
        </div>
      )}

      {/* List */}
      {sessions.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-text-dim">
          <span className="text-4xl">&#128221;</span>
          <p className="text-sm">Noch keine Sessions aufgezeichnet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 overflow-auto">
          {[...sessions].reverse().map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 transition-all hover:border-accent/50 hover:bg-card-hover"
            >
              <button
                onClick={() => onSelect(session)}
                className="flex-1 text-left"
              >
                <div className="text-sm font-semibold text-text">
                  {session.name}
                </div>
                <div className="mt-0.5 text-xs text-text-dim">
                  {session.date} &middot;{" "}
                  {formatTime(session.totalDuration)} &middot;{" "}
                  {session.drillIds.length} Drills
                </div>
                {session.notes && (
                  <div className="mt-1 line-clamp-1 text-xs text-text-dim">
                    {session.notes}
                  </div>
                )}
              </button>
              <button
                onClick={() => onDelete(session.id)}
                className="ml-3 rounded-lg border border-border px-2.5 py-1 text-xs text-text-dim hover:border-kicker-red/50 hover:text-kicker-red transition-all"
              >
                &#10005;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 text-center">
      <div className="text-lg font-bold text-accent">{value}</div>
      <div className="text-[11px] text-text-dim">{label}</div>
    </div>
  );
}
