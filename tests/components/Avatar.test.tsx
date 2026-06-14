import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Avatar,
  AVATAR_FALLBACK_COLOR,
} from "../../src/components/ui/Avatar";

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

  it("falls back to the shared fallback color when none is given", () => {
    const { container } = render(<Avatar name="Bo" />);
    const el = container.firstChild as HTMLElement;
    // #6366f1 → rgb(99, 102, 241)
    expect(el.style.backgroundColor).toBe("rgb(99, 102, 241)");
    expect(AVATAR_FALLBACK_COLOR).toBe("#6366f1");
  });

  it("applies caller-provided sizing classes", () => {
    const { container } = render(
      <Avatar name="Bo" className="h-10 w-10 rounded-xl text-lg" />,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("h-10");
    expect(el.className).toContain("rounded-xl");
  });
});
