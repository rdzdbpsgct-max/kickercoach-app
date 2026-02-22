import { useCallback } from "react";
import { Stage } from "react-konva";
import type Konva from "konva";
import type { BoardState, BoardAction } from "../hooks/useBoardReducer";
import { FIELD } from "../../../data/fieldConfig";
import { useCanvasDimensions } from "../hooks/useCanvasDimensions";
import { hitTest } from "../logic/fieldGeometry";
import FieldLayer from "./FieldLayer";
import FigureLayer from "./FigureLayer";
import AnnotationLayer from "./AnnotationLayer";
import OverlayLayer from "./OverlayLayer";

interface BoardCanvasProps {
  state: BoardState;
  dispatch: (action: BoardAction) => void;
  stageRef: React.RefObject<Konva.Stage>;
}

export default function BoardCanvas({
  state,
  dispatch,
  stageRef,
}: BoardCanvasProps) {
  const { containerRef, dimensions } = useCanvasDimensions();
  const { scene, tool, selectedElementId, drawingInProgress } = state;

  // Scale to fit container while maintaining aspect ratio
  const scale = Math.min(
    dimensions.width / FIELD.width,
    dimensions.height / FIELD.height,
  );
  const stageWidth = FIELD.width * scale;
  const stageHeight = FIELD.height * scale;

  // Convert pointer position to field coordinates
  const getFieldPoint = useCallback(
    (stage: Konva.Stage) => {
      const pointer = stage.getPointerPosition();
      if (!pointer || scale === 0) return null;
      return {
        x: pointer.x / scale,
        y: pointer.y / scale,
      };
    },
    [scale],
  );

  // ── Canvas events ──

  const handlePointerDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      const stage = e.target.getStage();
      if (!stage) return;
      const point = getFieldPoint(stage);
      if (!point) return;

      // Only handle clicks on the stage background (not on shapes)
      if (e.target !== stage) return;

      if (tool.activeTool === "arrow" || tool.activeTool === "zone") {
        dispatch({ type: "START_DRAWING", startPoint: point });
      } else if (tool.activeTool === "eraser") {
        const id = hitTest(point, scene.arrows, scene.zones);
        if (id) {
          dispatch({ type: "ERASE_ELEMENT", id });
        }
      } else if (tool.activeTool === "select") {
        const id = hitTest(point, scene.arrows, scene.zones);
        dispatch({ type: "SELECT_ELEMENT", id });
      }
    },
    [tool.activeTool, dispatch, getFieldPoint, scene.arrows, scene.zones],
  );

  const handlePointerMove = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      if (!drawingInProgress) return;
      const stage = e.target.getStage();
      if (!stage) return;
      const point = getFieldPoint(stage);
      if (!point) return;
      dispatch({ type: "UPDATE_DRAWING", currentPoint: point });
    },
    [drawingInProgress, dispatch, getFieldPoint],
  );

  const handlePointerUp = useCallback(() => {
    if (!drawingInProgress) return;
    const { startPoint, currentPoint, type } = drawingInProgress;

    // Minimum drag distance to create element
    const dx = currentPoint.x - startPoint.x;
    const dy = currentPoint.y - startPoint.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 10) {
      if (type === "arrow") {
        dispatch({
          type: "ADD_ARROW",
          arrow: {
            id: crypto.randomUUID(),
            arrowType: tool.arrowType,
            start: startPoint,
            end: currentPoint,
          },
        });
      } else {
        if (tool.zoneShape === "circle") {
          const r = dist;
          dispatch({
            type: "ADD_ZONE",
            zone: {
              id: crypto.randomUUID(),
              shape: "circle",
              origin: { x: startPoint.x - r, y: startPoint.y - r },
              size: { width: r * 2, height: r * 2 },
              color: tool.zoneColor,
            },
          });
        } else {
          const x = Math.min(startPoint.x, currentPoint.x);
          const y = Math.min(startPoint.y, currentPoint.y);
          dispatch({
            type: "ADD_ZONE",
            zone: {
              id: crypto.randomUUID(),
              shape: "rectangle",
              origin: { x, y },
              size: { width: Math.abs(dx), height: Math.abs(dy) },
              color: tool.zoneColor,
            },
          });
        }
      }
    }

    dispatch({ type: "CANCEL_DRAWING" });
  }, [drawingInProgress, dispatch, tool]);

  const handleClickAnnotation = useCallback(
    (id: string) => {
      if (tool.activeTool === "eraser") {
        dispatch({ type: "ERASE_ELEMENT", id });
      } else {
        dispatch({ type: "SELECT_ELEMENT", id });
      }
    },
    [tool.activeTool, dispatch],
  );

  if (dimensions.width === 0) {
    return (
      <div
        ref={containerRef}
        className="flex flex-1 items-center justify-center"
        style={{ touchAction: "none" }}
      >
        <span className="text-sm text-text-dim">Laden...</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-1 items-center justify-center min-h-0"
      style={{ touchAction: "none" }}
    >
      <Stage
        ref={stageRef}
        width={stageWidth}
        height={stageHeight}
        scaleX={scale}
        scaleY={scale}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        onMouseMove={handlePointerMove}
        onTouchMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onTouchEnd={handlePointerUp}
      >
        <FieldLayer />
        <AnnotationLayer
          arrows={scene.arrows}
          zones={scene.zones}
          selectedElementId={selectedElementId}
          onClickElement={handleClickAnnotation}
        />
        <FigureLayer
          figures={scene.figures}
          ball={scene.ball}
          activeTool={tool.activeTool}
          onMoveFigure={(id, pos) =>
            dispatch({ type: "MOVE_FIGURE", id, position: pos })
          }
          onMoveBall={(pos) => dispatch({ type: "MOVE_BALL", position: pos })}
        />
        <OverlayLayer drawingInProgress={drawingInProgress} tool={tool} />
      </Stage>
    </div>
  );
}
