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

  it("uses tablist/tab roles and marks the active tab as selected", () => {
    render(<Tabs tabs={[...tabs]} active="offense" onChange={vi.fn()} />);
    expect(screen.getByRole("tablist")).toBeInTheDocument();

    const offenseTab = screen.getByRole("tab", { name: "Offensive" });
    expect(offenseTab).toHaveAttribute("aria-selected", "true");
    expect(offenseTab).toHaveAttribute("tabindex", "0");

    const allTab = screen.getByRole("tab", { name: "Alle" });
    expect(allTab).toHaveAttribute("aria-selected", "false");
    expect(allTab).toHaveAttribute("tabindex", "-1");
  });

  it("moves to the next tab with ArrowRight", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn<(value: TabValue) => void>();
    render(<Tabs tabs={[...tabs]} active="all" onChange={handleChange} />);
    screen.getByRole("tab", { name: "Alle" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(handleChange).toHaveBeenCalledWith("offense");
  });

  it("wraps to the last tab with ArrowLeft from the first", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn<(value: TabValue) => void>();
    render(<Tabs tabs={[...tabs]} active="all" onChange={handleChange} />);
    screen.getByRole("tab", { name: "Alle" }).focus();
    await user.keyboard("{ArrowLeft}");
    expect(handleChange).toHaveBeenCalledWith("defense");
  });
});
