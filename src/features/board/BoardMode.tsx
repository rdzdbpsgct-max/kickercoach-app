import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type Konva from "konva";
import type { TacticalScene } from "../../domain/models/TacticalBoard";
import { useAppStore } from "../../store";
import { createDefaultScene, createDefaultFigures } from "./logic/sceneFactory";
import { useBoardReducer } from "./hooks/useBoardReducer";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import BoardCanvas from "./components/BoardCanvas";
import Toolbar from "./components/Toolbar";
import SceneManager from "./components/SceneManager";

function getLastScene(scenes: TacticalScene[]): TacticalScene {
  if (scenes.length > 0) {
    return [...scenes].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )[0];
  }
  return createDefaultScene();
}

export default function BoardMode() {
  const stageRef = useRef<Konva.Stage>(null!);
  const [showScenes, setShowScenes] = useState(false);
  const boardScenes = useAppStore((s) => s.boardScenes);
  const setBoardScenes = useAppStore((s) => s.setBoardScenes);

  const { state, dispatch, canUndo, canRedo } = useBoardReducer(
    getLastScene(boardScenes),
  );

  // Keyboard shortcuts
  useKeyboardShortcuts(dispatch, state.selectedElementId);

  // Save current scene (quick-save)
  const handleSave = useCallback(() => {
    const current = state.scene;
    const existing = boardScenes.findIndex((s) => s.id === current.id);
    const updated =
      existing >= 0
        ? boardScenes.map((s) => (s.id === current.id ? current : s))
        : [...boardScenes, current];
    setBoardScenes(updated);
  }, [state.scene, boardScenes, setBoardScenes]);

  // PNG export (2x resolution)
  const handleExport = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const uri = stage.toDataURL({ pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = `${state.scene.name || "taktik"}.png`;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [state.scene.name]);

  // Auto-save on unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      handleSave();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [handleSave]);

  return (
    <motion.div
      className="flex flex-1 flex-col gap-2 min-h-0"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <Toolbar
          tool={state.tool}
          dispatch={dispatch}
          canUndo={canUndo}
          canRedo={canRedo}
          sceneName={state.scene.name}
          onExport={handleExport}
          onSave={handleSave}
          onShowScenes={() => setShowScenes(true)}
          onResetFigures={() =>
            dispatch({ type: "RESET_FIGURES", figures: createDefaultFigures() })
          }
        />
      </motion.div>

      <motion.div
        className="flex-1 min-h-0"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, delay: 0.12 }}
      >
        <BoardCanvas state={state} dispatch={dispatch} stageRef={stageRef} />
      </motion.div>

      <AnimatePresence>
        {showScenes && (
          <SceneManager
            currentScene={state.scene}
            savedScenes={boardScenes}
            onSaveScenes={setBoardScenes}
            dispatch={dispatch}
            onClose={() => setShowScenes(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
