import { describe, expect, it, vi } from "vitest";
import { runPostRenderPhases } from "./export-progress";

describe("runPostRenderPhases", () => {
  it("waits at least the minimum duration before finishing", async () => {
    vi.useFakeTimers();
    const updates: number[] = [];
    const startTime = Date.now();

    const promise = runPostRenderPhases(
      startTime,
      (update) => {
        updates.push(update.progress);
      },
      10_000,
    );

    await vi.runAllTimersAsync();
    await promise;

    expect(updates.at(-1)).toBe(98);
    vi.useRealTimers();
  });
});
