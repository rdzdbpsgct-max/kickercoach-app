import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import type { ToolState, ToolType, ArrowType, ZoneShape } from "../../../domain/models/TacticalBoard";
import type { BoardAction } from "../hooks/useBoardReducer";
import { ZONE_COLORS } from "../../../data/fieldConfig";
import { Button, IconButton } from "../../../components/ui";

interface ToolbarProps {
  tool: ToolState;
  dispatch: (action: BoardAction) => void;
  canUndo: boolean;
  canRedo: boolean;
  sceneName: string;
  onExport: () => void;
  onSave: () => void;
  onShowScenes: () => void;
  onResetFigures: () => void;
}

const TOOLS: { type: ToolType; labelKey: string; icon: string; key: string }[] = [
  { type: "select", labelKey: "tools.select", icon: "\u{1F446}", key: "1" },
  { type: "arrow", labelKey: "tools.arrow", icon: "\u{27A1}\uFE0F", key: "2" },
  { type: "zone", labelKey: "tools.zone", icon: "\u{1F7E9}", key: "3" },
  { type: "eraser", labelKey: "tools.eraser", icon: "\u{1F6AB}", key: "4" },
];

const ARROW_TYPES: { type: ArrowType; labelKey: string; color: string }[] = [
  { type: "pass", labelKey: "arrowTypes.pass", color: "bg-kicker-blue" },
  { type: "shot", labelKey: "arrowTypes.shot", color: "bg-kicker-red" },
  { type: "block", labelKey: "arrowTypes.block", color: "bg-kicker-orange" },
];

const ZONE_SHAPES: { shape: ZoneShape; labelKey: string }[] = [
  { shape: "rectangle", labelKey: "zoneShapes.rectangle" },
  { shape: "circle", labelKey: "zoneShapes.circle" },
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
  onResetFigures,
}: ToolbarProps) {
  const { t } = useTranslation("board");

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
          placeholder={t("sceneName")}
        />

        <div className="mx-1 h-6 w-px bg-border" />

        {/* Tool buttons */}
        {TOOLS.map((tl) => (
          <motion.button
            key={tl.type}
            onClick={() => dispatch({ type: "SET_TOOL", tool: { activeTool: tl.type } })}
            aria-pressed={tool.activeTool === tl.type}
            title={`${t(tl.labelKey)} (${tl.key})`}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
              tool.activeTool === tl.type
                ? "border-2 border-accent bg-accent-dim text-accent"
                : "border border-border text-text-muted hover:border-accent/50"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <span>{tl.icon}</span>
            <span className="hidden md:inline">{t(tl.labelKey)}</span>
          </motion.button>
        ))}

        {/* Ball toggle */}
        <IconButton
          size="sm"
          onClick={() => dispatch({ type: "TOGGLE_BALL" })}
          title={t("tooltips.ballToggle")}
        >
          &#9917;
        </IconButton>

        {/* Reset figures to default */}
        <IconButton
          size="sm"
          onClick={onResetFigures}
          title={t("tooltips.resetFigures")}
        >
          &#8634;
        </IconButton>

        <div className="mx-1 h-6 w-px bg-border" />

        {/* Undo / Redo */}
        <IconButton
          size="sm"
          onClick={() => dispatch({ type: "UNDO" })}
          disabled={!canUndo}
          title={t("tooltips.undo")}
        >
          &#8630;
        </IconButton>
        <IconButton
          size="sm"
          onClick={() => dispatch({ type: "REDO" })}
          disabled={!canRedo}
          title={t("tooltips.redo")}
        >
          &#8631;
        </IconButton>

        <div className="ml-auto flex gap-1.5">
          <Button variant="secondary" size="sm" onClick={onShowScenes}>
            {t("buttons.scenes")}
          </Button>
          <Button variant="secondary" size="sm" onClick={onSave}>
            {t("buttons.save")}
          </Button>
          <Button size="sm" onClick={onExport}>
            {t("buttons.exportPng")}
          </Button>
        </div>
      </div>

      {/* Sub-options for arrow/zone */}
      <AnimatePresence mode="wait">
        {tool.activeTool === "arrow" && (
          <motion.div
            key="arrow-options"
            className="flex items-center gap-1.5"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <span className="text-[11px] text-text-dim">{t("subLabels.type")}</span>
            {ARROW_TYPES.map((at) => (
              <motion.button
                key={at.type}
                onClick={() =>
                  dispatch({ type: "SET_TOOL", tool: { arrowType: at.type } })
                }
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-all ${
                  tool.arrowType === at.type
                    ? `${at.color} text-white`
                    : "border border-border text-text-muted hover:border-accent/50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.93 }}
              >
                {t(at.labelKey)}
              </motion.button>
            ))}
          </motion.div>
        )}

        {tool.activeTool === "zone" && (
          <motion.div
            key="zone-options"
            className="flex items-center gap-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-text-dim">{t("subLabels.shape")}</span>
              {ZONE_SHAPES.map((zs) => (
                <motion.button
                  key={zs.shape}
                  onClick={() =>
                    dispatch({ type: "SET_TOOL", tool: { zoneShape: zs.shape } })
                  }
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-all ${
                    tool.zoneShape === zs.shape
                      ? "border-2 border-accent bg-accent-dim text-accent"
                      : "border border-border text-text-muted hover:border-accent/50"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.93 }}
                >
                  {t(zs.labelKey)}
                </motion.button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-text-dim">{t("subLabels.color")}</span>
              {ZONE_COLORS.map((color, i) => (
                <motion.button
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
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
