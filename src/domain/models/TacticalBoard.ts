// ── Geometry Primitives ─────────────────────────────────────────────

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

// ── Team & Rod Configuration ────────────────────────────────────────

export type Team = "red" | "blue";

export interface RodConfig {
  index: number;
  team: Team;
  xPosition: number;
  figureCount: number;
  label: string;
}

// ── Board Elements ──────────────────────────────────────────────────

export interface FigureMarker {
  id: string;
  rodIndex: number;
  team: Team;
  position: Point;
  figureIndex: number;
}

export type ArrowType = "pass" | "shot" | "block";

export interface ArrowElement {
  id: string;
  arrowType: ArrowType;
  start: Point;
  end: Point;
}

export type ZoneShape = "rectangle" | "circle";

export interface ZoneElement {
  id: string;
  shape: ZoneShape;
  origin: Point;
  size: Size;
  color: string;
}

export interface BallMarker {
  id: string;
  position: Point;
}

// ── Tools ───────────────────────────────────────────────────────────

export type ToolType = "select" | "arrow" | "zone" | "eraser";

export interface ToolState {
  activeTool: ToolType;
  arrowType: ArrowType;
  zoneShape: ZoneShape;
  zoneColor: string;
}

// ── Scene ───────────────────────────────────────────────────────────

export interface TacticalScene {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  figures: FigureMarker[];
  arrows: ArrowElement[];
  zones: ZoneElement[];
  ball: BallMarker | null;
}

// ── Drawing In Progress ─────────────────────────────────────────────

export interface DrawingInProgress {
  type: "arrow" | "zone";
  startPoint: Point;
  currentPoint: Point;
}
