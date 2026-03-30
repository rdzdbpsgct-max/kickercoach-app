import { useState } from "react";
import type { CoachingNote } from "../../domain/models/CoachingNote";
import { useAppStore } from "../../store";
import { Button, Input, Select } from "../../components/ui";

const CATEGORIES = [
  { value: "tactical", label: "Taktisch" },
  { value: "technical", label: "Technisch" },
  { value: "mental", label: "Mental" },
  { value: "communication", label: "Kommunikation" },
] as const;

interface QuickNoteProps {
  playerId?: string;
  sessionId?: string;
  matchPlanId?: string;
}

export function QuickNote({ playerId, sessionId, matchPlanId }: QuickNoteProps) {
  const addCoachingNote = useAppStore((s) => s.addCoachingNote);
  const [text, setText] = useState("");
  const [category, setCategory] = useState<CoachingNote["category"]>("technical");

  const handleSave = () => {
    if (!text.trim()) return;

    addCoachingNote({
      id: crypto.randomUUID(),
      playerId,
      sessionId,
      matchPlanId,
      date: new Date().toISOString().slice(0, 10),
      category,
      text: text.trim(),
    });

    setText("");
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={category}
        onChange={(e) => setCategory(e.target.value as CoachingNote["category"])}
        className="!w-32"
      >
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </Select>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Schnellnotiz..."
        className="flex-1"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
        }}
      />
      <Button size="sm" onClick={handleSave} disabled={!text.trim()}>
        +
      </Button>
    </div>
  );
}
