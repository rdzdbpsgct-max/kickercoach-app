import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { CoachCard } from "../../domain/models/CoachCard";
import type { Drill } from "../../domain/models/Drill";
import {
  DIFFICULTY_LABELS,
  DIFFICULTY_TEXT_COLORS,
} from "../../domain/constants";
import { Button, Badge } from "../../components/ui";

interface CardDetailProps {
  card: CoachCard;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBack: () => void;
  allCards?: CoachCard[];
  onNavigateToCard?: (card: CoachCard) => void;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: 0.08 * i, ease: "easeOut" as const },
  }),
};

export default function CardDetail({
  card,
  isFavorite,
  onToggleFavorite,
  onBack,
  allCards = [],
  onNavigateToCard,
}: CardDetailProps) {
  const navigate = useNavigate();
  const [matchingDrills, setMatchingDrills] = useState<Drill[]>([]);

  useEffect(() => {
    import("../../data/drills").then((mod) => {
      mod.loadDrills().then((allDrills) => {
        const drills = allDrills.filter(
          (d) =>
            d.focusSkill.toLowerCase().includes(card.category.toLowerCase()) ||
            card.tags.some((tag) =>
              d.focusSkill.toLowerCase().includes(tag.toLowerCase()),
            ),
        );
        setMatchingDrills(drills.slice(0, 3));
      });
    });
  }, [card.category, card.tags]);

  const prerequisiteCards = allCards.filter(
    (c) => card.prerequisites?.includes(c.id),
  );
  const nextStepCards = allCards.filter(
    (c) => card.nextCards?.includes(c.id),
  );
  return (
    <motion.div
      className="flex flex-1 flex-col gap-5 overflow-auto pb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Header */}
      <motion.div
        custom={0}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <button
          onClick={onBack}
          aria-label="Zurueck zur Bibliothek"
          className="mb-2 text-xs text-text-dim hover:text-accent transition-colors"
        >
          &larr; Zurueck zur Bibliothek
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{card.title}</h1>
            <div className="mt-1 flex items-center gap-3 text-sm">
              <span
                className={`font-medium ${DIFFICULTY_TEXT_COLORS[card.difficulty]}`}
              >
                {DIFFICULTY_LABELS[card.difficulty]}
              </span>
              <span className="text-text-dim">&middot;</span>
              <span className="text-text-muted">{card.category}</span>
            </div>
          </div>
          <button
            onClick={onToggleFavorite}
            aria-label={isFavorite ? "Von Favoriten entfernen" : "Zu Favoriten hinzufuegen"}
            aria-pressed={isFavorite}
            className={`text-2xl transition-transform hover:scale-110 ${
              isFavorite ? "text-kicker-orange" : "text-text-dim"
            }`}
          >
            {isFavorite ? "\u2605" : "\u2606"}
          </button>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.p
        className="text-sm leading-relaxed text-text-muted"
        custom={1}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        {card.summary}
      </motion.p>

      {/* Tags */}
      <motion.div
        className="flex flex-wrap gap-1.5"
        custom={2}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        {card.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs text-text-dim"
          >
            {tag}
          </span>
        ))}
      </motion.div>

      {/* Steps */}
      <motion.div
        className="rounded-xl border border-border bg-card p-5"
        custom={3}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="mb-3 text-base font-bold">Schritte</h2>
        <ol className="flex flex-col gap-2.5">
          {card.steps.map((step, i) => (
            <motion.li
              key={i}
              className="flex gap-3 text-sm"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.3 + i * 0.06 }}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-dim text-xs font-bold text-accent">
                {i + 1}
              </span>
              <span className="leading-relaxed text-text-muted">{step}</span>
            </motion.li>
          ))}
        </ol>
      </motion.div>

      {/* Common Mistakes */}
      <motion.div
        className="rounded-xl border border-kicker-red/20 bg-kicker-red/5 p-5"
        custom={4}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="mb-3 text-base font-bold text-kicker-red">
          Haeufige Fehler
        </h2>
        <ul className="flex flex-col gap-2">
          {card.commonMistakes.map((mistake, i) => (
            <li
              key={i}
              className="flex gap-2 text-sm leading-relaxed text-text-muted"
            >
              <span className="text-kicker-red">&#10007;</span>
              {mistake}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Coach Cues */}
      <motion.div
        className="rounded-xl border border-kicker-green/20 bg-kicker-green/5 p-5"
        custom={5}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="mb-3 text-base font-bold text-kicker-green">
          Coach Tipps
        </h2>
        <ul className="flex flex-col gap-2">
          {card.coachCues.map((cue, i) => (
            <li
              key={i}
              className="flex gap-2 text-sm leading-relaxed text-text-muted"
            >
              <span className="text-kicker-green">&#10003;</span>
              {cue}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Matching Drills */}
      {matchingDrills.length > 0 && (
        <motion.div
          className="rounded-xl border border-kicker-orange/20 bg-kicker-orange/5 p-5"
          custom={6}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="mb-3 text-base font-bold text-kicker-orange">
            Passende Drills
          </h2>
          <div className="flex flex-wrap gap-2">
            {matchingDrills.map((drill) => (
              <Button
                key={drill.id}
                variant="secondary"
                size="sm"
                onClick={() => navigate("/train")}
              >
                <span>&#9201;&#65039;</span> {drill.name}
                {drill.difficulty && (
                  <Badge color={drill.difficulty === "beginner" ? "green" : drill.difficulty === "intermediate" ? "orange" : "red"}>
                    {DIFFICULTY_LABELS[drill.difficulty]}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Lernpfad */}
      {(prerequisiteCards.length > 0 || nextStepCards.length > 0) && (
        <motion.div
          className="rounded-xl border border-accent/20 bg-accent-dim p-5"
          custom={7}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="mb-3 text-base font-bold text-accent">
            Lernpfad
          </h2>

          {prerequisiteCards.length > 0 && (
            <div className="mb-3">
              <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-text-dim">
                Voraussetzungen
              </h3>
              <div className="flex flex-wrap gap-2">
                {prerequisiteCards.map((c) => (
                  <Button
                    key={c.id}
                    variant="secondary"
                    size="sm"
                    onClick={() => onNavigateToCard?.(c)}
                  >
                    &larr; {c.title}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {nextStepCards.length > 0 && (
            <div>
              <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-text-dim">
                Naechste Schritte
              </h3>
              <div className="flex flex-wrap gap-2">
                {nextStepCards.map((c) => (
                  <Button
                    key={c.id}
                    variant="secondary"
                    size="sm"
                    onClick={() => onNavigateToCard?.(c)}
                  >
                    {c.title} &rarr;
                  </Button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
