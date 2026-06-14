import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("exposes a slider role with current value when interactive", () => {
    render(<StarRating rating={3} onChange={vi.fn()} />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuenow", "3");
    expect(slider).toHaveAttribute("aria-valuemax", "5");
  });

  it("increases value with ArrowRight", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<StarRating rating={3} onChange={onChange} />);
    screen.getByRole("slider").focus();
    await user.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("decreases value with ArrowLeft and clamps at 0", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<StarRating rating={0} onChange={onChange} />);
    screen.getByRole("slider").focus();
    await user.keyboard("{ArrowLeft}");
    expect(onChange).toHaveBeenCalledWith(0);
  });
});
