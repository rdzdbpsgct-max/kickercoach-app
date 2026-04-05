import { useState, useRef } from "react";
import { motion } from "framer-motion";
import type { MatchPlan } from "../../domain/models/MatchPlan";
import { useAppStore } from "../../store";
import { Button } from "../../components/ui";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

export default function PlanMode() {
  const matchPlans = useAppStore((s) => s.matchPlans);
  const addMatchPlan = useAppStore((s) => s.addMatchPlan);
  const updateMatchPlan = useAppStore((s) => s.updateMatchPlan);
  const deleteMatchPlan = useAppStore((s) => s.deleteMatchPlan);
  const [editingPlan, setEditingPlan] = useState<MatchPlan | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNew = () => {
    setEditingPlan(createEmptyPlan());
  };

  const handleSave = () => {
    if (!editingPlan) return;
    const existing = matchPlans.find((p) => p.id === editingPlan.id);
    if (existing) {
      updateMatchPlan(editingPlan.id, editingPlan);
    } else {
      addMatchPlan(editingPlan);
    }
    setEditingPlan(null);
  };

  const handleDelete = (id: string) => {
    deleteMatchPlan(id);
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
        const data = JSON.parse(event.target?.result as string);
        if (
          !data ||
          typeof data !== "object" ||
          typeof data.opponent !== "string" ||
          typeof data.date !== "string"
        ) {
          alert("Ungueltige Matchplan-Datei. Bitte eine gueltige JSON-Datei waehlen.");
          return;
        }
        const plan = data as MatchPlan;
        plan.id = crypto.randomUUID();
        addMatchPlan(plan);
      } catch {
        alert("Die Datei konnte nicht gelesen werden. Bitte eine gueltige JSON-Datei waehlen.");
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
    <motion.div
      className="flex flex-1 flex-col gap-4 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between"
      >
        <h1 className="text-xl font-bold">Matchplan</h1>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <Button
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            Import
          </Button>
          <Button onClick={handleNew}>+ Neuer Plan</Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <MatchPlanList
          plans={matchPlans}
          onSelect={setEditingPlan}
          onDelete={handleDelete}
          onExport={handleExport}
        />
      </motion.div>
    </motion.div>
  );
}
