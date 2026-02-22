import { useState } from "react";
import type { TacticalScene } from "../../../domain/models/TacticalBoard";
import type { BoardAction } from "../hooks/useBoardReducer";
import { createDefaultScene } from "../logic/sceneFactory";

interface SceneManagerProps {
  currentScene: TacticalScene;
  savedScenes: TacticalScene[];
  onSaveScenes: (scenes: TacticalScene[]) => void;
  dispatch: (action: BoardAction) => void;
  onClose: () => void;
}

export default function SceneManager({
  currentScene,
  savedScenes,
  onSaveScenes,
  dispatch,
  onClose,
}: SceneManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleSaveCurrent = () => {
    const existing = savedScenes.findIndex((s) => s.id === currentScene.id);
    const updated =
      existing >= 0
        ? savedScenes.map((s) => (s.id === currentScene.id ? currentScene : s))
        : [...savedScenes, currentScene];
    onSaveScenes(updated);
  };

  const handleLoad = (scene: TacticalScene) => {
    dispatch({ type: "LOAD_SCENE", scene });
    onClose();
  };

  const handleDelete = (id: string) => {
    onSaveScenes(savedScenes.filter((s) => s.id !== id));
  };

  const handleNewScene = () => {
    const scene = createDefaultScene();
    dispatch({ type: "LOAD_SCENE", scene });
    onClose();
  };

  const handleRename = (id: string) => {
    const updated = savedScenes.map((s) =>
      s.id === id ? { ...s, name: editName, updatedAt: new Date().toISOString() } : s,
    );
    onSaveScenes(updated);
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[80vh] w-full max-w-md flex-col rounded-2xl border border-border bg-surface shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-bold text-text">Szenen</h2>
          <button
            onClick={onClose}
            className="rounded-lg px-2.5 py-1 text-xs text-text-muted hover:bg-accent-dim transition-all"
          >
            &#10005;
          </button>
        </div>

        {/* Scene list */}
        <div className="flex-1 overflow-y-auto p-4">
          {savedScenes.length === 0 ? (
            <p className="py-8 text-center text-sm text-text-dim">
              Keine gespeicherten Szenen.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {savedScenes.map((scene) => (
                <li
                  key={scene.id}
                  className={`flex items-center gap-2 rounded-xl border p-3 transition-all ${
                    scene.id === currentScene.id
                      ? "border-accent bg-accent-dim"
                      : "border-border hover:border-accent/50"
                  }`}
                >
                  {editingId === scene.id ? (
                    <form
                      className="flex flex-1 items-center gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleRename(scene.id);
                      }}
                    >
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 rounded-lg border border-border bg-bg px-2 py-1 text-xs text-text focus:border-accent focus:outline-none"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="text-xs text-accent-hover hover:underline"
                      >
                        OK
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="text-xs text-text-muted hover:underline"
                      >
                        Abbrechen
                      </button>
                    </form>
                  ) : (
                    <>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-text">
                          {scene.name}
                        </span>
                        <span className="ml-2 text-[10px] text-text-dim">
                          {new Date(scene.updatedAt).toLocaleDateString("de-DE")}
                        </span>
                      </div>
                      <button
                        onClick={() => handleLoad(scene)}
                        className="rounded-lg border border-border px-2 py-1 text-[11px] text-text-muted hover:border-accent/50 transition-all"
                      >
                        Laden
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(scene.id);
                          setEditName(scene.name);
                        }}
                        className="rounded-lg border border-border px-2 py-1 text-[11px] text-text-muted hover:border-accent/50 transition-all"
                      >
                        &#9998;
                      </button>
                      <button
                        onClick={() => handleDelete(scene.id)}
                        className="rounded-lg border border-border px-2 py-1 text-[11px] text-kicker-red hover:border-kicker-red/50 transition-all"
                      >
                        &#128465;
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 border-t border-border p-4">
          <button
            onClick={handleNewScene}
            className="flex-1 rounded-xl border border-border px-3 py-2 text-xs font-medium text-text-muted hover:border-accent/50 transition-all"
          >
            Neue Szene
          </button>
          <button
            onClick={handleSaveCurrent}
            className="flex-1 rounded-xl border-2 border-accent bg-accent-dim px-3 py-2 text-xs font-semibold text-accent-hover hover:bg-accent hover:text-white transition-all"
          >
            Aktuelle speichern
          </button>
        </div>
      </div>
    </div>
  );
}
