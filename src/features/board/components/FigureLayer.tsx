import { useMemo } from "react";
import { Layer, Group, Circle, Line, Shape } from "react-konva";
import type {
  FigureMarker,
  BallMarker,
  ToolType,
} from "../../../domain/models/TacticalBoard";
import {
  TEAM_COLORS,
  FIGURE_RADIUS,
  BALL_RADIUS,
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
      {/* Static rod lines — always visible, never move */}
      {RODS.map((rod) => (
        <Line
          key={`rod-line-${rod.index}`}
          points={[rod.xPosition, -10, rod.xPosition, FIELD.height + 10]}
          stroke="rgba(180, 180, 190, 0.45)"
          strokeWidth={6}
          lineCap="round"
          listening={false}
        />
      ))}

      {/* Draggable rod groups (figures only) */}
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

      {/* Ball (soccer/kicker ball style, freely draggable) */}
      {ball && (
        <Group
          x={ball.position.x}
          y={ball.position.y}
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
          {/* Ball shadow */}
          <Circle
            x={1}
            y={2}
            radius={BALL_RADIUS + 1}
            fill="rgba(0,0,0,0.3)"
          />
          {/* White base */}
          <Circle
            radius={BALL_RADIUS}
            fill="#f5f5f0"
            stroke="rgba(100,100,100,0.5)"
            strokeWidth={1}
          />
          {/* Soccer ball pentagon pattern */}
          <Shape
            sceneFunc={(ctx, shape) => {
              const r = BALL_RADIUS;
              const pr = r * 0.38; // pentagon radius
              // Center pentagon
              ctx.beginPath();
              for (let i = 0; i < 5; i++) {
                const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                const px = Math.cos(angle) * pr;
                const py = Math.sin(angle) * pr;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
              }
              ctx.closePath();
              ctx.fillStrokeShape(shape);
              // Lines from pentagon corners to edge
              for (let i = 0; i < 5; i++) {
                const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                const px = Math.cos(angle) * pr;
                const py = Math.sin(angle) * pr;
                const ex = Math.cos(angle) * r * 0.82;
                const ey = Math.sin(angle) * r * 0.82;
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(ex, ey);
                ctx.fillStrokeShape(shape);
              }
              // Small edge pentagons (partial)
              for (let i = 0; i < 5; i++) {
                const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                const cx = Math.cos(angle) * r * 0.72;
                const cy = Math.sin(angle) * r * 0.72;
                const epr = r * 0.22;
                const a1 = angle - Math.PI * 0.35;
                const a2 = angle + Math.PI * 0.35;
                ctx.beginPath();
                ctx.moveTo(
                  cx + Math.cos(a1) * epr,
                  cy + Math.sin(a1) * epr,
                );
                ctx.lineTo(
                  cx + Math.cos(a2) * epr,
                  cy + Math.sin(a2) * epr,
                );
                ctx.fillStrokeShape(shape);
              }
            }}
            fill="rgba(60,60,60,0.7)"
            stroke="rgba(80,80,80,0.4)"
            strokeWidth={0.5}
          />
        </Group>
      )}
    </Layer>
  );
}
