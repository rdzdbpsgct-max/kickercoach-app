import { useState, useCallback } from "react";
import type {
  TacticalScene,
  ToolState,
  DrawingInProgress,
  FigureMarker,
  ArrowElement,
  ZoneElement,
  Point,
} from "../../../domain/models/TacticalBoard";
import { ZONE_COLORS } from "../../../data/fieldConfig";
import { createDefaultBall } from "../logic/sceneFactory";

// ── State Shape ─────────────────────────────────────────────────────

export interface BoardState {
  scene: TacticalScene;
  tool: ToolState;
  selectedElementId: string | null;
  drawingInProgress: DrawingInProgress | null;
}

interface HistoryState {
  past: TacticalScene[];
  present: TacticalScene;
  future: TacticalScene[];
}

const MAX_HISTORY = 50;

// ── Action Types ────────────────────────────────────────────────────

export type BoardAction =
  | { type: "MOVE_FIGURE"; id: string; position: Point }
  | { type: "RESET_FIGURES"; figures: FigureMarker[] }
  | { type: "ADD_ARROW"; arrow: ArrowElement }
  | { type: "REMOVE_ARROW"; id: string }
  | { type: "ADD_ZONE"; zone: ZoneElement }
  | { type: "REMOVE_ZONE"; id: string }
  | { type: "MOVE_BALL"; position: Point }
  | { type: "TOGGLE_BALL" }
  | { type: "SET_TOOL"; tool: Partial<ToolState> }
  | { type: "SELECT_ELEMENT"; id: string | null }
  | { type: "START_DRAWING"; startPoint: Point }
  | { type: "UPDATE_DRAWING"; currentPoint: Point }
  | { type: "CANCEL_DRAWING" }
  | { type: "LOAD_SCENE"; scene: TacticalScene }
  | { type: "SET_SCENE_NAME"; name: string }
  | { type: "ERASE_ELEMENT"; id: string }
  | { type: "UNDO" }
  | { type: "REDO" };

// ── Scene Reducer (pure function) ───────────────────────────────────

function updateScene(
  scene: TacticalScene,
  action: BoardAction,
): TacticalScene | null {
  switch (action.type) {
    case "MOVE_FIGURE":
      return {
        ...scene,
        updatedAt: new Date().toISOString(),
        figures: scene.figures.map((f) =>
          f.id === action.id ? { ...f, position: action.position } : f,
        ),
      };

    case "RESET_FIGURES":
      return {
        ...scene,
        updatedAt: new Date().toISOString(),
        figures: action.figures,
      };

    case "ADD_ARROW":
      return {
        ...scene,
        updatedAt: new Date().toISOString(),
        arrows: [...scene.arrows, action.arrow],
      };

    case "REMOVE_ARROW":
      return {
        ...scene,
        updatedAt: new Date().toISOString(),
        arrows: scene.arrows.filter((a) => a.id !== action.id),
      };

    case "ADD_ZONE":
      return {
        ...scene,
        updatedAt: new Date().toISOString(),
        zones: [...scene.zones, action.zone],
      };

    case "REMOVE_ZONE":
      return {
        ...scene,
        updatedAt: new Date().toISOString(),
        zones: scene.zones.filter((z) => z.id !== action.id),
      };

    case "MOVE_BALL":
      return {
        ...scene,
        updatedAt: new Date().toISOString(),
        ball: scene.ball
          ? { ...scene.ball, position: action.position }
          : null,
      };

    case "TOGGLE_BALL":
      return {
        ...scene,
        updatedAt: new Date().toISOString(),
        ball: scene.ball ? null : createDefaultBall(),
      };

    case "SET_SCENE_NAME":
      return {
        ...scene,
        updatedAt: new Date().toISOString(),
        name: action.name,
      };

    case "ERASE_ELEMENT": {
      const arrowMatch = scene.arrows.find((a) => a.id === action.id);
      if (arrowMatch) {
        return {
          ...scene,
          updatedAt: new Date().toISOString(),
          arrows: scene.arrows.filter((a) => a.id !== action.id),
        };
      }
      const zoneMatch = scene.zones.find((z) => z.id === action.id);
      if (zoneMatch) {
        return {
          ...scene,
          updatedAt: new Date().toISOString(),
          zones: scene.zones.filter((z) => z.id !== action.id),
        };
      }
      return null; // no change
    }

    default:
      return null;
  }
}

// ── Hook ────────────────────────────────────────────────────────────

const DEFAULT_TOOL: ToolState = {
  activeTool: "select",
  arrowType: "pass",
  zoneShape: "rectangle",
  zoneColor: ZONE_COLORS[0],
};

export function useBoardReducer(initialScene: TacticalScene) {
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: initialScene,
    future: [],
  });

  const [tool, setTool] = useState<ToolState>(DEFAULT_TOOL);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null,
  );
  const [drawingInProgress, setDrawingInProgress] =
    useState<DrawingInProgress | null>(null);

  const dispatch = useCallback(
    (action: BoardAction) => {
      switch (action.type) {
        // ── History navigation ──
        case "UNDO":
          setHistory((prev) => {
            if (prev.past.length === 0) return prev;
            const newPast = [...prev.past];
            const previous = newPast.pop()!;
            return {
              past: newPast,
              present: previous,
              future: [prev.present, ...prev.future],
            };
          });
          break;

        case "REDO":
          setHistory((prev) => {
            if (prev.future.length === 0) return prev;
            const [next, ...rest] = prev.future;
            return {
              past: [...prev.past, prev.present].slice(-MAX_HISTORY),
              present: next,
              future: rest,
            };
          });
          break;

        // ── Scene loading (resets history) ──
        case "LOAD_SCENE":
          setHistory({
            past: [],
            present: action.scene,
            future: [],
          });
          setSelectedElementId(null);
          setDrawingInProgress(null);
          break;

        // ── Transient (no history) ──
        case "SET_TOOL":
          setTool((prev) => ({ ...prev, ...action.tool }));
          break;

        case "SELECT_ELEMENT":
          setSelectedElementId(action.id);
          break;

        case "START_DRAWING":
          setDrawingInProgress({
            type: tool.activeTool === "arrow" ? "arrow" : "zone",
            startPoint: action.startPoint,
            currentPoint: action.startPoint,
          });
          break;

        case "UPDATE_DRAWING":
          setDrawingInProgress((prev) =>
            prev ? { ...prev, currentPoint: action.currentPoint } : null,
          );
          break;

        case "CANCEL_DRAWING":
          setDrawingInProgress(null);
          break;

        // ── Scene-mutating (with history) ──
        default: {
          setHistory((prev) => {
            const newScene = updateScene(prev.present, action);
            if (!newScene) return prev;
            return {
              past: [...prev.past, prev.present].slice(-MAX_HISTORY),
              present: newScene,
              future: [],
            };
          });
          break;
        }
      }
    },
    [tool.activeTool],
  );

  const state: BoardState = {
    scene: history.present,
    tool,
    selectedElementId,
    drawingInProgress,
  };

  return {
    state,
    dispatch,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
}
