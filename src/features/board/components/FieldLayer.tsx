import { memo } from "react";
import { Layer, Rect, Line, Circle, Shape } from "react-konva";
import { FIELD, GOAL, BOARD_COLORS } from "../../../data/fieldConfig";

/**
 * Static foosball field background with soccer-style markings.
 * Markings are sized to fall BETWEEN rod positions so they stay visible.
 *
 * Rod X-positions: 60, 180, 330, 480, 720, 870, 1020, 1140
 * Markings are placed in gaps between rods.
 */
function FieldLayerInner() {
  const midY = FIELD.height / 2;
  const line = BOARD_COLORS.fieldLine;
  const lw = 2;

  // Soccer-style markings — sized to avoid rod positions
  const penaltyW = 230; // ends at x=230 (between rod 1 @180 and rod 2 @330)
  const penaltyH = 400;
  const goalAreaW = 110; // ends at x=110 (between rod 0 @60 and rod 1 @180)
  const goalAreaH = 180;
  const penaltySpot = 150; // between rod 1 @180 and rod 0 @60
  const arcR = 90;
  const centerR = 90;

  // Penalty arc: only draw the part outside the penalty area
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

      {/* Left penalty area (Strafraum) — ends at x=230 */}
      <Rect
        x={0}
        y={midY - penaltyH / 2}
        width={penaltyW}
        height={penaltyH}
        stroke={line}
        strokeWidth={lw}
      />

      {/* Left goal area (Torraum) — ends at x=110 */}
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
        strokeWidth={2}
        fill="rgba(0,0,0,0.15)"
      />

      {/* ── Right side ── */}

      {/* Right penalty area (Strafraum) — starts at x=970 */}
      <Rect
        x={FIELD.width - penaltyW}
        y={midY - penaltyH / 2}
        width={penaltyW}
        height={penaltyH}
        stroke={line}
        strokeWidth={lw}
      />

      {/* Right goal area (Torraum) — starts at x=1090 */}
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
        strokeWidth={2}
        fill="rgba(0,0,0,0.15)"
      />
    </Layer>
  );
}

const FieldLayer = memo(FieldLayerInner);
export default FieldLayer;
