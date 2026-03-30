import { useState } from "react";
import { useAppStore } from "../../store";
import { Card, Select } from "../../components/ui";
import { CATEGORY_BAR_COLORS } from "../../domain/constants";
import type { Category } from "../../domain/models/CoachCard";

const CATEGORIES: Category[] = [
  "Torschuss", "Passspiel", "Ballkontrolle", "Defensive", "Taktik", "Offensive", "Mental",
];

export function PlayerComparison() {
  const players = useAppStore((s) => s.players);
  const sessions = useAppStore((s) => s.sessions);
  const [idA, setIdA] = useState(players[0]?.id ?? "");
  const [idB, setIdB] = useState(players[1]?.id ?? "");

  const playerA = players.find((p) => p.id === idA);
  const playerB = players.find((p) => p.id === idB);

  const sessionsA = sessions.filter((s) => s.playerIds.includes(idA)).length;
  const sessionsB = sessions.filter((s) => s.playerIds.includes(idB)).length;

  if (players.length < 2) {
    return (
      <Card className="py-6 text-center">
        <p className="text-xs text-text-dim">
          Mindestens 2 Spieler fuer einen Vergleich erforderlich.
        </p>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-text">Spielervergleich</h3>

      <div className="grid grid-cols-2 gap-3">
        <Select value={idA} onChange={(e) => setIdA(e.target.value)}>
          {players.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </Select>
        <Select value={idB} onChange={(e) => setIdB(e.target.value)}>
          {players.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </Select>
      </div>

      {playerA && playerB && idA !== idB && (
        <>
          {/* Side-by-side skill bars */}
          <div className="flex flex-col gap-2">
            {CATEGORIES.map((cat) => {
              const valA = playerA.skillRatings[cat];
              const valB = playerB.skillRatings[cat];
              return (
                <div key={cat} className="flex items-center gap-2">
                  <span className="w-6 text-right text-xs font-semibold text-text-muted">
                    {valA}
                  </span>
                  <div className="flex flex-1 h-5 gap-0.5">
                    {/* Player A bar (right-aligned) */}
                    <div className="flex flex-1 justify-end">
                      <div
                        className={`h-full rounded-l ${CATEGORY_BAR_COLORS[cat]} transition-all`}
                        style={{ width: `${(valA / 5) * 100}%` }}
                      />
                    </div>
                    {/* Label */}
                    <span className="w-20 text-center text-[10px] font-medium text-text-dim leading-5 shrink-0">
                      {cat.substring(0, 6)}
                    </span>
                    {/* Player B bar (left-aligned) */}
                    <div className="flex flex-1">
                      <div
                        className={`h-full rounded-r ${CATEGORY_BAR_COLORS[cat]} opacity-60 transition-all`}
                        style={{ width: `${(valB / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-6 text-xs font-semibold text-text-muted">
                    {valB}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex justify-between text-xs text-text-dim">
            <div className="flex items-center gap-1.5">
              <div
                className="h-3 w-3 rounded"
                style={{ backgroundColor: playerA.avatarColor ?? "#6366f1" }}
              />
              {playerA.name}
            </div>
            <div className="flex items-center gap-1.5">
              {playerB.name}
              <div
                className="h-3 w-3 rounded"
                style={{ backgroundColor: playerB.avatarColor ?? "#6366f1" }}
              />
            </div>
          </div>

          {/* Session count comparison */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-surface-alt p-2">
              <div className="text-sm font-bold text-accent">{sessionsA}</div>
              <div className="text-[10px] text-text-dim">Sessions</div>
            </div>
            <div className="rounded-xl bg-surface-alt p-2">
              <div className="text-sm font-bold text-accent">{sessionsB}</div>
              <div className="text-[10px] text-text-dim">Sessions</div>
            </div>
          </div>
        </>
      )}

      {idA === idB && (
        <p className="text-xs text-text-dim text-center py-2">
          Waehle zwei verschiedene Spieler fuer den Vergleich.
        </p>
      )}
    </Card>
  );
}
