import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store";

const ACTIONS = [
  { label: "Notiz", icon: "\u{1F4DD}", action: "note" as const },
  { label: "Training", icon: "\u23F1\uFE0F", action: "training" as const },
  { label: "Bewertung", icon: "\u2B50", action: "evaluation" as const },
];

export default function QuickActionFAB() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [notePlayerId, setNotePlayerId] = useState("");
  const [noteCategory, setNoteCategory] = useState<"tactical" | "technical" | "mental" | "communication">("technical");
  const players = useAppStore((s) => s.players);
  const addCoachingNote = useAppStore((s) => s.addCoachingNote);
  const fabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleAction = (action: "note" | "training" | "evaluation") => {
    setOpen(false);
    switch (action) {
      case "note":
        setShowNoteForm(true);
        break;
      case "training":
        navigate("/train");
        break;
      case "evaluation":
        navigate("/players");
        break;
    }
  };

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    addCoachingNote({
      id: crypto.randomUUID(),
      playerId: notePlayerId || undefined,
      date: new Date().toISOString().slice(0, 10),
      category: noteCategory,
      text: noteText.trim(),
    });
    setNoteText("");
    setNotePlayerId("");
    setShowNoteForm(false);
  };

  return (
    <>
      {/* Quick Note Sheet */}
      {showNoteForm && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowNoteForm(false)}
          />
          <div className="fixed bottom-24 left-3 right-3 z-50 rounded-2xl border border-border bg-surface p-4 shadow-xl md:left-auto md:right-6 md:w-80">
            <h3 className="mb-3 text-sm font-bold text-text">Schnelle Notiz</h3>
            <textarea
              autoFocus
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Coaching-Beobachtung..."
              className="mb-2 w-full rounded-lg border border-border bg-card p-2 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none"
              rows={3}
            />
            <div className="mb-2 flex gap-2">
              <select
                value={noteCategory}
                onChange={(e) => setNoteCategory(e.target.value as typeof noteCategory)}
                className="flex-1 rounded-lg border border-border bg-card px-2 py-1.5 text-xs text-text"
              >
                <option value="technical">Technisch</option>
                <option value="tactical">Taktisch</option>
                <option value="mental">Mental</option>
                <option value="communication">Kommunikation</option>
              </select>
              {players.length > 0 && (
                <select
                  value={notePlayerId}
                  onChange={(e) => setNotePlayerId(e.target.value)}
                  className="flex-1 rounded-lg border border-border bg-card px-2 py-1.5 text-xs text-text"
                >
                  <option value="">Kein Spieler</option>
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNoteForm(false)}
                className="rounded-lg px-3 py-1.5 text-xs text-text-muted hover:text-text"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSaveNote}
                disabled={!noteText.trim()}
                className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
              >
                Speichern
              </button>
            </div>
          </div>
        </>
      )}

      {/* FAB */}
      <div ref={fabRef} className="fixed bottom-20 right-4 z-30 md:bottom-6 md:right-6">
        {/* Expanded actions */}
        {open && (
          <div className="mb-3 flex flex-col items-end gap-2 animate-slide-up">
            {ACTIONS.map((a) => (
              <button
                key={a.action}
                onClick={() => handleAction(a.action)}
                className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text shadow-lg transition-all hover:bg-card-hover"
              >
                <span>{a.icon}</span>
                {a.label}
              </button>
            ))}
          </div>
        )}

        {/* Main FAB button */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-2xl text-white shadow-lg transition-all hover:bg-accent-hover hover:scale-105 active:scale-95"
          aria-label="Quick Actions"
        >
          {open ? "\u2716" : "+"}
        </button>
      </div>
    </>
  );
}
