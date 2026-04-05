import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "../../src/components/ui/Card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("applies className prop", () => {
    const { container } = render(<Card className="my-custom">Content</Card>);
    expect(container.firstChild).toHaveClass("my-custom");
  });

  it("applies interactive styles when interactive prop is true", () => {
    const { container } = render(<Card interactive>Content</Card>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("cursor-pointer");
    expect(el.className).toContain("hover:border-accent/40");
  });

  it("does not apply interactive styles when interactive is false", () => {
    const { container } = render(<Card>Content</Card>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).not.toContain("cursor-pointer");
  });
});
