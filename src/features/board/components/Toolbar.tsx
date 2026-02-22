import type { ToolState, ToolType, ArrowType, ZoneShape } from "../../../domain/models/TacticalBoard";
import type { BoardAction } from "../hooks/useBoardReducer";
import { ZONE_COLORS } from "../../../data/fieldConfig";

interface ToolbarProps {
  tool: ToolState;
  dispatch: (action: BoardAction) => void;
  canUndo: boolean;
  canRedo: boolean;
  sceneName: string;
  onExport: () => void;
  onSave: () => void;
  onShowScenes: () => void;
}

const TOOLS: { type: ToolType; label: string; icon: string; key: string }[] = [
  { type: "select", label: "Auswahl", icon: "\u{1F446}", key: "1" },
  { type: "arrow", label: "Pfeil", icon: "\u{27A1}\uFE0F", key: "2" },
  { type: "zone", label: "Zone", icon: "\u{1F7E9}", key: "3" },
  { type: "eraser", label: "Radierer", icon: "\u{1F6AB}", key: "4" },
];

const ARROW_TYPES: { type: ArrowType; label: string; color: string }[] = [
  { type: "pass", label: "Pass", color: "bg-kicker-blue" },
  { type: "shot", label: "Schuss", color: "bg-kicker-red" },
  { type: "block", label: "Block", color: "bg-kicker-orange" },
];

const ZONE_SHAPES: { shape: ZoneShape; label: string }[] = [
  { shape: "rectangle", label: "Rechteck" },
  { shape: "circle", label: "Kreis" },
];

export default function Toolbar({
  tool,
  dispatch,
  canUndo,
  canRedo,
  sceneName,
  onExport,
  onSave,
  onShowScenes,
}: ToolbarProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Main toolbar row */}
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Scene name */}
        <input
          type="text"
          value={sceneName}
          onChange={(e) =>
            dispatch({ type: "SET_SCENE_NAME", name: e.target.value })
          }
          className="w-32 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-text focus:border-accent focus:outline-none md:w-40"
          placeholder="Szenen-Name"
        />

        <div className="mx-1 h-6 w-px bg-border" />

        {/* Tool buttons */}
        {TOOLS.map((t) => (
          <button
            key={t.type}
            onClick={() => dispatch({ type: "SET_TOOL", tool: { activeTool: t.type } })}
            aria-pressed={tool.activeTool === t.type}
            title={`${t.label} (${t.key})`}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
              tool.activeTool === t.type
                ? "border-2 border-accent bg-accent-dim text-accent-hover"
                : "border border-border text-text-muted hover:border-accent/50"
            }`}
          >
            <span>{t.icon}</span>
            <span className="hidden md:inline">{t.label}</span>
          </button>
        ))}

        {/* Ball toggle */}
        <button
          onClick={() => dispatch({ type: "TOGGLE_BALL" })}
          title="Ball ein/aus"
          className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-text-muted hover:border-accent/50 transition-all"
        >
          &#9917;
        </button>

        <div className="mx-1 h-6 w-px bg-border" />

        {/* Undo / Redo */}
        <button
          onClick={() => dispatch({ type: "UNDO" })}
          disabled={!canUndo}
          title="R&uuml;ckg&auml;ngig (Ctrl+Z)"
          className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-text-muted hover:border-accent/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          &#8630;
        </button>
        <button
          onClick={() => dispatch({ type: "REDO" })}
          disabled={!canRedo}
          title="Wiederherstellen (Ctrl+Y)"
          className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-text-muted hover:border-accent/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          &#8631;
        </button>

        <div className="ml-auto flex gap-1.5">
          <button
            onClick={onShowScenes}
            className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted hover:border-accent/50 transition-all"
          >
            Szenen
          </button>
          <button
            onClick={onSave}
            className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted hover:border-accent/50 transition-all"
          >
            Speichern
          </button>
          <button
            onClick={onExport}
            className="rounded-lg border-2 border-accent bg-accent-dim px-3 py-1.5 text-xs font-semibold text-accent-hover hover:bg-accent hover:text-white transition-all"
          >
            PNG
          </button>
        </div>
      </div>

      {/* Sub-options for arrow/zone */}
      {tool.activeTool === "arrow" && (
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-text-dim">Typ:</span>
          {ARROW_TYPES.map((at) => (
            <button
              key={at.type}
              onClick={() =>
                dispatch({ type: "SET_TOOL", tool: { arrowType: at.type } })
              }
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-all ${
                tool.arrowType === at.type
                  ? `${at.color} text-white`
                  : "border border-border text-text-muted hover:border-accent/50"
              }`}
            >
              {at.label}
            </button>
          ))}
        </div>
      )}

      {tool.activeTool === "zone" && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-text-dim">Form:</span>
            {ZONE_SHAPES.map((zs) => (
              <button
                key={zs.shape}
                onClick={() =>
                  dispatch({ type: "SET_TOOL", tool: { zoneShape: zs.shape } })
                }
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-all ${
                  tool.zoneShape === zs.shape
                    ? "border-2 border-accent bg-accent-dim text-accent-hover"
                    : "border border-border text-text-muted hover:border-accent/50"
                }`}
              >
                {zs.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-text-dim">Farbe:</span>
            {ZONE_COLORS.map((color, i) => (
              <button
                key={i}
                onClick={() =>
                  dispatch({ type: "SET_TOOL", tool: { zoneColor: color } })
                }
                className={`h-5 w-5 rounded-full border-2 transition-all ${
                  tool.zoneColor === color
                    ? "border-accent scale-110"
                    : "border-border hover:border-accent/50"
                }`}
                style={{ backgroundColor: color.replace("0.15", "0.6") }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
