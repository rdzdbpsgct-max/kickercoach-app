import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "../../src/components/ui/EmptyState";

describe("EmptyState", () => {
  it("renders icon, title, and description", () => {
    render(
      <EmptyState
        icon="📋"
        title="No items"
        description="Add your first item to get started."
      />,
    );
    expect(screen.getByText("📋")).toBeInTheDocument();
    expect(screen.getByText("No items")).toBeInTheDocument();
    expect(screen.getByText("Add your first item to get started.")).toBeInTheDocument();
  });

  it("renders without description when not provided", () => {
    render(<EmptyState icon="🎯" title="Empty" />);
    expect(screen.getByText("🎯")).toBeInTheDocument();
    expect(screen.getByText("Empty")).toBeInTheDocument();
  });
});
