import { useState } from "react";
import type { CoachingNote } from "../../domain/models/CoachingNote";
import { useAppStore } from "../../store";
import { Button, Input, Select } from "../../components/ui";
import { useTranslation } from "react-i18next";
import { generateId } from "../../utils/id";

interface QuickNoteProps {
  playerId?: string;
  sessionId?: string;
  matchPlanId?: string;
}

export function QuickNote({ playerId, sessionId, matchPlanId }: QuickNoteProps) {
  const { t } = useTranslation("players");
  const addCoachingNote = useAppStore((s) => s.addCoachingNote);
  const [text, setText] = useState("");
  const [category, setCategory] = useState<CoachingNote["category"]>("technical");

  const handleSave = () => {
    if (!text.trim()) return;

    addCoachingNote({
      id: generateId(),
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
        <option value="tactical">{t("quickNote.categoryTactical")}</option>
        <option value="technical">{t("quickNote.categoryTechnical")}</option>
        <option value="mental">{t("quickNote.categoryMental")}</option>
        <option value="communication">{t("quickNote.categoryCommunication")}</option>
      </Select>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("quickNote.placeholder")}
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
