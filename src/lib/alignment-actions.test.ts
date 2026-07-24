import { describe, expect, it } from "vitest";
import {
  getAlignUpdates,
  snapFlatRotation,
  snapRotateY,
} from "./alignment-actions";
import type { Screenshot } from "../types";

const screenshot: Screenshot = {
  id: "s1",
  headline: "Hi",
  subheadline: "There",
  backgroundColor: "#000",
  backgroundMode: "solid",
  backgroundImageSrc: null,
  backgroundImageZoom: 100,
  backgroundImageOffsetX: 0,
  backgroundImageOffsetY: 0,
  gradientPresetId: null,
  textColor: "#fff",
  headlineX: 20,
  headlineY: 10,
  headlineWidth: 80,
  subheadlineX: 25,
  subheadlineY: 18,
  subheadlineWidth: 80,
  fontFamily: "Inter",
  overlayImages: [],
  devices: [
    {
      id: "dev-1",
      deviceId: "iphone-15-pro-max",
      colorId: "black-titanium",
      screenshotSrc: null,
      x: 62,
      y: 40,
      scale: 65,
      rotation: 7,
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

const exportSize = { id: "iphone-1260", label: "", width: 1260, height: 2736 };

describe("alignment-actions", () => {
  it("centers headline horizontally", () => {
    const updates = getAlignUpdates(
      { type: "headline", screenshotId: "s1" },
      screenshot,
      "center-h",
      exportSize,
      () => ({ id: "iphone-15-pro-max", label: "", width: 430, height: 932, screenInset: { top: 0, right: 0, bottom: 0, left: 0 }, cornerRadius: 0, frameRadius: { outer: "0", inner: "0" }, notchWidth: 0, notchHeight: 0, hasIsland: true, colors: [] }),
    );
    expect(updates?.headlineX).toBe(50);
  });

  it("aligns headline to device", () => {
    const updates = getAlignUpdates(
      { type: "headline", screenshotId: "s1" },
      screenshot,
      "to-device",
      exportSize,
      () => ({ id: "iphone-15-pro-max", label: "", width: 430, height: 932, screenInset: { top: 0, right: 0, bottom: 0, left: 0 }, cornerRadius: 0, frameRadius: { outer: "0", inner: "0" }, notchWidth: 0, notchHeight: 0, hasIsland: true, colors: [] }),
    );
    expect(updates?.headlineX).toBe(62);
    expect(updates?.headlineY).toBeLessThan(40);
  });

  it("snaps rotation to nearest 15 degrees", () => {
    expect(snapFlatRotation(3)).toBe(0);
    expect(snapFlatRotation(14)).toBe(15);
    expect(snapRotateY(14)).toBe(15);
  });
});
