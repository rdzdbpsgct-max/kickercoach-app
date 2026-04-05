import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "../../src/components/ui/Modal";

describe("Modal", () => {
  it("renders when open=true", () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Test Title">
        Modal body
      </Modal>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Modal body")).toBeInTheDocument();
  });

  it("does not render when open=false", () => {
    render(
      <Modal open={false} onClose={vi.fn()} title="Test Title">
        Modal body
      </Modal>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls onClose when backdrop clicked", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(
      <Modal open={true} onClose={handleClose} title="Title">
        Body
      </Modal>,
    );
    // The backdrop is the element with aria-hidden="true"
    const backdrop = document.querySelector("[aria-hidden='true']") as HTMLElement;
    await user.click(backdrop);
    expect(handleClose).toHaveBeenCalledOnce();
  });

  it("renders title and children", () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="My Dialog">
        <p>Some content</p>
      </Modal>,
    );
    expect(screen.getByText("My Dialog")).toBeInTheDocument();
    expect(screen.getByText("Some content")).toBeInTheDocument();
  });
});
