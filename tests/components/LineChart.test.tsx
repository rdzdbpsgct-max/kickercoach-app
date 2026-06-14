import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { LineChart } from "../../src/components/ui/LineChart";

describe("LineChart", () => {
  const series = [
    { label: "A", color: "#ef4444", points: [1, 3, 5] },
    { label: "B", color: "#3b82f6", points: [2, 2, 4] },
  ];
  const xLabels = ["Jan", "Feb", "Mar"];

  it("renders one polyline per series", () => {
    const { container } = render(
      <LineChart series={series} xLabels={xLabels} minValue={1} maxValue={5} />,
    );
    expect(container.querySelectorAll("polyline")).toHaveLength(2);
  });

  it("renders an accessible svg", () => {
    const { container } = render(
      <LineChart series={series} xLabels={xLabels} ariaLabel="Skill trends" />,
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Skill trends");
  });

  it("renders nothing meaningful for empty series", () => {
    const { container } = render(<LineChart series={[]} xLabels={[]} />);
    expect(container.querySelectorAll("polyline")).toHaveLength(0);
  });
});
