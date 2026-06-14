import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar } from "../../src/components/ui/Avatar";

describe("Avatar", () => {
  it("renders the uppercased first letter of the name", () => {
    render(<Avatar name="anna" />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("falls back to '?' for an empty name", () => {
    render(<Avatar name="   " />);
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("uses the provided color", () => {
    const { container } = render(<Avatar name="Bo" color="#123456" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.backgroundColor).toBe("rgb(18, 52, 86)");
  });

  it("falls back to the accent token when no color is given", () => {
    const { container } = render(<Avatar name="Bo" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.backgroundColor).toBe("var(--color-accent)");
  });
});
