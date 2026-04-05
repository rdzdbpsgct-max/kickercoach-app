import { useState } from "react";
import { z } from "zod";
import type { Drill, TrainingBlock, BlockType, DrillPhase, RodPosition } from "../../domain/models/Drill";
import type { Difficulty, Category } from "../../domain/models/CoachCard";
import { useTranslation } from "react-i18next";
import { Button, FormField, Input, Textarea, Select } from "../../components/ui";
import { useAppStore } from "../../store";
import { generateId } from "../../utils/id";

const EMPTY_BLOCK: TrainingBlock = { type: "work", durationSeconds: 30, note: "" };

interface DrillEditorProps {
  drill?: Drill;
  onSave: (drill: Drill) => void;
  onCancel: () => void;
}

export default function DrillEditor({ drill, onSave, onCancel }: DrillEditorProps) {
  const { t } = useTranslation(["train", "common"]);
  const saveDrillAsTemplate = useAppStore((s) => s.saveDrillAsTemplate);
  const [templateSaved, setTemplateSaved] = useState(false);
  const [name, setName] = useState(drill?.name ?? "");
  const [focusSkill, setFocusSkill] = useState(drill?.focusSkill ?? "");
  const [description, setDescription] = useState(drill?.description ?? "");
  const [difficulty, setDifficulty] = useState<Difficulty>(drill?.difficulty ?? "beginner");
  const [category, setCategory] = useState<Category | "">(drill?.category ?? "");
  const [phase, setPhase] = useState<DrillPhase | "">(drill?.phase ?? "");
  const [position, setPosition] = useState<RodPosition | "">(drill?.position ?? "");
  const [measurableGoal, setMeasurableGoal] = useState(drill?.measurableGoal ?? "");
  const [blocks, setBlocks] = useState<TrainingBlock[]>(
    drill?.blocks ?? [{ ...EMPTY_BLOCK }],
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const DrillFormSchema = z.object({
    name: z.string().min(1, t("drillEditor.validation.nameRequired")),
    focusSkill: z.string().min(1, t("drillEditor.validation.focusSkillRequired")),
    blocks: z.array(z.object({
      type: z.enum(["work", "rest", "repetitions"]),
      durationSeconds: z.number().min(0),
      repetitions: z.number().min(1).optional(),
      note: z.string(),
    })).min(1, t("drillEditor.validation.blocksRequired")),
  });

  const addBlock = () => setBlocks([...blocks, { ...EMPTY_BLOCK }]);

  const removeBlock = (index: number) => {
    if (blocks.length <= 1) return;
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const updateBlock = (index: number, updates: Partial<TrainingBlock>) => {
    setBlocks(blocks.map((b, i) => (i === index ? { ...b, ...updates } : b)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = DrillFormSchema.safeParse({
      name: name.trim(),
      focusSkill: focusSkill.trim(),
      blocks,
    });
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
      id: drill?.id ?? generateId(),
      name: name.trim(),
      focusSkill: focusSkill.trim(),
      description: description.trim() || undefined,
      difficulty,
      category: category || undefined,
      phase: phase || undefined,
      position: position || undefined,
      measurableGoal: measurableGoal.trim() || undefined,
      blocks,
      isCustom: true,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-5 overflow-auto pb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">
          {drill ? t("drillEditor.editTitle") : t("drillEditor.newTitle")}
        </h2>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            {t("drillEditor.cancel")}
          </Button>
          {drill && (
            <Button
              type="button"
              variant="secondary"
              disabled={templateSaved}
              onClick={() => {
                saveDrillAsTemplate({
                  ...drill,
                  name: name.trim() || drill.name,
                  blocks,
                  difficulty,
                  category: category || undefined,
                });
                setTemplateSaved(true);
              }}
            >
              {templateSaved ? t("drillEditor.templateSaved") : t("drillEditor.saveAsTemplate")}
            </Button>
          )}
          <Button type="submit">{t("drillEditor.save")}</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField label={t("drillEditor.nameLabel")} required error={errors.name}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("drillEditor.namePlaceholder")}
            error={errors.name}
          />
        </FormField>
        <FormField label={t("drillEditor.focusSkillLabel")} required error={errors.focusSkill}>
          <Input
            value={focusSkill}
            onChange={(e) => setFocusSkill(e.target.value)}
            placeholder={t("drillEditor.focusSkillPlaceholder")}
            error={errors.focusSkill}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <FormField label={t("drillEditor.difficultyLabel")}>
          <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
            <option value="beginner">{t("drillEditor.beginner")}</option>
            <option value="intermediate">{t("drillEditor.intermediate")}</option>
            <option value="advanced">{t("drillEditor.advanced")}</option>
          </Select>
        </FormField>
        <FormField label={t("drillEditor.categoryLabel")}>
          <Select value={category} onChange={(e) => setCategory(e.target.value as Category | "")}>
            <option value="">{t("drillEditor.none")}</option>
            <option value="Torschuss">Torschuss</option>
            <option value="Passspiel">Passspiel</option>
            <option value="Ballkontrolle">Ballkontrolle</option>
            <option value="Defensive">Defensive</option>
            <option value="Taktik">Taktik</option>
            <option value="Offensive">Offensive</option>
            <option value="Mental">Mental</option>
          </Select>
        </FormField>
        <FormField label={t("drillEditor.phaseLabel")}>
          <Select value={phase} onChange={(e) => setPhase(e.target.value as DrillPhase | "")}>
            <option value="">{t("drillEditor.none")}</option>
            {(["warmup", "technique", "game", "cooldown"] as DrillPhase[]).map((k) => (
              <option key={k} value={k}>{t(`constants.phase.${k}`, { ns: "common" })}</option>
            ))}
          </Select>
        </FormField>
        <FormField label={t("drillEditor.positionLabel")}>
          <Select value={position} onChange={(e) => setPosition(e.target.value as RodPosition | "")}>
            <option value="">{t("drillEditor.none")}</option>
            {(["keeper", "defense", "midfield", "offense"] as RodPosition[]).map((k) => (
              <option key={k} value={k}>{t(`constants.rodPosition.${k}`, { ns: "common" })}</option>
            ))}
          </Select>
        </FormField>
      </div>

      <FormField label={t("drillEditor.descriptionLabel")}>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t("drillEditor.descriptionPlaceholder")}
          rows={2}
        />
      </FormField>

      <FormField label={t("drillEditor.measurableGoalLabel")}>
        <Input
          value={measurableGoal}
          onChange={(e) => setMeasurableGoal(e.target.value)}
          placeholder={t("drillEditor.measurableGoalPlaceholder")}
        />
      </FormField>

      {/* Blocks */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-text-dim">
            {t("drillEditor.blocksLabel", { count: blocks.length })}
          </label>
          <Button type="button" variant="secondary" size="sm" onClick={addBlock}>
            {t("drillEditor.addBlock")}
          </Button>
        </div>
        {blocks.map((block, i) => (
          <div
            key={i}
            className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3"
          >
            <span className="text-xs font-semibold text-text-dim w-6">
              {i + 1}.
            </span>
            <Select
              value={block.type}
              onChange={(e) => {
                const newType = e.target.value as BlockType;
                updateBlock(i, {
                  type: newType,
                  repetitions: newType === "repetitions" ? (block.repetitions ?? 10) : undefined,
                });
              }}
              className="!w-32"
            >
              <option value="work">{t("drillEditor.blockTypeWork")}</option>
              <option value="rest">{t("drillEditor.blockTypeRest")}</option>
              <option value="repetitions">{t("drillEditor.blockTypeRepetitions")}</option>
            </Select>
            {block.type === "repetitions" ? (
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  min={1}
                  value={block.repetitions ?? 10}
                  onChange={(e) =>
                    updateBlock(i, { repetitions: Math.max(1, Number(e.target.value)) })
                  }
                  className="!w-20 text-center"
                />
                <span className="text-xs text-text-dim">{t("drillEditor.reps")}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  min={1}
                  value={block.durationSeconds}
                  onChange={(e) =>
                    updateBlock(i, { durationSeconds: Math.max(1, Number(e.target.value)) })
                  }
                  className="!w-20 text-center"
                />
                <span className="text-xs text-text-dim">{t("drillEditor.seconds")}</span>
              </div>
            )}
            <Input
              value={block.note}
              onChange={(e) => updateBlock(i, { note: e.target.value })}
              placeholder={t("drillEditor.notePlaceholder")}
              className="min-w-0 flex-1"
            />
            {blocks.length > 1 && (
              <button
                type="button"
                onClick={() => removeBlock(i)}
                className="text-xs text-text-dim hover:text-kicker-red transition-colors"
              >
                &#10005;
              </button>
            )}
          </div>
        ))}
      </div>
    </form>
  );
}
