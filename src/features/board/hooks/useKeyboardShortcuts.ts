import { useEffect } from "react";
import type { BoardAction } from "./useBoardReducer";

/** Keyboard shortcuts for the tactical board */
export function useKeyboardShortcuts(
  dispatch: (action: BoardAction) => void,
  selectedElementId: string | null,
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      const isMod = e.metaKey || e.ctrlKey;

      // Undo: Ctrl+Z / Cmd+Z
      if (isMod && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: "UNDO" });
        return;
      }

      // Redo: Ctrl+Y / Cmd+Shift+Z
      if (
        (isMod && e.key === "y") ||
        (isMod && e.key === "z" && e.shiftKey)
      ) {
        e.preventDefault();
        dispatch({ type: "REDO" });
        return;
      }

      // Delete selected element
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedElementId &&
        !isMod
      ) {
        e.preventDefault();
        dispatch({ type: "ERASE_ELEMENT", id: selectedElementId });
        dispatch({ type: "SELECT_ELEMENT", id: null });
        return;
      }

      // Escape: deselect + cancel drawing
      if (e.key === "Escape") {
        dispatch({ type: "SELECT_ELEMENT", id: null });
        dispatch({ type: "CANCEL_DRAWING" });
        return;
      }

      // Quick tool switch: 1-4
      if (!isMod) {
        switch (e.key) {
          case "1":
            dispatch({ type: "SET_TOOL", tool: { activeTool: "select" } });
            break;
          case "2":
            dispatch({ type: "SET_TOOL", tool: { activeTool: "arrow" } });
            break;
          case "3":
            dispatch({ type: "SET_TOOL", tool: { activeTool: "zone" } });
            break;
          case "4":
            dispatch({ type: "SET_TOOL", tool: { activeTool: "eraser" } });
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch, selectedElementId]);
}
