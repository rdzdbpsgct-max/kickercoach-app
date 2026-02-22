import { Layer, Arrow, Rect, Circle } from "react-konva";
import type { DrawingInProgress, ToolState } from "../../../domain/models/TacticalBoard";
import { ARROW_STYLES } from "../../../data/fieldConfig";

interface OverlayLayerProps {
  drawingInProgress: DrawingInProgress | null;
  tool: ToolState;
}

export default function OverlayLayer({
  drawingInProgress,
  tool,
}: OverlayLayerProps) {
  if (!drawingInProgress) return <Layer listening={false} />;

  const { startPoint, currentPoint, type } = drawingInProgress;

  if (type === "arrow") {
    const style = ARROW_STYLES[tool.arrowType] || ARROW_STYLES.pass;
    return (
      <Layer listening={false}>
        <Arrow
          points={[startPoint.x, startPoint.y, currentPoint.x, currentPoint.y]}
          stroke={style.color}
          strokeWidth={style.strokeWidth}
          dash={style.dash}
          fill={style.color}
          pointerLength={10}
          pointerWidth={8}
          opacity={0.6}
        />
      </Layer>
    );
  }

  // Zone preview
  if (tool.zoneShape === "circle") {
    const dx = currentPoint.x - startPoint.x;
    const dy = currentPoint.y - startPoint.y;
    const r = Math.sqrt(dx * dx + dy * dy);
    return (
      <Layer listening={false}>
        <Circle
          x={startPoint.x}
          y={startPoint.y}
          radius={r}
          fill={tool.zoneColor}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={1}
          opacity={0.6}
        />
      </Layer>
    );
  }

  // Rectangle preview
  const x = Math.min(startPoint.x, currentPoint.x);
  const y = Math.min(startPoint.y, currentPoint.y);
  const w = Math.abs(currentPoint.x - startPoint.x);
  const h = Math.abs(currentPoint.y - startPoint.y);

  return (
    <Layer listening={false}>
      <Rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={tool.zoneColor}
        stroke="rgba(255,255,255,0.3)"
        strokeWidth={1}
        cornerRadius={4}
        opacity={0.6}
      />
    </Layer>
  );
}
