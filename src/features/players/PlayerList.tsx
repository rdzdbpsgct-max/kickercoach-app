import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Badge, Card, Button, EmptyState, SearchBar } from "../../components/ui";
import { useTranslation } from "react-i18next";
import type { Player } from "../../domain/models/Player";

const listContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const listItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

interface PlayerListProps {
  players: Player[];
  onSelect: (player: Player) => void;
  onAdd: () => void;
}

export function PlayerList({ players, onSelect, onAdd }: PlayerListProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  const filtered = useMemo(() => {
    let result = players;

    // Filter by active status
    if (!showInactive) {
      result = result.filter((p) => p.isActive !== false);
    }

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nickname?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [players, search, showInactive]);

  const inactiveCount = useMemo(
    () => players.filter((p) => p.isActive === false).length,
    [players],
  );

  if (players.length === 0) {
    return (
      <EmptyState
        icon="&#128100;"
        title="Noch keine Spieler"
        description="Lege deinen ersten Spieler an, um mit dem Coaching zu starten."
        action={{ label: "Spieler anlegen", onClick: onAdd }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 overflow-auto pb-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-text">
          Spieler ({filtered.length})
        </h2>
        <Button size="sm" onClick={onAdd}>
          + Spieler anlegen
        </Button>
      </div>
      <div className="flex items-center gap-3">
        {players.length > 3 && (
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} placeholder="Spieler suchen..." />
          </div>
        )}
        {inactiveCount > 0 && (
          <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-border text-accent focus:ring-accent/30"
            />
            <span className="text-[11px] text-text-muted whitespace-nowrap">
              Inaktive ({inactiveCount})
            </span>
          </label>
        )}
      </div>
      <motion.div
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        variants={listContainer}
        initial="initial"
        animate="animate"
        key={search + String(showInactive)}
      >
        {filtered.map((player) => {
          const inactive = player.isActive === false;

          return (
            <motion.div key={player.id} variants={listItem}>
              <Card
                interactive
                onClick={() => onSelect(player)}
                className={`flex items-center gap-3 ${inactive ? "opacity-50" : ""}`}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white"
                  style={{ backgroundColor: player.avatarColor ?? "#00e676" }}
                >
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-text truncate">{player.name}</p>
                  <div className="mt-1 flex gap-1.5 flex-wrap">
                    <Badge color="blue">{t(`constants.position.${player.preferredPosition}`)}</Badge>
                    <Badge color="orange">{t(`constants.difficulty.${player.level}`)}</Badge>
                    {inactive && <Badge color="red">Inaktiv</Badge>}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
