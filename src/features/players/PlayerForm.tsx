import { useState } from "react";
import { z } from "zod";
import { Button, FormField, Input, Textarea, Select } from "../../components/ui";
import { SkillRadar } from "./SkillRadar";
import { DEFAULT_SKILL_RATINGS, PositionSchema } from "../../domain/schemas/player";
import { DifficultySchema } from "../../domain/schemas/coachCard";
import { useTranslation } from "react-i18next";
import type { Player, Position, SkillRatings } from "../../domain/models/Player";
import type { Difficulty, Category } from "../../domain/models/CoachCard";
import { generateId } from "../../utils/id";

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
  const { t } = useTranslation(["players", "common"]);

  const PlayerFormSchema = z.object({
    name: z.string().min(1, t("form.nameRequired")),
    nickname: z.string().optional(),
    position: PositionSchema,
    level: DifficultySchema,
    notes: z.string(),
  });

  const [name, setName] = useState(player?.name ?? "");
  const [nickname, setNickname] = useState(player?.nickname ?? "");
  const [position, setPosition] = useState<Position>(player?.preferredPosition ?? "both");
  const [level, setLevel] = useState<Difficulty>(player?.level ?? "beginner");
  const [notes, setNotes] = useState(player?.notes ?? "");
  const [skillRatings, setSkillRatings] = useState<SkillRatings>(
    player?.skillRatings ?? { ...DEFAULT_SKILL_RATINGS },
  );
  const [isActive, setIsActive] = useState(player?.isActive ?? true);
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
      id: player?.id ?? generateId(),
      name: name.trim(),
      nickname: nickname.trim() || undefined,
      preferredPosition: position,
      isActive,
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
        <FormField label={t("form.nameLabel")} required error={errors.name}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("form.namePlaceholder")}
            error={errors.name}
          />
        </FormField>
        <FormField label={t("form.nicknameLabel")}>
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={t("form.nicknamePlaceholder")}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField label={t("form.positionLabel")}>
          <Select value={position} onChange={(e) => setPosition(e.target.value as Position)}>
            <option value="offense">{t("form.positionOffense")}</option>
            <option value="defense">{t("form.positionDefense")}</option>
            <option value="both">{t("form.positionBoth")}</option>
          </Select>
        </FormField>
        <FormField label={t("form.levelLabel")}>
          <Select value={level} onChange={(e) => setLevel(e.target.value as Difficulty)}>
            <option value="beginner">{t("form.levelBeginner")}</option>
            <option value="intermediate">{t("form.levelIntermediate")}</option>
            <option value="advanced">{t("form.levelAdvanced")}</option>
          </Select>
        </FormField>
      </div>

      <FormField label={t("form.statusLabel")}>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-border text-accent focus:ring-accent/30"
          />
          <span className="text-sm text-text">
            {isActive ? t("form.statusActive") : t("form.statusInactive")}
          </span>
        </label>
      </FormField>

      <FormField label={t("form.colorLabel")}>
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
              aria-label={t("form.colorAriaLabel", { color })}
            />
          ))}
        </div>
      </FormField>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-text">{t("form.skillProfile")}</h3>
        <SkillRadar ratings={skillRatings} editable onChange={handleSkillChange} />
      </div>

      <FormField label={t("form.notesLabel")}>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t("form.notesPlaceholder")}
          rows={3}
        />
      </FormField>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t("form.cancel")}
        </Button>
        <Button type="submit">
          {player ? t("form.save") : t("form.create")}
        </Button>
      </div>
    </form>
  );
}
