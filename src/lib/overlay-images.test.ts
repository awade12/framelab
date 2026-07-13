import { describe, expect, it } from "vitest";
import { createOverlayFromImage, filterImageFiles } from "./overlay-images";

describe("createOverlayFromImage", () => {
  it("preserves aspect ratio from source dimensions", () => {
    const overlay = createOverlayFromImage("data:image/png;base64,abc", 400, 200, {
      x: 25,
      y: 75,
      defaultWidth: 40,
    });

    expect(overlay.x).toBe(25);
    expect(overlay.y).toBe(75);
    expect(overlay.width).toBe(40);
    expect(overlay.height).toBe(20);
    expect(overlay.layer).toBe("front");
  });
});

describe("filterImageFiles", () => {
  it("keeps only image files", () => {
    const files = filterImageFiles([
      new File(["a"], "logo.png", { type: "image/png" }),
      new File(["b"], "notes.txt", { type: "text/plain" }),
      new File(["c"], "badge.svg", { type: "image/svg+xml" }),
    ]);

    expect(files).toHaveLength(2);
    expect(files.map((file) => file.name)).toEqual(["logo.png", "badge.svg"]);
  });
});
