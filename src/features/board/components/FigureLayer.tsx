import { useMemo } from "react";
import { Layer, Group, Circle, Line } from "react-konva";
import type {
  FigureMarker,
  BallMarker,
  ToolType,
} from "../../../domain/models/TacticalBoard";
import {
  TEAM_COLORS,
  FIGURE_RADIUS,
  BALL_RADIUS,
  BOARD_COLORS,
  FIELD,
  FIELD_MARGIN,
  RODS,
} from "../../../data/fieldConfig";

interface FigureLayerProps {
  figures: FigureMarker[];
  ball: BallMarker | null;
  activeTool: ToolType;
  onMoveRod: (rodIndex: number, deltaY: number) => void;
  onMoveBall: (position: { x: number; y: number }) => void;
}

export default function FigureLayer({
  figures,
  ball,
  activeTool,
  onMoveRod,
  onMoveBall,
}: FigureLayerProps) {
  const isDraggable = activeTool === "select";

  // Group figures by rod index
  const rodGroups = useMemo(() => {
    const groups: Record<number, FigureMarker[]> = {};
    for (const fig of figures) {
      if (!groups[fig.rodIndex]) groups[fig.rodIndex] = [];
      groups[fig.rodIndex].push(fig);
    }
    return groups;
  }, [figures]);

  return (
    <Layer>
      {Object.entries(rodGroups).map(([rodIndexStr, figs]) => {
        const rodIndex = Number(rodIndexStr);
        const rod = RODS.find((r) => r.index === rodIndex);
        if (!rod) return null;

        // Determine Y bounds for the entire rod group (in field coordinates)
        const minFigY = Math.min(...figs.map((f) => f.position.y));
        const maxFigY = Math.max(...figs.map((f) => f.position.y));
        const minGroupDelta = FIELD_MARGIN + FIGURE_RADIUS - minFigY;
        const maxGroupDelta =
          FIELD.height - FIELD_MARGIN - FIGURE_RADIUS - maxFigY;

        return (
          <Group
            key={rodIndex}
            draggable={isDraggable}
            // Constrain to vertical only, clamp within field bounds
            onDragMove={(e) => {
              const node = e.target;
              // Lock horizontal movement
              node.x(0);
              // Clamp vertical to keep all figures within field
              let y = node.y();
              y = Math.max(minGroupDelta, Math.min(maxGroupDelta, y));
              // Snap to center (default position) when close
              const SNAP_THRESHOLD = 8;
              if (Math.abs(y) < SNAP_THRESHOLD) {
                y = 0;
              }
              node.y(y);
            }}
            onDragEnd={(e) => {
              const deltaY = e.target.y();
              if (Math.abs(deltaY) > 0.5) {
                onMoveRod(rodIndex, deltaY);
              }
              // Reset group position (offsets are now baked into figure positions)
              e.target.y(0);
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
          >
            {/* Rod line (silver bar spanning entire field height) */}
            <Line
              points={[
                rod.xPosition,
                -10,
                rod.xPosition,
                FIELD.height + 10,
              ]}
              stroke="rgba(180, 180, 190, 0.5)"
              strokeWidth={6}
              lineCap="round"
            />

            {/* Figures on this rod */}
            {figs.map((fig) => (
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
              />
            ))}
          </Group>
        );
      })}

      {/* Ball (freely draggable, independent of rods) */}
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
          onDragMove={(e) => {
            const node = e.target;
            const x = Math.max(0, Math.min(FIELD.width, node.x()));
            const y = Math.max(0, Math.min(FIELD.height, node.y()));
            node.x(x);
            node.y(y);
          }}
          onDragEnd={(e) => {
            onMoveBall({ x: e.target.x(), y: e.target.y() });
          }}
        />
      )}
    </Layer>
  );
}
