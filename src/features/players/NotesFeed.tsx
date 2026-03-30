import { useState } from "react";
import type { CoachingNote } from "../../domain/models/CoachingNote";
import { useAppStore } from "../../store";
import { Badge, Card, EmptyState, ConfirmDialog } from "../../components/ui";

const CATEGORY_LABELS: Record<string, string> = {
  tactical: "Taktisch",
  technical: "Technisch",
  mental: "Mental",
  communication: "Kommunikation",
};

const CATEGORY_COLORS: Record<string, "blue" | "orange" | "green" | "accent"> = {
  tactical: "blue",
  technical: "orange",
  mental: "accent",
  communication: "green",
};

const FILTER_OPTIONS: (CoachingNote["category"] | "all")[] = [
  "all",
  "tactical",
  "technical",
  "mental",
  "communication",
];

interface NotesFeedProps {
  notes: CoachingNote[];
}

export function NotesFeed({ notes }: NotesFeedProps) {
  const deleteCoachingNote = useAppStore((s) => s.deleteCoachingNote);
  const [filter, setFilter] = useState<CoachingNote["category"] | "all">("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered =
    filter === "all" ? notes : notes.filter((n) => n.category === filter);
  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date));

  if (notes.length === 0) {
    return (
      <EmptyState
        icon="&#128221;"
        title="Keine Notizen"
        description="Nutze die Schnellnotiz oben, um Beobachtungen festzuhalten."
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Filter */}
      <div className="flex flex-wrap gap-1">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => setFilter(opt)}
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-all ${
              filter === opt
                ? "border-2 border-accent bg-accent-dim text-accent-hover"
                : "border border-border text-text-muted hover:border-accent/50"
            }`}
          >
            {opt === "all" ? "Alle" : CATEGORY_LABELS[opt]}
          </button>
        ))}
        <span className="ml-auto text-[10px] text-text-dim self-center">
          {filtered.length} Notizen
        </span>
      </div>

      {/* Notes */}
      {sorted.map((note) => (
        <Card key={note.id}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Badge color={CATEGORY_COLORS[note.category]}>
                  {CATEGORY_LABELS[note.category]}
                </Badge>
                <span className="text-[10px] text-text-dim">{note.date}</span>
              </div>
              <p className="mt-1 text-xs text-text-muted">{note.text}</p>
            </div>
            <button
              onClick={() => setDeleteId(note.id)}
              className="text-[10px] text-text-dim hover:text-kicker-red transition-colors"
            >
              &#10005;
            </button>
          </div>
        </Card>
      ))}

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteCoachingNote(deleteId);
        }}
        title="Notiz l&ouml;schen"
        message="M&ouml;chtest du diese Notiz wirklich l&ouml;schen?"
      />
    </div>
  );
}
