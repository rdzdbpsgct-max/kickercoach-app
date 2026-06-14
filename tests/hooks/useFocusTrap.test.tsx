import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef } from "react";
import { useFocusTrap } from "../../src/hooks/useFocusTrap";

function Harness({ open }: { open: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, open);
  return (
    <div ref={ref}>
      <button>first</button>
      <button>last</button>
    </div>
  );
}

describe("useFocusTrap", () => {
  it("moves focus to the first focusable when active", () => {
    render(<Harness open />);
    expect(screen.getByText("first")).toHaveFocus();
  });

  it("wraps Tab from last back to first", async () => {
    const user = userEvent.setup();
    render(<Harness open />);
    screen.getByText("last").focus();
    await user.tab();
    expect(screen.getByText("first")).toHaveFocus();
  });

  it("wraps Shift+Tab from first to last", async () => {
    const user = userEvent.setup();
    render(<Harness open />);
    screen.getByText("first").focus();
    await user.tab({ shift: true });
    expect(screen.getByText("last")).toHaveFocus();
  });
});
