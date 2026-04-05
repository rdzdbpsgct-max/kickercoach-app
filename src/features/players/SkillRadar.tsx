import { useTranslation } from "react-i18next";
import type { SkillRatings } from "../../domain/models/Player";
import { CATEGORY_BAR_COLORS } from "../../domain/constants";
import type { Category } from "../../domain/models/CoachCard";

const CATEGORIES: Category[] = [
  "Torschuss",
  "Passspiel",
  "Ballkontrolle",
  "Defensive",
  "Taktik",
  "Offensive",
  "Mental",
];

interface SkillRadarProps {
  ratings: SkillRatings;
  editable?: boolean;
  onChange?: (category: Category, value: number) => void;
}

export function SkillRadar({ ratings, editable = false, onChange }: SkillRadarProps) {
  const { t } = useTranslation(["players", "common"]);

  return (
    <div className="flex flex-col gap-2.5">
      {CATEGORIES.map((cat) => (
        <div key={cat} className="flex items-center gap-3">
          <span className="w-28 text-xs font-medium text-text-muted truncate">
            {t(`constants.category.${cat}`, { ns: "common" })}
          </span>
          <div className="flex flex-1 gap-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                disabled={!editable}
                onClick={() => editable && onChange?.(cat, level)}
                className={`h-6 flex-1 rounded transition-all ${
                  level <= ratings[cat]
                    ? CATEGORY_BAR_COLORS[cat]
                    : "bg-border/30"
                } ${editable ? "cursor-pointer hover:opacity-80" : "cursor-default"}`}
                aria-label={`${t(`constants.category.${cat}`, { ns: "common" })}: ${level}`}
              />
            ))}
          </div>
          <span className="w-6 text-center text-xs font-semibold text-text-muted">
            {ratings[cat]}
          </span>
        </div>
      ))}
    </div>
  );
}
