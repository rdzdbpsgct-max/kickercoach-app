import { memo } from "react";
import { Layer, Rect, Line, Circle, Shape } from "react-konva";
import { FIELD, GOAL, RODS, BOARD_COLORS } from "../../../data/fieldConfig";

/**
 * Static foosball field background with soccer-style markings.
 * Memoized since it never changes.
 */
function FieldLayerInner() {
  const midY = FIELD.height / 2;
  const line = BOARD_COLORS.fieldLine;
  const lw = 2;

  // Soccer-style markings scaled to 1200×680
  const penaltyW = 180; // penalty area width from goal line
  const penaltyH = 400; // penalty area height (centered)
  const goalAreaW = 60; // goal area width from goal line
  const goalAreaH = 180; // goal area height (centered)
  const penaltySpot = 120; // penalty spot distance from goal line
  const arcR = 90; // penalty arc radius
  const centerR = 90; // center circle radius

  // Penalty arc: only draw the part outside the penalty area
  // Distance from penalty spot to penalty area edge = penaltyW - penaltySpot = 60
  const arcAngle = Math.acos((penaltyW - penaltySpot) / arcR);

  // Goal position
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

      {/* Outer boundary */}
      <Rect
        x={0}
        y={0}
        width={FIELD.width}
        height={FIELD.height}
        stroke={line}
        strokeWidth={lw}
      />

      {/* ── Center markings ── */}
      <Line
        points={[FIELD.width / 2, 0, FIELD.width / 2, FIELD.height]}
        stroke={line}
        strokeWidth={lw}
      />
      <Circle
        x={FIELD.width / 2}
        y={midY}
        radius={centerR}
        stroke={line}
        strokeWidth={lw}
      />
      <Circle
        x={FIELD.width / 2}
        y={midY}
        radius={5}
        fill={line}
      />

      {/* ── Left side ── */}

      {/* Left penalty area (Strafraum) */}
      <Rect
        x={0}
        y={midY - penaltyH / 2}
        width={penaltyW}
        height={penaltyH}
        stroke={line}
        strokeWidth={lw}
      />

      {/* Left goal area (Torraum) */}
      <Rect
        x={0}
        y={midY - goalAreaH / 2}
        width={goalAreaW}
        height={goalAreaH}
        stroke={line}
        strokeWidth={lw}
      />

      {/* Left penalty spot */}
      <Circle x={penaltySpot} y={midY} radius={4} fill={line} />

      {/* Left penalty arc (outside penalty area) */}
      <Shape
        sceneFunc={(ctx, shape) => {
          ctx.beginPath();
          ctx.arc(penaltySpot, midY, arcR, -arcAngle, arcAngle);
          ctx.fillStrokeShape(shape);
        }}
        stroke={line}
        strokeWidth={lw}
      />

      {/* Left goal */}
      <Rect
        x={0}
        y={goalY}
        width={GOAL.width}
        height={GOAL.height}
        stroke={line}
        strokeWidth={3}
        fill="rgba(0,0,0,0.25)"
      />

      {/* ── Right side ── */}

      {/* Right penalty area (Strafraum) */}
      <Rect
        x={FIELD.width - penaltyW}
        y={midY - penaltyH / 2}
        width={penaltyW}
        height={penaltyH}
        stroke={line}
        strokeWidth={lw}
      />

      {/* Right goal area (Torraum) */}
      <Rect
        x={FIELD.width - goalAreaW}
        y={midY - goalAreaH / 2}
        width={goalAreaW}
        height={goalAreaH}
        stroke={line}
        strokeWidth={lw}
      />

      {/* Right penalty spot */}
      <Circle
        x={FIELD.width - penaltySpot}
        y={midY}
        radius={4}
        fill={line}
      />

      {/* Right penalty arc (outside penalty area) */}
      <Shape
        sceneFunc={(ctx, shape) => {
          ctx.beginPath();
          ctx.arc(
            FIELD.width - penaltySpot,
            midY,
            arcR,
            Math.PI - arcAngle,
            Math.PI + arcAngle,
          );
          ctx.fillStrokeShape(shape);
        }}
        stroke={line}
        strokeWidth={lw}
      />

      {/* Right goal */}
      <Rect
        x={FIELD.width - GOAL.width}
        y={goalY}
        width={GOAL.width}
        height={GOAL.height}
        stroke={line}
        strokeWidth={3}
        fill="rgba(0,0,0,0.25)"
      />

      {/* ── Rod lines (dashed, subtle) ── */}
      {RODS.map((rod) => (
        <Line
          key={rod.index}
          points={[rod.xPosition, 0, rod.xPosition, FIELD.height]}
          stroke={line}
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
