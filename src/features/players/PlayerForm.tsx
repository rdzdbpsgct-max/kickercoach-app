import { useState } from "react";
import { z } from "zod";
import { Button, FormField, Input, Textarea, Select } from "../../components/ui";
import { SkillRadar } from "./SkillRadar";
import { DEFAULT_SKILL_RATINGS, PositionSchema } from "../../domain/schemas/player";
import { DifficultySchema } from "../../domain/schemas/coachCard";
import type { Player, Position, SkillRatings } from "../../domain/models/Player";
import type { Difficulty, Category } from "../../domain/models/CoachCard";

const PlayerFormSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich"),
  nickname: z.string().optional(),
  position: PositionSchema,
  level: DifficultySchema,
  notes: z.string(),
});

const AVATAR_COLORS = [
  "#3b82f6", "#ef4444", "#22c55e", "#f59e0b",
  "#6366f1", "#ec4899", "#14b8a6", "#f97316",
];

interface PlayerFormProps {
  player?: Player;
  onSave: (player: Player) => void;
  onCancel: () => void;
}

export function PlayerForm({ player, onSave, onCancel }: PlayerFormProps) {
  const [name, setName] = useState(player?.name ?? "");
  const [nickname, setNickname] = useState(player?.nickname ?? "");
  const [position, setPosition] = useState<Position>(player?.preferredPosition ?? "both");
  const [level, setLevel] = useState<Difficulty>(player?.level ?? "beginner");
  const [notes, setNotes] = useState(player?.notes ?? "");
  const [skillRatings, setSkillRatings] = useState<SkillRatings>(
    player?.skillRatings ?? { ...DEFAULT_SKILL_RATINGS },
  );
  const [avatarColor, setAvatarColor] = useState(
    player?.avatarColor ?? AVATAR_COLORS[0],
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = PlayerFormSchema.safeParse({ name: name.trim(), nickname: nickname.trim() || undefined, position, level, notes });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    onSave({
      id: player?.id ?? crypto.randomUUID(),
      name: name.trim(),
      nickname: nickname.trim() || undefined,
      preferredPosition: position,
      level,
      notes,
      skillRatings,
      avatarColor,
      createdAt: player?.createdAt ?? new Date().toISOString().slice(0, 10),
    });
  }

  function handleSkillChange(category: Category, value: number) {
    setSkillRatings((prev) => ({ ...prev, [category]: value }));
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 overflow-auto pb-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField label="Name" required error={errors.name}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Spielername"
            error={errors.name}
          />
        </FormField>
        <FormField label="Spitzname">
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Optional"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField label="Bevorzugte Position">
          <Select value={position} onChange={(e) => setPosition(e.target.value as Position)}>
            <option value="offense">Sturm</option>
            <option value="defense">Abwehr</option>
            <option value="both">Beides</option>
          </Select>
        </FormField>
        <FormField label="Niveau">
          <Select value={level} onChange={(e) => setLevel(e.target.value as Difficulty)}>
            <option value="beginner">Anf&auml;nger</option>
            <option value="intermediate">Fortgeschritten</option>
            <option value="advanced">Profi</option>
          </Select>
        </FormField>
      </div>

      <FormField label="Farbe">
        <div className="flex gap-2">
          {AVATAR_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setAvatarColor(color)}
              className={`h-8 w-8 rounded-full transition-all ${
                avatarColor === color ? "ring-2 ring-accent ring-offset-2 ring-offset-bg" : ""
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Farbe ${color}`}
            />
          ))}
        </div>
      </FormField>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-text">Skill-Profil</h3>
        <SkillRadar ratings={skillRatings} editable onChange={handleSkillChange} />
      </div>

      <FormField label="Notizen">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="St&auml;rken, Schw&auml;chen, Beobachtungen..."
          rows={3}
        />
      </FormField>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Abbrechen
        </Button>
        <Button type="submit">
          {player ? "Speichern" : "Spieler anlegen"}
        </Button>
      </div>
    </form>
  );
}
