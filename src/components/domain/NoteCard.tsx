import { motion } from "framer-motion";
import { Card, Badge } from "../ui";
import type { CoachingNote } from "../../domain/models/CoachingNote";
import {
  NOTE_CATEGORY_LABELS,
  NOTE_CATEGORY_COLORS,
  NOTE_PRIORITY_LABELS,
  NOTE_PRIORITY_COLORS,
} from "../../domain/constants";

interface NoteCardProps {
  note: CoachingNote;
  playerName?: string;
  onClick?: () => void;
}

export function NoteCard({ note, playerName, onClick }: NoteCardProps) {
  return (
    <Card interactive={!!onClick} onClick={onClick}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col gap-0.5"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge color={NOTE_CATEGORY_COLORS[note.category]}>
            {NOTE_CATEGORY_LABELS[note.category]}
          </Badge>
          {note.priority && (
            <Badge color={NOTE_PRIORITY_COLORS[note.priority]}>
              {NOTE_PRIORITY_LABELS[note.priority]}
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
      </motion.div>
    </Card>
  );
}
