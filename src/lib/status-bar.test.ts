import { describe, expect, it } from "vitest";
import { DEFAULT_STATUS_BAR, normalizeStatusBar } from "./status-bar";

describe("normalizeStatusBar", () => {
  it("fills defaults for missing values", () => {
    expect(normalizeStatusBar(undefined)).toEqual(DEFAULT_STATUS_BAR);
  });

  it("clamps battery and preserves custom time", () => {
    expect(
      normalizeStatusBar({
        enabled: true,
        time: "12:30",
        battery: 140,
        signal: "low",
        style: "dark",
      }),
    ).toMatchObject({
      enabled: true,
      time: "12:30",
      battery: 100,
      signal: "low",
      style: "dark",
    });
  });
});
