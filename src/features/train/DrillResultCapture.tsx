import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { Drill } from "../../domain/models/Drill";
import { Button, Textarea, StarRating } from "../../components/ui";

interface DrillResultCaptureProps {
  drill: Drill;
  onSave: (result: { rating: number; notes?: string }) => void;
  onSkip: () => void;
}

export default function DrillResultCapture({
  drill,
  onSave,
  onSkip,
}: DrillResultCaptureProps) {
  const { t } = useTranslation(["train", "common"]);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");

  const handleSave = useCallback(() => {
    if (rating === 0) return;
    onSave({ rating, notes: notes.trim() || undefined });
  }, [rating, notes, onSave]);

  return (
    <motion.div
      key="result-capture"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center gap-5 w-full max-w-sm"
    >
      <div className="text-center">
        <div className="text-lg font-bold text-kicker-green mb-1">
          {t("drillResultCapture.drillCompleted")}
        </div>
        <div className="text-sm text-text-muted">{drill.name}</div>
      </div>

      <div className="w-full rounded-xl border border-border bg-card p-4 flex flex-col gap-4">
        <div className="text-sm font-semibold text-text">{t("drillResultCapture.captureResult")}</div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-dim">{t("drillResultCapture.qualityLabel")}</label>
          <StarRating rating={rating} size="lg" onChange={setRating} />
          <div className="text-[11px] text-text-dim">
            {rating === 0 ? t("drillResultCapture.chooseRating") : t(`constants.star.${rating}`, { ns: "common" })}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-dim">
            {t("drillResultCapture.noteLabel")}
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value.slice(0, 200))}
            placeholder={t("drillResultCapture.notePlaceholder")}
            rows={2}
          />
          <div className="text-[10px] text-text-dim text-right">
            {t("drillResultCapture.charCount", { current: notes.length, max: 200 })}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onSkip}
            className="text-xs text-text-dim hover:text-text transition-colors"
          >
            {t("drillResultCapture.skip")}
          </button>
          <Button onClick={handleSave} disabled={rating === 0}>
            {t("drillResultCapture.save")}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
