import { useState } from "react";
import type { CoachingNote } from "../../domain/models/CoachingNote";
import { useAppStore } from "../../store";
import { Badge, Card, EmptyState, ConfirmDialog, Textarea, Button, Select } from "../../components/ui";
import {
  NOTE_CATEGORY_COLORS,
  NOTE_PRIORITY_COLORS,
} from "../../domain/constants";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const deleteCoachingNote = useAppStore((s) => s.deleteCoachingNote);
  const updateCoachingNote = useAppStore((s) => s.updateCoachingNote);
  const [filter, setFilter] = useState<CoachingNote["category"] | "all">("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editCategory, setEditCategory] = useState<CoachingNote["category"]>("technical");

  const filtered =
    filter === "all" ? notes : notes.filter((n) => n.category === filter);
  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date));

  function startEdit(note: CoachingNote) {
    setEditingId(note.id);
    setEditText(note.text);
    setEditCategory(note.category);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditText("");
  }

  function saveEdit() {
    if (editingId && editText.trim()) {
      updateCoachingNote(editingId, {
        text: editText.trim(),
        category: editCategory,
      });
      cancelEdit();
    }
  }

  function toggleResolved(note: CoachingNote) {
    updateCoachingNote(note.id, { resolved: !note.resolved });
  }

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
            {opt === "all" ? "Alle" : t(`constants.noteCategory.${opt}`)}
          </button>
        ))}
        <span className="ml-auto text-[10px] text-text-dim self-center">
          {filtered.length} Notizen
        </span>
      </div>

      {/* Notes */}
      {sorted.map((note) => {
        const isEditing = editingId === note.id;

        return (
          <Card key={note.id} className={note.resolved ? "opacity-60" : ""}>
            {isEditing ? (
              /* Edit Mode */
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Select
                    value={editCategory}
                    onChange={(e) =>
                      setEditCategory(e.target.value as CoachingNote["category"])
                    }
                    className="!w-36"
                  >
                    <option value="tactical">Taktisch</option>
                    <option value="technical">Technisch</option>
                    <option value="mental">Mental</option>
                    <option value="communication">Kommunikation</option>
                  </Select>
                  <span className="text-[10px] text-text-dim">{note.date}</span>
                </div>
                <Textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={3}
                  className="!min-h-[60px]"
                />
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="secondary" onClick={cancelEdit}>
                    Abbrechen
                  </Button>
                  <Button size="sm" onClick={saveEdit} disabled={!editText.trim()}>
                    Speichern
                  </Button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge color={NOTE_CATEGORY_COLORS[note.category]}>
                      {t(`constants.noteCategory.${note.category}`)}
                    </Badge>
                    {note.priority && (
                      <Badge color={NOTE_PRIORITY_COLORS[note.priority]}>
                        {t(`constants.notePriority.${note.priority}`)}
                      </Badge>
                    )}
                    {note.resolved && (
                      <Badge color="green">
                        &#10003; Erledigt
                      </Badge>
                    )}
                    <span className="text-[10px] text-text-dim">{note.date}</span>
                  </div>
                  <p
                    className={`mt-1 text-xs text-text-muted ${
                      note.resolved ? "line-through" : ""
                    }`}
                  >
                    {note.text}
                  </p>
                  {note.tags && note.tags.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-surface-alt px-2 py-0.5 text-[10px] text-text-dim"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleResolved(note)}
                    className={`text-[12px] transition-colors ${
                      note.resolved
                        ? "text-kicker-green hover:text-text-dim"
                        : "text-text-dim hover:text-kicker-green"
                    }`}
                    title={note.resolved ? "Als offen markieren" : "Als erledigt markieren"}
                  >
                    &#10003;
                  </button>
                  <button
                    onClick={() => startEdit(note)}
                    className="text-[11px] text-text-dim hover:text-accent transition-colors"
                    title="Bearbeiten"
                  >
                    &#9998;
                  </button>
                  <button
                    onClick={() => setDeleteId(note.id)}
                    className="text-[10px] text-text-dim hover:text-kicker-red transition-colors"
                    title="L&ouml;schen"
                  >
                    &#10005;
                  </button>
                </div>
              </div>
            )}
          </Card>
        );
      })}

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
