import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../store";

const ACTIONS = [
  { label: "Notiz", icon: "\u{1F4DD}", action: "note" as const },
  { label: "Training", icon: "\u23F1\uFE0F", action: "training" as const },
  { label: "Bewertung", icon: "\u2B50", action: "evaluation" as const },
];

export default function QuickActionFAB() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showPlayerPicker, setShowPlayerPicker] = useState(false);
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
        if (players.length === 1) {
          navigate(`/players/${players[0].id}`);
        } else if (players.length > 1) {
          setShowPlayerPicker(true);
        } else {
          navigate("/players/new");
        }
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
      <AnimatePresence>
        {showNoteForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowNoteForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-24 left-3 right-3 z-50 rounded-2xl border border-border bg-surface p-4 shadow-2xl md:left-auto md:right-6 md:w-80"
            >
              <h3 className="mb-3 text-sm font-bold text-text">Schnelle Notiz</h3>
              <textarea
                autoFocus
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Coaching-Beobachtung..."
                className="mb-2 w-full rounded-xl border border-border bg-card p-3 text-sm text-text placeholder:text-text-dim focus:border-accent focus:ring-1 focus:ring-accent/30 focus:outline-none transition-all"
                rows={3}
              />
              <div className="mb-3 flex gap-2">
                <select
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value as typeof noteCategory)}
                  className="flex-1 rounded-xl border border-border bg-card px-3 py-2 text-xs text-text focus:border-accent focus:outline-none"
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
                    className="flex-1 rounded-xl border border-border bg-card px-3 py-2 text-xs text-text focus:border-accent focus:outline-none"
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
                  className="rounded-xl px-4 py-2 text-xs font-medium text-text-muted hover:text-text hover:bg-surface-hover transition-all"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleSaveNote}
                  disabled={!noteText.trim()}
                  className="rounded-xl bg-accent px-4 py-2 text-xs font-bold text-bg disabled:opacity-50 hover:bg-accent-hover transition-all"
                >
                  Speichern
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Player Picker */}
      <AnimatePresence>
        {showPlayerPicker && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowPlayerPicker(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-24 left-3 right-3 z-50 rounded-2xl border border-border bg-surface p-4 shadow-2xl md:left-auto md:right-6 md:w-80"
            >
              <h3 className="mb-3 text-sm font-bold text-text">Spieler waehlen</h3>
              <div className="flex flex-col gap-1 max-h-60 overflow-auto">
                {players.map((p) => (
                  <motion.button
                    key={p.id}
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      setShowPlayerPicker(false);
                      navigate(`/players/${p.id}`);
                    }}
                    className="flex items-center gap-2 rounded-xl p-2 text-left hover:bg-surface-hover transition-colors min-h-[44px]"
                  >
                    <span
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: p.avatarColor ?? "#00e676" }}
                    >
                      {p.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="text-sm font-medium text-text">{p.name}</span>
                  </motion.button>
                ))}
              </div>
              <button
                onClick={() => setShowPlayerPicker(false)}
                className="mt-2 w-full rounded-xl py-2 text-xs text-text-muted hover:text-text transition-colors"
              >
                Abbrechen
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FAB */}
      <div ref={fabRef} data-fab className="fixed bottom-20 right-4 z-30 md:bottom-6 md:right-6">
        {/* Expanded actions */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-3 flex flex-col items-end gap-2"
              role="menu"
            >
              {ACTIONS.map((a, i) => (
                <motion.button
                  key={a.action}
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ delay: i * 0.05, duration: 0.15 }}
                  role="menuitem"
                  onClick={() => handleAction(a.action)}
                  className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text shadow-lg transition-colors hover:bg-surface-hover hover:border-accent/40"
                >
                  <span>{a.icon}</span>
                  {a.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent to-secondary text-2xl text-bg shadow-lg shadow-accent/20"
          aria-label="Schnellaktionen"
          aria-expanded={open}
        >
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            +
          </motion.span>
        </motion.button>
      </div>
    </>
  );
}
