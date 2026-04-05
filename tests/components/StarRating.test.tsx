import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StarRating } from "../../src/components/ui/StarRating";

describe("StarRating", () => {
  it("renders correct number of filled stars", () => {
    render(<StarRating rating={3} />);
    const el = screen.getByText(/★/);
    const text = el.textContent!;
    const filled = (text.match(/★/g) || []).length;
    expect(filled).toBe(3);
  });

  it("renders 5 stars total by default", () => {
    render(<StarRating rating={2} />);
    const el = screen.getByText(/[★☆]/);
    const text = el.textContent!;
    const total = (text.match(/[★☆]/g) || []).length;
    expect(total).toBe(5);
  });

  it("respects custom max prop", () => {
    render(<StarRating rating={1} max={3} />);
    const el = screen.getByText(/[★☆]/);
    const text = el.textContent!;
    const total = (text.match(/[★☆]/g) || []).length;
    expect(total).toBe(3);
  });
});
