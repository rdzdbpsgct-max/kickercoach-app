import { Layer, Circle } from "react-konva";
import type {
  FigureMarker,
  BallMarker,
  Point,
  ToolType,
} from "../../../domain/models/TacticalBoard";
import {
  TEAM_COLORS,
  FIGURE_RADIUS,
  BALL_RADIUS,
  BOARD_COLORS,
  FIELD,
  FIELD_MARGIN,
} from "../../../data/fieldConfig";
import { getRodConstraint } from "../logic/fieldGeometry";

interface FigureLayerProps {
  figures: FigureMarker[];
  ball: BallMarker | null;
  activeTool: ToolType;
  onMoveFigure: (id: string, position: Point) => void;
  onMoveBall: (position: Point) => void;
}

export default function FigureLayer({
  figures,
  ball,
  activeTool,
  onMoveFigure,
  onMoveBall,
}: FigureLayerProps) {
  const isDraggable = activeTool === "select";

  return (
    <Layer>
      {figures.map((fig) => {
        const constraint = getRodConstraint(fig.rodIndex);

        return (
          <Circle
            key={fig.id}
            x={fig.position.x}
            y={fig.position.y}
            radius={FIGURE_RADIUS}
            fill={TEAM_COLORS[fig.team]}
            stroke="rgba(255,255,255,0.6)"
            strokeWidth={2}
            shadowColor="rgba(0,0,0,0.3)"
            shadowBlur={4}
            shadowOffsetY={2}
            draggable={isDraggable}
            dragBoundFunc={(pos) => ({
              x: constraint.x,
              y: Math.max(
                constraint.minY,
                Math.min(constraint.maxY, pos.y),
              ),
            })}
            onDragEnd={(e) => {
              const node = e.target;
              onMoveFigure(fig.id, {
                x: node.x(),
                y: node.y(),
              });
            }}
            onMouseEnter={(e) => {
              if (isDraggable) {
                const container = e.target.getStage()?.container();
                if (container) container.style.cursor = "grab";
              }
            }}
            onMouseLeave={(e) => {
              const container = e.target.getStage()?.container();
              if (container) container.style.cursor = "default";
            }}
          />
        );
      })}

      {/* Ball */}
      {ball && (
        <Circle
          x={ball.position.x}
          y={ball.position.y}
          radius={BALL_RADIUS}
          fill={BOARD_COLORS.ball}
          stroke="rgba(255,255,255,0.8)"
          strokeWidth={1.5}
          shadowColor="rgba(0,0,0,0.4)"
          shadowBlur={3}
          draggable={isDraggable}
          dragBoundFunc={(pos) => ({
            x: Math.max(0, Math.min(FIELD.width, pos.x)),
            y: Math.max(FIELD_MARGIN, Math.min(FIELD.height - FIELD_MARGIN, pos.y)),
          })}
          onDragEnd={(e) => {
            onMoveBall({ x: e.target.x(), y: e.target.y() });
          }}
        />
      )}
    </Layer>
  );
}
