import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { MatchPlan } from "../../domain/models/MatchPlan";
import { Card, Button, EmptyState, ConfirmDialog, SearchBar } from "../../components/ui";

interface MatchPlanListProps {
  plans: MatchPlan[];
  onSelect: (plan: MatchPlan) => void;
  onDelete: (id: string) => void;
  onExport: (plan: MatchPlan) => void;
}

export default function MatchPlanList({
  plans,
  onSelect,
  onDelete,
  onExport,
}: MatchPlanListProps) {
  const { t } = useTranslation("plan");
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return plans;
    const q = search.toLowerCase();
    return plans.filter(
      (p) =>
        p.opponent?.toLowerCase().includes(q) ||
        p.date?.toLowerCase().includes(q),
    );
  }, [plans, search]);

  if (plans.length === 0) {
    return (
      <EmptyState
        icon="&#128203;"
        title={t("list.emptyTitle")}
        description={t("list.emptyDescription")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-2 overflow-auto">
      <SearchBar value={search} onChange={setSearch} placeholder={t("list.searchPlaceholder")} />
      {filtered.map((plan) => (
        <Card key={plan.id} interactive>
          <div className="flex items-center justify-between">
            <button
              onClick={() => onSelect(plan)}
              className="flex-1 text-left"
            >
              <div className="text-sm font-semibold text-text">
                vs. {plan.opponent || t("list.unnamed")}
              </div>
              <div className="mt-0.5 text-xs text-text-dim">
                {plan.date || t("list.noDate")}{" "}
                &middot; {t("list.strategies", { count: plan.timeoutStrategies.length })}
              </div>
            </button>
            <div className="flex gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/board")}
                title={t("list.tacticsTooltip")}
              >
                {t("list.tactics")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onExport(plan)}
                title={t("list.exportTooltip")}
              >
                {t("list.export")}
              </Button>
              <button
                onClick={() => setDeleteId(plan.id)}
                className="rounded-lg border border-border px-2.5 py-1 text-xs text-text-dim hover:border-kicker-red/50 hover:text-kicker-red transition-all"
                title={t("list.deleteTooltip")}
              >
                &#10005;
              </button>
            </div>
          </div>
        </Card>
      ))}

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) onDelete(deleteId);
        }}
        title={t("list.deleteTitle")}
        message={t("list.deleteMessage")}
      />
    </div>
  );
}
