import { useRef, useState, useCallback, useEffect } from "react";
import type Konva from "konva";
import type { TacticalScene } from "../../domain/models/TacticalBoard";
import { STORAGE_KEYS } from "../../domain/constants";
import { createDefaultScene, createDefaultFigures } from "./logic/sceneFactory";
import { useBoardReducer } from "./hooks/useBoardReducer";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import BoardCanvas from "./components/BoardCanvas";
import Toolbar from "./components/Toolbar";
import SceneManager from "./components/SceneManager";

// ── localStorage helpers ────────────────────────────────────────────

function loadScenes(): TacticalScene[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.boardScenes);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    console.warn("Failed to load board scenes from localStorage");
    return [];
  }
}

function saveScenes(scenes: TacticalScene[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.boardScenes, JSON.stringify(scenes));
  } catch {
    console.warn("Failed to save board scenes to localStorage");
  }
}

function loadLastScene(): TacticalScene {
  const scenes = loadScenes();
  if (scenes.length > 0) {
    // Return the most recently updated scene
    return [...scenes].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )[0];
  }
  return createDefaultScene();
}

// ── Component ───────────────────────────────────────────────────────

export default function BoardMode() {
  const stageRef = useRef<Konva.Stage>(null!);
  const [showScenes, setShowScenes] = useState(false);
  const [savedScenes, setSavedScenes] = useState<TacticalScene[]>(loadScenes);

  const { state, dispatch, canUndo, canRedo } = useBoardReducer(
    loadLastScene(),
  );

  // Keyboard shortcuts
  useKeyboardShortcuts(dispatch, state.selectedElementId);

  // Persist saved scenes to localStorage
  const handleSaveScenes = useCallback((scenes: TacticalScene[]) => {
    setSavedScenes(scenes);
    saveScenes(scenes);
  }, []);

  // Save current scene (quick-save)
  const handleSave = useCallback(() => {
    const current = state.scene;
    setSavedScenes((prev) => {
      const existing = prev.findIndex((s) => s.id === current.id);
      const updated =
        existing >= 0
          ? prev.map((s) => (s.id === current.id ? current : s))
          : [...prev, current];
      saveScenes(updated);
      return updated;
    });
  }, [state.scene]);

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
    <div className="flex flex-1 flex-col gap-2 min-h-0">
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

      <BoardCanvas state={state} dispatch={dispatch} stageRef={stageRef} />

      {showScenes && (
        <SceneManager
          currentScene={state.scene}
          savedScenes={savedScenes}
          onSaveScenes={handleSaveScenes}
          dispatch={dispatch}
          onClose={() => setShowScenes(false)}
        />
      )}
    </div>
  );
}
