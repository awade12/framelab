/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EditorToolbar } from "./EditorToolbar";

describe("EditorToolbar", () => {
  it("renders formatting controls with custom tooltips", () => {
    render(
      <EditorToolbar
        activeStyles={{
          bold: false,
          italic: false,
          underline: false,
          strikethrough: false,
          alignLeft: true,
          alignCenter: false,
          alignRight: false,
        }}
        textColor="#ffffff"
        backgroundColor="#fef08a"
        onCommand={vi.fn()}
        onColorChange={vi.fn()}
        onBackgroundColorChange={vi.fn()}
        onClearHighlight={vi.fn()}
        onCaseTransform={vi.fn()}
      />,
    );

    const boldButton = screen.getByRole("button", { name: "Bold (Ctrl+B)" });
    expect(boldButton.getAttribute("title")).toBeNull();
    expect(screen.getByText("Bold (Ctrl+B)")).toBeDefined();

    expect(screen.getByRole("button", { name: "Text Color" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Highlight Color" })).toBeDefined();
    expect(
      screen.getByRole("button", { name: "Strikethrough (Ctrl+Shift+X)" }),
    ).toBeDefined();
    expect(screen.getByRole("button", { name: "Clear Formatting" })).toBeDefined();
    expect(screen.getByRole("button", { name: "UPPERCASE" })).toBeDefined();
  });
});
