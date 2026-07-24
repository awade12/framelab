import { describe, expect, it } from "vitest";
import { getCoverImageRect } from "./screen-image";
import {
  applyScreenshotTemplate,
  applyStyleFromScreenshot,
  screenshotTemplates,
} from "./templates";
import { createDeviceInstance } from "./device-instances";

describe("getCoverImageRect", () => {
  it("covers the destination and supports zoom offsets", () => {
    const rect = getCoverImageRect(100, 200, 0, 0, 100, 100, 150, 0, 0);
    expect(rect.width).toBeGreaterThan(100);
    expect(rect.height).toBeGreaterThan(100);
  });
});

describe("templates", () => {
  it("builds full screenshot sets from templates", () => {
    const template = screenshotTemplates[0];
    const screenshots = applyScreenshotTemplate(
      template,
      "iphone-15-pro-max",
      "black",
    );
    expect(screenshots).toHaveLength(template.screenshots.length);
    expect(screenshots[0].devices[0].deviceId).toBe("iphone-15-pro-max");
  });

  it("applies style from one screenshot to the rest", () => {
    const source = {
      id: "a",
      headline: "A",
      subheadline: "A sub",
      backgroundColor: "#111111",
      backgroundMode: "solid" as const,
      backgroundImageSrc: null,
      backgroundImageZoom: 100,
      backgroundImageOffsetX: 0,
      backgroundImageOffsetY: 0,
      gradientPresetId: null,
      textColor: "#eeeeee",
      headlineX: 50,
      headlineY: 10,
      headlineWidth: 80,
      subheadlineX: 50,
      subheadlineY: 18,
      subheadlineWidth: 80,
      fontFamily: "Inter",
      overlayImages: [],
      devices: [
        createDeviceInstance({
          deviceId: "iphone-15-pro",
          colorId: "blue",
          scale: 70,
        }),
      ],
      activeDeviceId: "x",
    };
    source.activeDeviceId = source.devices[0].id;

    const target = {
      ...source,
      id: "b",
      headline: "Keep me",
      backgroundColor: "#ffffff",
      devices: [
        createDeviceInstance({
          screenshotSrc: "data:image/png;base64,abc",
          scale: 90,
        }),
      ],
      activeDeviceId: "",
    };
    target.activeDeviceId = target.devices[0].id;

    const [styled] = applyStyleFromScreenshot(source, [target]);
    expect(styled.headline).toBe("Keep me");
    expect(styled.backgroundColor).toBe("#111111");
    expect(styled.devices[0].screenshotSrc).toBe("data:image/png;base64,abc");
    expect(styled.devices[0].deviceId).toBe("iphone-15-pro");
    expect(styled.devices[0].scale).toBe(70);
  });
});
