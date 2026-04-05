import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs } from "../../src/components/ui/Tabs";

const tabs = [
  { value: "all", label: "Alle" },
  { value: "offense", label: "Offensive" },
  { value: "defense", label: "Defensive" },
] as const;

type TabValue = (typeof tabs)[number]["value"];

describe("Tabs", () => {
  it("renders all tab labels", () => {
    render(<Tabs tabs={[...tabs]} active="all" onChange={vi.fn()} />);
    expect(screen.getByText("Alle")).toBeInTheDocument();
    expect(screen.getByText("Offensive")).toBeInTheDocument();
    expect(screen.getByText("Defensive")).toBeInTheDocument();
  });

  it("calls onChange when tab clicked", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn<(value: TabValue) => void>();
    render(<Tabs tabs={[...tabs]} active="all" onChange={handleChange} />);
    await user.click(screen.getByText("Offensive"));
    expect(handleChange).toHaveBeenCalledWith("offense");
  });

  it("highlights active tab", () => {
    render(<Tabs tabs={[...tabs]} active="offense" onChange={vi.fn()} />);
    const offenseTab = screen.getByText("Offensive").closest("button")!;
    expect(offenseTab).toHaveAttribute("aria-pressed", "true");

    const allTab = screen.getByText("Alle").closest("button")!;
    expect(allTab).toHaveAttribute("aria-pressed", "false");
  });
});
