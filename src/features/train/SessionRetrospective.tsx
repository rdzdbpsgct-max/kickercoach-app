import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, FormField, Textarea, Card } from "../../components/ui";
import type { SessionRetrospective as SessionRetro } from "../../domain/models/Session";

interface SessionRetrospectiveFormProps {
  initial?: SessionRetro;
  onSave: (retro: SessionRetro) => void;
  onSkip?: () => void;
}

export function SessionRetrospectiveForm({
  initial,
  onSave,
  onSkip,
}: SessionRetrospectiveFormProps) {
  const { t } = useTranslation("train");
  const [whatWentWell, setWhatWentWell] = useState(initial?.whatWentWell ?? "");
  const [whatToImprove, setWhatToImprove] = useState(
    initial?.whatToImprove ?? "",
  );
  const [focusNextTime, setFocusNextTime] = useState(
    initial?.focusNextTime ?? "",
  );

  const handleSave = () => {
    onSave({
      whatWentWell: whatWentWell.trim(),
      whatToImprove: whatToImprove.trim(),
      focusNextTime: focusNextTime.trim(),
    });
  };

  const hasContent = whatWentWell.trim() || whatToImprove.trim() || focusNextTime.trim();

  return (
    <Card>
      <h3 className="mb-3 text-sm font-semibold text-text">
        {t("sessionRetrospective.formTitle")}
      </h3>
      <div className="flex flex-col gap-3">
        <FormField label={t("sessionRetrospective.whatWentWellLabel")}>
          <Textarea
            value={whatWentWell}
            onChange={(e) => setWhatWentWell(e.target.value)}
            placeholder={t("sessionRetrospective.whatWentWellPlaceholder")}
            rows={2}
          />
        </FormField>
        <FormField label={t("sessionRetrospective.whatToImproveLabel")}>
          <Textarea
            value={whatToImprove}
            onChange={(e) => setWhatToImprove(e.target.value)}
            placeholder={t("sessionRetrospective.whatToImprovePlaceholder")}
            rows={2}
          />
        </FormField>
        <FormField label={t("sessionRetrospective.focusNextTimeLabel")}>
          <Textarea
            value={focusNextTime}
            onChange={(e) => setFocusNextTime(e.target.value)}
            placeholder={t("sessionRetrospective.focusNextTimePlaceholder")}
            rows={2}
          />
        </FormField>
        <div className="flex justify-end gap-2">
          {onSkip && (
            <Button variant="secondary" size="sm" onClick={onSkip}>
              {t("sessionRetrospective.skipBtn")}
            </Button>
          )}
          <Button size="sm" onClick={handleSave} disabled={!hasContent}>
            {t("sessionRetrospective.saveBtn")}
          </Button>
        </div>
      </div>
    </Card>
  );
}

interface SessionRetrospectiveViewProps {
  retrospective: SessionRetro;
}

export function SessionRetrospectiveView({
  retrospective,
}: SessionRetrospectiveViewProps) {
  const { t } = useTranslation("train");

  return (
    <Card>
      <h3 className="mb-2 text-sm font-semibold text-text">{t("sessionRetrospective.viewTitle")}</h3>
      <div className="flex flex-col gap-2 text-xs">
        {retrospective.whatWentWell && (
          <div>
            <span className="font-medium text-kicker-green">{t("sessionRetrospective.whatWentWellView")}</span>
            <p className="mt-0.5 text-text-muted">{retrospective.whatWentWell}</p>
          </div>
        )}
        {retrospective.whatToImprove && (
          <div>
            <span className="font-medium text-kicker-orange">{t("sessionRetrospective.whatToImproveView")}</span>
            <p className="mt-0.5 text-text-muted">{retrospective.whatToImprove}</p>
          </div>
        )}
        {retrospective.focusNextTime && (
          <div>
            <span className="font-medium text-accent">{t("sessionRetrospective.focusNextTimeView")}</span>
            <p className="mt-0.5 text-text-muted">{retrospective.focusNextTime}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
