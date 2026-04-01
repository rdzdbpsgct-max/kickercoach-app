import { Card, Badge } from "../ui";
import type { CoachingNote, NotePriority } from "../../domain/models/CoachingNote";

const CATEGORY_LABELS: Record<string, string> = {
  tactical: "Taktik",
  technical: "Technik",
  mental: "Mental",
  communication: "Kommunikation",
};

const CATEGORY_BADGE_COLORS: Record<string, "orange" | "blue" | "accent" | "green"> = {
  tactical: "orange",
  technical: "blue",
  mental: "accent",
  communication: "green",
};

const PRIORITY_LABELS: Record<NotePriority, string> = {
  low: "Niedrig",
  medium: "Mittel",
  high: "Hoch",
};

const PRIORITY_COLORS: Record<NotePriority, "green" | "orange" | "red"> = {
  low: "green",
  medium: "orange",
  high: "red",
};

interface NoteCardProps {
  note: CoachingNote;
  playerName?: string;
  onClick?: () => void;
}

export function NoteCard({ note, playerName, onClick }: NoteCardProps) {
  return (
    <Card interactive={!!onClick} onClick={onClick}>
      <div className="flex flex-col gap-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge color={CATEGORY_BADGE_COLORS[note.category]}>
            {CATEGORY_LABELS[note.category]}
          </Badge>
          {note.priority && (
            <Badge color={PRIORITY_COLORS[note.priority]}>
              {PRIORITY_LABELS[note.priority]}
            </Badge>
          )}
          <span className="text-[10px] text-text-dim">{note.date}</span>
          {playerName && (
            <Badge color="blue">{playerName}</Badge>
          )}
          {note.resolved && (
            <span className="text-[10px] font-medium text-kicker-green">
              Erledigt
            </span>
          )}
        </div>
        <p className="line-clamp-2 text-xs text-text-muted">{note.text}</p>
        {note.tags && note.tags.length > 0 && (
          <div className="mt-0.5 flex flex-wrap gap-1">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] text-text-dim"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
