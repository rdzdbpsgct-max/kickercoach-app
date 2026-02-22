import type {
  Point,
  ArrowElement,
  ZoneElement,
} from "../../../domain/models/TacticalBoard";
import { RODS, FIELD, FIELD_MARGIN } from "../../../data/fieldConfig";

/** Get the constraint bounds for a figure on a given rod */
export function getRodConstraint(rodIndex: number) {
  const rod = RODS.find((r) => r.index === rodIndex);
  if (!rod) return { x: 0, minY: FIELD_MARGIN, maxY: FIELD.height - FIELD_MARGIN };
  return {
    x: rod.xPosition,
    minY: FIELD_MARGIN,
    maxY: FIELD.height - FIELD_MARGIN,
  };
}

/** Distance from point to line segment */
function distToSegment(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(p.x - a.x, p.y - a.y);
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

/** Check if a point is inside a rectangle zone */
function pointInRect(p: Point, zone: ZoneElement): boolean {
  return (
    p.x >= zone.origin.x &&
    p.x <= zone.origin.x + zone.size.width &&
    p.y >= zone.origin.y &&
    p.y <= zone.origin.y + zone.size.height
  );
}

/** Check if a point is inside a circle zone */
function pointInCircle(p: Point, zone: ZoneElement): boolean {
  const cx = zone.origin.x + zone.size.width / 2;
  const cy = zone.origin.y + zone.size.height / 2;
  const r = zone.size.width / 2;
  return Math.hypot(p.x - cx, p.y - cy) <= r;
}

/** Hit-test arrows and zones at a given point. Returns first matched ID or null. */
export function hitTest(
  point: Point,
  arrows: ArrowElement[],
  zones: ZoneElement[],
  hitRadius: number = 15,
): string | null {
  // Check arrows first (drawn on top)
  for (const arrow of arrows) {
    if (distToSegment(point, arrow.start, arrow.end) <= hitRadius) {
      return arrow.id;
    }
  }
  // Check zones
  for (const zone of zones) {
    if (zone.shape === "rectangle" && pointInRect(point, zone)) {
      return zone.id;
    }
    if (zone.shape === "circle" && pointInCircle(point, zone)) {
      return zone.id;
    }
  }
  return null;
}
