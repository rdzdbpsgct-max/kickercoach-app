import { memo } from "react";
import { Layer, Rect, Line, Circle } from "react-konva";
import { FIELD, GOAL, RODS, BOARD_COLORS } from "../../../data/fieldConfig";

/** Static foosball field background — memoized since it never changes */
function FieldLayerInner() {
  const goalY = (FIELD.height - GOAL.height) / 2;

  return (
    <Layer listening={false}>
      {/* Field border (wooden frame) */}
      <Rect
        x={-4}
        y={-4}
        width={FIELD.width + 8}
        height={FIELD.height + 8}
        fill={BOARD_COLORS.fieldBorder}
        cornerRadius={8}
      />

      {/* Green playing surface */}
      <Rect
        x={0}
        y={0}
        width={FIELD.width}
        height={FIELD.height}
        fill={BOARD_COLORS.field}
      />

      {/* Left goal (inside field edge) */}
      <Rect
        x={0}
        y={goalY}
        width={GOAL.width}
        height={GOAL.height}
        stroke="rgba(255,255,255,0.8)"
        strokeWidth={3}
        fill="rgba(0,0,0,0.3)"
      />
      {/* Left goal net lines */}
      <Line
        points={[GOAL.width / 3, goalY, GOAL.width / 3, goalY + GOAL.height]}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={1}
      />
      <Line
        points={[(GOAL.width * 2) / 3, goalY, (GOAL.width * 2) / 3, goalY + GOAL.height]}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={1}
      />

      {/* Right goal (inside field edge) */}
      <Rect
        x={FIELD.width - GOAL.width}
        y={goalY}
        width={GOAL.width}
        height={GOAL.height}
        stroke="rgba(255,255,255,0.8)"
        strokeWidth={3}
        fill="rgba(0,0,0,0.3)"
      />
      {/* Right goal net lines */}
      <Line
        points={[FIELD.width - GOAL.width / 3, goalY, FIELD.width - GOAL.width / 3, goalY + GOAL.height]}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={1}
      />
      <Line
        points={[FIELD.width - (GOAL.width * 2) / 3, goalY, FIELD.width - (GOAL.width * 2) / 3, goalY + GOAL.height]}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={1}
      />

      {/* Center line */}
      <Line
        points={[FIELD.width / 2, 0, FIELD.width / 2, FIELD.height]}
        stroke={BOARD_COLORS.fieldLine}
        strokeWidth={2}
      />

      {/* Center circle */}
      <Circle
        x={FIELD.width / 2}
        y={FIELD.height / 2}
        radius={60}
        stroke={BOARD_COLORS.fieldLine}
        strokeWidth={2}
      />

      {/* Center dot */}
      <Circle
        x={FIELD.width / 2}
        y={FIELD.height / 2}
        radius={4}
        fill={BOARD_COLORS.fieldLine}
      />

      {/* Rod lines (dashed vertical) */}
      {RODS.map((rod) => (
        <Line
          key={rod.index}
          points={[rod.xPosition, 0, rod.xPosition, FIELD.height]}
          stroke={BOARD_COLORS.fieldLine}
          strokeWidth={1}
          dash={[8, 8]}
          opacity={0.5}
        />
      ))}
    </Layer>
  );
}

const FieldLayer = memo(FieldLayerInner);
export default FieldLayer;
