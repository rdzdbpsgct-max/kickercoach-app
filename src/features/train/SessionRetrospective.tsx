import { useState } from "react";
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
        Session-Retrospektive
      </h3>
      <div className="flex flex-col gap-3">
        <FormField label="Was lief gut?">
          <Textarea
            value={whatWentWell}
            onChange={(e) => setWhatWentWell(e.target.value)}
            placeholder="z.B. Pin-Shot-Quote deutlich verbessert..."
            rows={2}
          />
        </FormField>
        <FormField label="Was muss besser werden?">
          <Textarea
            value={whatToImprove}
            onChange={(e) => setWhatToImprove(e.target.value)}
            placeholder="z.B. Brush-Pass von der 5er noch zu ungenau..."
            rows={2}
          />
        </FormField>
        <FormField label="Fokus naechstes Mal">
          <Textarea
            value={focusNextTime}
            onChange={(e) => setFocusNextTime(e.target.value)}
            placeholder="z.B. Mehr an der 5er-Kontrolle arbeiten..."
            rows={2}
          />
        </FormField>
        <div className="flex justify-end gap-2">
          {onSkip && (
            <Button variant="secondary" size="sm" onClick={onSkip}>
              Ueberspringen
            </Button>
          )}
          <Button size="sm" onClick={handleSave} disabled={!hasContent}>
            Retrospektive speichern
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
  return (
    <Card>
      <h3 className="mb-2 text-sm font-semibold text-text">Retrospektive</h3>
      <div className="flex flex-col gap-2 text-xs">
        {retrospective.whatWentWell && (
          <div>
            <span className="font-medium text-kicker-green">Was lief gut:</span>
            <p className="mt-0.5 text-text-muted">{retrospective.whatWentWell}</p>
          </div>
        )}
        {retrospective.whatToImprove && (
          <div>
            <span className="font-medium text-kicker-orange">Was muss besser werden:</span>
            <p className="mt-0.5 text-text-muted">{retrospective.whatToImprove}</p>
          </div>
        )}
        {retrospective.focusNextTime && (
          <div>
            <span className="font-medium text-accent">Fokus naechstes Mal:</span>
            <p className="mt-0.5 text-text-muted">{retrospective.focusNextTime}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
