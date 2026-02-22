import { Layer, Arrow, Rect, Circle } from "react-konva";
import type {
  ArrowElement,
  ZoneElement,
} from "../../../domain/models/TacticalBoard";
import { ARROW_STYLES } from "../../../data/fieldConfig";

interface AnnotationLayerProps {
  arrows: ArrowElement[];
  zones: ZoneElement[];
  selectedElementId: string | null;
  onClickElement: (id: string) => void;
}

export default function AnnotationLayer({
  arrows,
  zones,
  selectedElementId,
  onClickElement,
}: AnnotationLayerProps) {
  return (
    <Layer>
      {/* Zones (drawn below arrows) */}
      {zones.map((zone) => {
        const isSelected = zone.id === selectedElementId;

        if (zone.shape === "circle") {
          const r = zone.size.width / 2;
          return (
            <Circle
              key={zone.id}
              x={zone.origin.x + r}
              y={zone.origin.y + r}
              radius={r}
              fill={zone.color}
              stroke={isSelected ? "#818cf8" : "transparent"}
              strokeWidth={isSelected ? 2 : 0}
              onClick={() => onClickElement(zone.id)}
              onTap={() => onClickElement(zone.id)}
            />
          );
        }

        return (
          <Rect
            key={zone.id}
            x={zone.origin.x}
            y={zone.origin.y}
            width={zone.size.width}
            height={zone.size.height}
            fill={zone.color}
            stroke={isSelected ? "#818cf8" : "transparent"}
            strokeWidth={isSelected ? 2 : 0}
            cornerRadius={4}
            onClick={() => onClickElement(zone.id)}
            onTap={() => onClickElement(zone.id)}
          />
        );
      })}

      {/* Arrows */}
      {arrows.map((arrow) => {
        const style = ARROW_STYLES[arrow.arrowType] || ARROW_STYLES.pass;
        const isSelected = arrow.id === selectedElementId;

        return (
          <Arrow
            key={arrow.id}
            points={[arrow.start.x, arrow.start.y, arrow.end.x, arrow.end.y]}
            stroke={isSelected ? "#818cf8" : style.color}
            strokeWidth={style.strokeWidth}
            dash={style.dash}
            fill={isSelected ? "#818cf8" : style.color}
            pointerLength={10}
            pointerWidth={8}
            hitStrokeWidth={20}
            onClick={() => onClickElement(arrow.id)}
            onTap={() => onClickElement(arrow.id)}
          />
        );
      })}
    </Layer>
  );
}
