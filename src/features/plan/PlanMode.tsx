import { useState, useRef } from "react";
import type { MatchPlan } from "../../domain/models/MatchPlan";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import MatchPlanEditor from "./MatchPlanEditor";
import MatchPlanList from "./MatchPlanList";

function createEmptyPlan(): MatchPlan {
  return {
    id: crypto.randomUUID(),
    opponent: "",
    date: new Date().toISOString().slice(0, 10),
    analysis: "",
    gameplan: "",
    timeoutStrategies: [],
    notes: "",
    offensiveStrategy: "",
    defensiveStrategy: "",
  };
}

export default function PlanMode() {
  const [plans, setPlans] = useLocalStorage<MatchPlan[]>(
    "kickercoach-matchplans",
    [],
  );
  const [editingPlan, setEditingPlan] = useState<MatchPlan | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNew = () => {
    setEditingPlan(createEmptyPlan());
  };

  const handleSave = () => {
    if (!editingPlan) return;
    setPlans((prev) => {
      const existing = prev.findIndex((p) => p.id === editingPlan.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = editingPlan;
        return updated;
      }
      return [...prev, editingPlan];
    });
    setEditingPlan(null);
  };

  const handleDelete = (id: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  const handleExport = (plan: MatchPlan) => {
    const json = JSON.stringify(plan, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `matchplan-${plan.opponent || "plan"}-${plan.date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const plan = JSON.parse(event.target?.result as string) as MatchPlan;
        plan.id = crypto.randomUUID();
        setPlans((prev) => [...prev, plan]);
      } catch {
        // Invalid JSON
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (editingPlan) {
    return (
      <MatchPlanEditor
        plan={editingPlan}
        onChange={setEditingPlan}
        onSave={handleSave}
        onCancel={() => setEditingPlan(null)}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Plan Mode</h1>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-xl border border-border px-4 py-2 text-sm text-text-muted hover:border-accent/50 transition-all"
          >
            Import
          </button>
          <button
            onClick={handleNew}
            className="rounded-xl border-2 border-accent bg-accent-dim px-4 py-2 text-sm font-semibold text-accent-hover hover:bg-accent hover:text-white transition-all"
          >
            + Neuer Plan
          </button>
        </div>
      </div>

      <MatchPlanList
        plans={plans}
        onSelect={setEditingPlan}
        onDelete={handleDelete}
        onExport={handleExport}
      />
    </div>
  );
}
