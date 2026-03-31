import { useState } from "react";
import type { Drill, TrainingBlock, BlockType, DrillPhase, RodPosition } from "../../domain/models/Drill";
import type { Difficulty, Category } from "../../domain/models/CoachCard";
import { PHASE_LABELS } from "../../domain/constants";
import { Button, FormField, Input, Textarea, Select } from "../../components/ui";
import { useAppStore } from "../../store";

const EMPTY_BLOCK: TrainingBlock = { type: "work", durationSeconds: 30, note: "" };

interface DrillEditorProps {
  drill?: Drill;
  onSave: (drill: Drill) => void;
  onCancel: () => void;
}

export default function DrillEditor({ drill, onSave, onCancel }: DrillEditorProps) {
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
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name ist erforderlich";
    if (!focusSkill.trim()) newErrors.focusSkill = "Fokus-Skill ist erforderlich";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: drill?.id ?? crypto.randomUUID(),
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
          {drill ? "Drill bearbeiten" : "Neuer Drill"}
        </h2>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Abbrechen
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
              {templateSaved ? "Vorlage gespeichert" : "Als Vorlage"}
            </Button>
          )}
          <Button type="submit">Speichern</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField label="Name" required error={errors.name}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Drill-Name"
            error={errors.name}
          />
        </FormField>
        <FormField label="Fokus-Skill" required error={errors.focusSkill}>
          <Input
            value={focusSkill}
            onChange={(e) => setFocusSkill(e.target.value)}
            placeholder="z.B. Pull-Shot, Tic-Tac..."
            error={errors.focusSkill}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <FormField label="Schwierigkeit">
          <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
            <option value="beginner">Anfaenger</option>
            <option value="intermediate">Fortgeschritten</option>
            <option value="advanced">Profi</option>
          </Select>
        </FormField>
        <FormField label="Kategorie">
          <Select value={category} onChange={(e) => setCategory(e.target.value as Category | "")}>
            <option value="">Keine</option>
            <option value="Torschuss">Torschuss</option>
            <option value="Passspiel">Passspiel</option>
            <option value="Ballkontrolle">Ballkontrolle</option>
            <option value="Defensive">Defensive</option>
            <option value="Taktik">Taktik</option>
            <option value="Offensive">Offensive</option>
            <option value="Mental">Mental</option>
          </Select>
        </FormField>
        <FormField label="Phase">
          <Select value={phase} onChange={(e) => setPhase(e.target.value as DrillPhase | "")}>
            <option value="">Keine</option>
            {(Object.entries(PHASE_LABELS) as [DrillPhase, string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </Select>
        </FormField>
        <FormField label="Position">
          <Select value={position} onChange={(e) => setPosition(e.target.value as RodPosition | "")}>
            <option value="">Keine</option>
            <option value="keeper">Torwart</option>
            <option value="defense">Abwehr</option>
            <option value="midfield">Mittelfeld</option>
            <option value="offense">Sturm</option>
          </Select>
        </FormField>
      </div>

      <FormField label="Beschreibung">
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optionale Beschreibung..."
          rows={2}
        />
      </FormField>

      <FormField label="Messbares Ziel">
        <Input
          value={measurableGoal}
          onChange={(e) => setMeasurableGoal(e.target.value)}
          placeholder="z.B. 8 von 10 Schuessen im Tor"
        />
      </FormField>

      {/* Blocks */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-text-dim">
            Bloecke ({blocks.length})
          </label>
          <Button type="button" variant="secondary" size="sm" onClick={addBlock}>
            + Block
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
              <option value="work">Training</option>
              <option value="rest">Pause</option>
              <option value="repetitions">Wiederholungen</option>
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
                <span className="text-xs text-text-dim">Wdh.</span>
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
                <span className="text-xs text-text-dim">Sek.</span>
              </div>
            )}
            <Input
              value={block.note}
              onChange={(e) => updateBlock(i, { note: e.target.value })}
              placeholder="Notiz..."
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
