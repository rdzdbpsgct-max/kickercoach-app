import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "../../src/components/ui/SearchBar";

describe("SearchBar", () => {
  it("renders with placeholder", () => {
    render(<SearchBar value="" onChange={vi.fn()} placeholder="Search players..." />);
    expect(screen.getByPlaceholderText("Search players...")).toBeInTheDocument();
  });

  it("renders with default placeholder", () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText("Suchen...")).toBeInTheDocument();
  });

  it("calls onChange when typing", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<SearchBar value="" onChange={handleChange} />);
    const input = screen.getByPlaceholderText("Suchen...");
    await user.type(input, "test");
    // Each character triggers onChange individually
    expect(handleChange).toHaveBeenCalledTimes(4);
    expect(handleChange).toHaveBeenCalledWith("t");
  });
});
