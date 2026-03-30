import { useState } from "react";
import type { TacticalScene } from "../../../domain/models/TacticalBoard";
import type { BoardAction } from "../hooks/useBoardReducer";
import { createDefaultScene } from "../logic/sceneFactory";
import { Button, Input, EmptyState, ConfirmDialog } from "../../../components/ui";

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
  const [deleteId, setDeleteId] = useState<string | null>(null);

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
            className="text-text-dim hover:text-text transition-colors"
            aria-label="Schliessen"
          >
            &#10005;
          </button>
        </div>

        {/* Scene list */}
        <div className="flex-1 overflow-y-auto p-4">
          {savedScenes.length === 0 ? (
            <EmptyState
              icon="&#127912;"
              title="Keine Szenen"
              description="Noch keine Szenen gespeichert."
            />
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
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 text-xs"
                        autoFocus
                      />
                      <Button variant="ghost" size="sm" type="submit">
                        OK
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={() => setEditingId(null)}
                      >
                        Abbrechen
                      </Button>
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLoad(scene)}
                      >
                        Laden
                      </Button>
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
                        onClick={() => setDeleteId(scene.id)}
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
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={handleNewScene}
          >
            Neue Szene
          </Button>
          <Button size="sm" className="flex-1" onClick={handleSaveCurrent}>
            Aktuelle speichern
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) handleDelete(deleteId);
        }}
        title="Szene loeschen"
        message="Moechtest du diese Szene wirklich loeschen?"
      />
    </div>
  );
}
