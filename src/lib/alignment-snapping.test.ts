import { describe, expect, it } from "vitest";
import type { Screenshot } from "../types";
import {
  collectAlignmentTargets,
  snapDragPosition,
} from "./alignment-snapping";

const screenshot: Screenshot = {
  id: "s1",
  headline: "Title",
  subheadline: "Subtitle",
  backgroundColor: "#000",
  backgroundMode: "solid",
  backgroundImageSrc: null,
  backgroundImageZoom: 100,
  backgroundImageOffsetX: 0,
  backgroundImageOffsetY: 0,
  gradientPresetId: null,
  textColor: "#fff",
  headlineX: 50,
  headlineY: 10,
  headlineWidth: 80,
  subheadlineX: 50,
  subheadlineY: 18,
  subheadlineWidth: 80,
  fontFamily: "Inter",
  overlayImages: [
    {
      id: "img-1",
      src: "",
      x: 20,
      y: 30,
      width: 20,
      height: 20,
      layer: "front",
      rotation: 0,
      shadow: {
        enabled: false,
        color: "#000",
        blur: 0,
        offsetX: 0,
        offsetY: 0,
      },
    },
  ],
  devices: [
    {
      id: "dev-1",
      deviceId: "iphone-15-pro-max",
      colorId: "black-titanium",
      screenshotSrc: null,
      x: 50,
      y: 45,
      scale: 65,
      rotation: 0,
      shadow: {
        enabled: false,
        color: "#000",
        blur: 0,
        offsetX: 0,
        offsetY: 0,
      },
      style: "flat",
      rotateY: 0,
      rotateX: 0,
      screenZoom: 100,
      screenOffsetX: 0,
      screenOffsetY: 0,
      showFrame: true,
      statusBar: {
        enabled: false,
        time: "9:41",
        style: "light",
        signal: "full",
        battery: 100,
        showWifi: true,
      },
    },
  ],
  activeDeviceId: "dev-1",
};

describe("alignment-snapping", () => {
  it("collects canvas, element, and edge targets", () => {
    const targets = collectAlignmentTargets(screenshot, { type: "headline" });
    expect(targets.xTargets).toContain(50);
    expect(targets.xTargets).toContain(20);
    expect(targets.xTargets).toContain(17.5);
    expect(targets.yTargets).toContain(18);
    expect(targets.yTargets).not.toContain(10);
  });

  it("snaps near center and returns guides", () => {
    const targets = collectAlignmentTargets(screenshot, {
      type: "device",
      id: "dev-1",
    });
    const result = snapDragPosition(49.2, 44.5, targets, 1.5);
    expect(result.x).toBe(50);
    expect(
      result.guides.some(
        (guide) => guide.orientation === "vertical" && guide.position === 50,
      ),
    ).toBe(true);
  });

  it("snaps to equal spacing midpoint", () => {
    const targets = collectAlignmentTargets(screenshot, { type: "subheadline" });
    const midpoint = 20 + (50 - 20) / 2;
    const result = snapDragPosition(midpoint + 0.5, 18, targets, 1.5);
    expect(result.guides.some((guide) => guide.kind === "spacing")).toBe(true);
  });
});
