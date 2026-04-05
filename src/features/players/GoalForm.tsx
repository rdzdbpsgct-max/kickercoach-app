import { useState } from "react";
import { z } from "zod";
import { Button, FormField, Input, Textarea, Select } from "../../components/ui";
import { CategorySchema } from "../../domain/schemas/coachCard";
import { useTranslation } from "react-i18next";
import type { Category } from "../../domain/models/CoachCard";
import type { Goal } from "../../domain/models/Goal";
import { generateId } from "../../utils/id";

interface GoalFormProps {
  playerId: string;
  goal?: Goal;
  onSave: (goal: Goal) => void;
  onCancel: () => void;
}

export function GoalForm({ playerId, goal, onSave, onCancel }: GoalFormProps) {
  const { t } = useTranslation(["players", "common"]);

  const GoalFormSchema = z.object({
    title: z.string().min(1, t("goalForm.goalRequired")),
    description: z.string().optional(),
    category: CategorySchema,
    targetDate: z.string().optional(),
    targetValue: z.union([z.number().min(0, t("goalForm.targetValueError")), z.undefined()]),
    currentValue: z.union([z.number().min(0, t("goalForm.currentValueError")), z.undefined()]),
  });

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
    const tv = targetValue ? Number(targetValue) : undefined;
    const cv = currentValue ? Number(currentValue) : undefined;
    const result = GoalFormSchema.safeParse({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      targetDate: targetDate || undefined,
      targetValue: tv,
      currentValue: cv,
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
      id: goal?.id ?? generateId(),
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
      <FormField label={t("goalForm.goalLabel")} required error={errors.title}>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("goalForm.goalPlaceholder")}
          error={errors.title}
        />
      </FormField>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField label={t("goalForm.categoryLabel")}>
          <Select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
            <option value="Torschuss">{t("constants.category.Torschuss", { ns: "common" })}</option>
            <option value="Passspiel">{t("constants.category.Passspiel", { ns: "common" })}</option>
            <option value="Ballkontrolle">{t("constants.category.Ballkontrolle", { ns: "common" })}</option>
            <option value="Defensive">{t("constants.category.Defensive", { ns: "common" })}</option>
            <option value="Taktik">{t("constants.category.Taktik", { ns: "common" })}</option>
            <option value="Offensive">{t("constants.category.Offensive", { ns: "common" })}</option>
            <option value="Mental">{t("constants.category.Mental", { ns: "common" })}</option>
          </Select>
        </FormField>
        <FormField label={t("goalForm.targetDateLabel")}>
          <Input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField label={t("goalForm.targetValueLabel")}>
          <Input
            type="number"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
            placeholder={t("goalForm.targetValuePlaceholder")}
            min="0"
          />
        </FormField>
        <FormField label={t("goalForm.currentValueLabel")}>
          <Input
            type="number"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            placeholder={t("goalForm.currentValuePlaceholder")}
            min="0"
          />
        </FormField>
      </div>

      <FormField label={t("goalForm.descriptionLabel")}>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t("goalForm.descriptionPlaceholder")}
          rows={2}
        />
      </FormField>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
          {t("goalForm.cancel")}
        </Button>
        <Button type="submit" size="sm">
          {goal ? t("goalForm.save") : t("goalForm.create")}
        </Button>
      </div>
    </form>
  );
}
