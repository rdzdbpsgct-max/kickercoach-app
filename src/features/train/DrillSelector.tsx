import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import type { Drill, DrillPhase, RodPosition } from "../../domain/models/Drill";
import type { Difficulty, Category } from "../../domain/models/CoachCard";
import { drillTotalDuration, formatTime } from "../../domain/logic";
import { useTranslation } from "react-i18next";
import { Badge, Card, Button, SearchBar } from "../../components/ui";

const DIFFICULTY_BADGE_COLORS = {
  beginner: "green",
  intermediate: "orange",
  advanced: "red",
} as const;

const PHASE_BADGE_COLORS: Record<DrillPhase, "blue" | "orange" | "green" | "accent"> = {
  warmup: "orange",
  technique: "blue",
  game: "green",
  cooldown: "accent",
};

const DIFFICULTY_OPTIONS: (Difficulty | "Alle")[] = [
  "Alle",
  "beginner",
  "intermediate",
  "advanced",
];

const PHASE_OPTIONS: (DrillPhase | "Alle")[] = [
  "Alle",
  "warmup",
  "technique",
  "game",
  "cooldown",
];

const CATEGORY_OPTIONS: (Category | "Alle")[] = [
  "Alle",
  "Torschuss",
  "Passspiel",
  "Ballkontrolle",
  "Defensive",
  "Taktik",
  "Offensive",
  "Mental",
];

const POSITION_OPTIONS: (RodPosition | "Alle")[] = [
  "Alle",
  "keeper",
  "defense",
  "midfield",
  "offense",
];

const listContainer = {
  animate: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const listItem = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

interface DrillSelectorProps {
  drills: Drill[];
  selectedId: string | null;
  onSelect: (drill: Drill) => void;
  onNewDrill?: () => void;
  onEditDrill?: (drill: Drill) => void;
  onDeleteDrill?: (id: string) => void;
  recommendedDrillIds?: string[];
  recommendLabel?: string;
}

export default function DrillSelector({
  drills,
  selectedId,
  onSelect,
  onNewDrill,
  onEditDrill,
  onDeleteDrill,
  recommendedDrillIds,
  recommendLabel,
}: DrillSelectorProps) {
  const { t } = useTranslation();
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "Alle">("Alle");
  const [phaseFilter, setPhaseFilter] = useState<DrillPhase | "Alle">("Alle");
  const [categoryFilter, setCategoryFilter] = useState<Category | "Alle">("Alle");
  const [positionFilter, setPositionFilter] = useState<RodPosition | "Alle">("Alle");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = drills;
    if (difficultyFilter !== "Alle") {
      result = result.filter((d) => d.difficulty === difficultyFilter);
    }
    if (phaseFilter !== "Alle") {
      result = result.filter((d) => d.phase === phaseFilter);
    }
    if (categoryFilter !== "Alle") {
      result = result.filter((d) => d.category === categoryFilter);
    }
    if (positionFilter !== "Alle") {
      result = result.filter((d) => d.position === positionFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.focusSkill.toLowerCase().includes(q) ||
          d.description?.toLowerCase().includes(q) ||
          d.category?.toLowerCase().includes(q),
      );
    }
    return result;
  }, [drills, difficultyFilter, phaseFilter, categoryFilter, positionFilter, search]);

  // Split into recommended + rest
  const recommended = useMemo(() => {
    if (!recommendedDrillIds?.length) return [];
    return filtered.filter((d) => recommendedDrillIds.includes(d.id));
  }, [filtered, recommendedDrillIds]);

  const rest = useMemo(() => {
    if (!recommendedDrillIds?.length) return filtered;
    return filtered.filter((d) => !recommendedDrillIds.includes(d.id));
  }, [filtered, recommendedDrillIds]);

  const renderDrill = (drill: Drill) => (
    <motion.div key={drill.id} variants={listItem}>
      <Card
        interactive
        onClick={() => onSelect(drill)}
        className={
          selectedId === drill.id
            ? "border-accent bg-accent-dim"
            : ""
        }
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-sm font-semibold">{drill.name}</span>
              {drill.difficulty && (
                <Badge color={DIFFICULTY_BADGE_COLORS[drill.difficulty]}>
                  {t(`constants.difficulty.${drill.difficulty}`)}
                </Badge>
              )}
              {drill.phase && (
                <Badge color={PHASE_BADGE_COLORS[drill.phase]}>
                  {t(`constants.phase.${drill.phase}`)}
                </Badge>
              )}
              {drill.isCustom && (
                <Badge color="accent">Eigener Drill</Badge>
              )}
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-text-dim">
              <span>{drill.focusSkill}</span>
              <span>&middot;</span>
              <span>{drill.blocks.length} Blocks</span>
              {drill.position && (
                <>
                  <span>&middot;</span>
                  <span>{t(`constants.rodPosition.${drill.position}`)}</span>
                </>
              )}
              {drill.playerCount && drill.playerCount > 1 && (
                <>
                  <span>&middot;</span>
                  <span>{drill.playerCount} Spieler</span>
                </>
              )}
            </div>
            {drill.description && (
              <div className="mt-1 line-clamp-1 text-xs text-text-dim">
                {drill.description}
              </div>
            )}
            {drill.measurableGoal && (
              <div className="mt-0.5 text-[11px] text-accent">
                Ziel: {drill.measurableGoal}
              </div>
            )}
          </div>
          <div className="ml-3 flex shrink-0 items-center gap-2">
            <span className="text-xs font-medium text-text-dim">
              {formatTime(drillTotalDuration(drill))}
            </span>
            {drill.isCustom && onEditDrill && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditDrill(drill);
                }}
                className="rounded-lg border border-border px-2 py-1 text-[11px] text-text-muted hover:border-accent/50 transition-all"
                title="Bearbeiten"
              >
                &#9998;
              </button>
            )}
            {drill.isCustom && onDeleteDrill && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteDrill(drill.id);
                }}
                className="rounded-lg border border-border px-2 py-1 text-[11px] text-kicker-red hover:border-kicker-red/50 transition-all"
                title="Loeschen"
              >
                &#10005;
              </button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      <SearchBar value={search} onChange={setSearch} placeholder="Drill suchen..." />

      {/* Filters */}
      <div className="flex flex-col gap-2">
        {/* Difficulty filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          {DIFFICULTY_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setDifficultyFilter(opt)}
              aria-pressed={difficultyFilter === opt}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                difficultyFilter === opt
                  ? "border-2 border-accent bg-accent-dim text-accent"
                  : "border border-border text-text-muted hover:border-accent/50"
              }`}
            >
              {opt === "Alle" ? "Alle Stufen" : t(`constants.difficulty.${opt}`)}
            </button>
          ))}
        </div>

        {/* Phase filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          {PHASE_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setPhaseFilter(opt)}
              aria-pressed={phaseFilter === opt}
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-all ${
                phaseFilter === opt
                  ? "border-2 border-accent bg-accent-dim text-accent"
                  : "border border-border text-text-muted hover:border-accent/50"
              }`}
            >
              {opt === "Alle" ? "Alle Phasen" : t(`constants.phase.${opt}`)}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setCategoryFilter(opt)}
              aria-pressed={categoryFilter === opt}
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-all ${
                categoryFilter === opt
                  ? "border-2 border-accent bg-accent-dim text-accent"
                  : "border border-border text-text-muted hover:border-accent/50"
              }`}
            >
              {opt === "Alle" ? "Alle Kategorien" : opt}
            </button>
          ))}
        </div>

        {/* Position filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          {POSITION_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setPositionFilter(opt)}
              aria-pressed={positionFilter === opt}
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-all ${
                positionFilter === opt
                  ? "border-2 border-accent bg-accent-dim text-accent"
                  : "border border-border text-text-muted hover:border-accent/50"
              }`}
            >
              {opt === "Alle" ? "Alle Positionen" : t(`constants.rodPosition.${opt}`)}
            </button>
          ))}
          <span className="ml-auto self-center text-xs text-text-dim">
            {filtered.length} Drills
          </span>
          {onNewDrill && (
            <Button size="sm" onClick={onNewDrill}>
              + Neuer Drill
            </Button>
          )}
        </div>
      </div>

      {/* Drill list */}
      <motion.div
        className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto"
        variants={listContainer}
        initial="initial"
        animate="animate"
        key={`${difficultyFilter}-${phaseFilter}-${categoryFilter}-${positionFilter}-${search}`}
      >
        {/* Recommended section */}
        {recommended.length > 0 && (
          <>
            <div className="text-xs font-semibold text-accent">
              {recommendLabel ?? "Empfohlen"} ({recommended.length})
            </div>
            {recommended.map(renderDrill)}
            {rest.length > 0 && (
              <div className="mt-2 text-xs font-semibold text-text-dim">
                Weitere Drills ({rest.length})
              </div>
            )}
          </>
        )}
        {rest.map(renderDrill)}
      </motion.div>
    </div>
  );
}
