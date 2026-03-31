import { useState } from "react";
import { Button, FormField, Input, Textarea, Select } from "../../components/ui";
import type { Category } from "../../domain/models/CoachCard";
import type { Goal } from "../../domain/models/Goal";

interface GoalFormProps {
  playerId: string;
  goal?: Goal;
  onSave: (goal: Goal) => void;
  onCancel: () => void;
}

export function GoalForm({ playerId, goal, onSave, onCancel }: GoalFormProps) {
  const [title, setTitle] = useState(goal?.title ?? "");
  const [description, setDescription] = useState(goal?.description ?? "");
  const [category, setCategory] = useState<Category>(goal?.category ?? "Torschuss");
  const [targetDate, setTargetDate] = useState(goal?.targetDate ?? "");
  const [targetValue, setTargetValue] = useState<string>(
    goal?.targetValue != null ? String(goal.targetValue) : "",
  );
  const [currentValue, setCurrentValue] = useState<string>(
    goal?.currentValue != null ? String(goal.currentValue) : "",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Titel ist erforderlich";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const tv = targetValue ? Number(targetValue) : undefined;
    const cv = currentValue ? Number(currentValue) : undefined;

    onSave({
      id: goal?.id ?? crypto.randomUUID(),
      playerId,
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      targetValue: tv,
      currentValue: cv,
      targetDate: targetDate || undefined,
      status: goal?.status ?? "active",
      createdAt: goal?.createdAt ?? new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormField label="Ziel" required error={errors.title}>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="z.B. Pull-Shot-Quote auf 70% steigern"
          error={errors.title}
        />
      </FormField>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField label="Kategorie">
          <Select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
            <option value="Torschuss">Torschuss</option>
            <option value="Passspiel">Passspiel</option>
            <option value="Ballkontrolle">Ballkontrolle</option>
            <option value="Defensive">Defensive</option>
            <option value="Taktik">Taktik</option>
            <option value="Offensive">Offensive</option>
            <option value="Mental">Mental</option>
          </Select>
        </FormField>
        <FormField label="Zieldatum">
          <Input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField label="Zielwert (optional)">
          <Input
            type="number"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
            placeholder="z.B. 80 (fuer 80%)"
            min="0"
          />
        </FormField>
        <FormField label="Aktueller Wert (optional)">
          <Input
            type="number"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            placeholder="z.B. 45"
            min="0"
          />
        </FormField>
      </div>

      <FormField label="Beschreibung">
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Details zum Ziel..."
          rows={2}
        />
      </FormField>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
          Abbrechen
        </Button>
        <Button type="submit" size="sm">
          {goal ? "Speichern" : "Ziel anlegen"}
        </Button>
      </div>
    </form>
  );
}
