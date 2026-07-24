import type { Screenshot } from "../types";
import { createDeviceInstance, cloneDeviceInstance } from "./device-instances";

const id = () => Math.random().toString(36).substring(2, 9);

export type ScreenshotTemplate = {
  id: string;
  name: string;
  description: string;
  screenshots: Array<
    Omit<Screenshot, "id" | "devices" | "activeDeviceId" | "overlayImages"> & {
      devices?: Array<Parameters<typeof createDeviceInstance>[0]>;
    }
  >;
};

const makeSet = (
  screens: Array<{
    headline: string;
    subheadline: string;
    backgroundColor: string;
    backgroundMode?: "solid" | "gradient";
    gradientPresetId?: string | null;
    textColor?: string;
    fontFamily?: string;
    headlineY?: number;
    subheadlineY?: number;
    device?: Parameters<typeof createDeviceInstance>[0];
  }>,
): ScreenshotTemplate["screenshots"] =>
  screens.map((screen) => ({
    headline: screen.headline,
    subheadline: screen.subheadline,
    backgroundColor: screen.backgroundColor,
    backgroundMode: screen.backgroundMode ?? "solid",
    backgroundImageSrc: null,
    backgroundImageZoom: 100,
    backgroundImageOffsetX: 0,
    backgroundImageOffsetY: 0,
    gradientPresetId: screen.gradientPresetId ?? null,
    textColor: screen.textColor ?? "#ffffff",
    headlineX: 50,
    headlineY: screen.headlineY ?? 8,
    headlineWidth: 86,
    subheadlineX: 50,
    subheadlineY: screen.subheadlineY ?? 16,
    subheadlineWidth: 78,
    fontFamily: screen.fontFamily ?? "Inter",
    devices: [screen.device ?? {}],
  }));

export const screenshotTemplates: ScreenshotTemplate[] = [
  {
    id: "feature-spotlight",
    name: "Feature Spotlight",
    description: "Bold headlines + centered phone. Classic App Store set.",
    screenshots: makeSet([
      {
        headline: "Built for speed",
        subheadline: "Launch faster and ship polished screenshots that convert.",
        backgroundColor: "#0f172a",
        device: { y: 28, scale: 88, style: "flat" },
      },
      {
        headline: "Beautiful by default",
        subheadline: "Device frames, typography, and layouts that look intentional.",
        backgroundColor: "#1e1b4b",
        device: { y: 30, scale: 86, style: "flat" },
      },
      {
        headline: "Multi-device ready",
        subheadline: "Compose iPhone, iPad, and Android frames in one canvas.",
        backgroundColor: "#134e4a",
        device: { y: 28, scale: 84, style: "3d", rotateY: -18, rotateX: 6 },
      },
      {
        headline: "Export in one click",
        subheadline: "Download App Store and Play Store sizes at retina quality.",
        backgroundColor: "#7c2d12",
        device: { y: 32, scale: 90, style: "flat" },
      },
      {
        headline: "Ship with confidence",
        subheadline: "Pixel-perfect exports that match what you see on canvas.",
        backgroundColor: "#111827",
        device: { y: 26, scale: 82, style: "3d", rotateY: 16, rotateX: 5 },
      },
    ]),
  },
  {
    id: "gradient-story",
    name: "Gradient Story",
    description: "Soft gradients with floating phones and airy type.",
    screenshots: makeSet([
      {
        headline: "Your app, elevated",
        subheadline: "Soft gradients and floating frames for a premium look.",
        backgroundColor: "#8b5cf6",
        backgroundMode: "gradient",
        gradientPresetId: "royal",
        fontFamily: "Plus Jakarta Sans",
        device: { y: 34, scale: 78, style: "3d", rotateY: -20, rotateX: 8 },
      },
      {
        headline: "Tell the story",
        subheadline: "Five screens. One cohesive visual narrative.",
        backgroundColor: "#06b6d4",
        backgroundMode: "gradient",
        gradientPresetId: "ocean",
        fontFamily: "Plus Jakarta Sans",
        device: { y: 36, scale: 76, style: "3d", rotateY: 18, rotateX: 7 },
      },
      {
        headline: "Highlight features",
        subheadline: "Keep focus on the product with clean spacing and type.",
        backgroundColor: "#10b981",
        backgroundMode: "gradient",
        gradientPresetId: "mint",
        fontFamily: "Plus Jakarta Sans",
        device: { y: 32, scale: 80, style: "flat" },
      },
      {
        headline: "Stay on brand",
        subheadline: "Apply colors, fonts, and layouts across every screen.",
        backgroundColor: "#f43f5e",
        backgroundMode: "gradient",
        gradientPresetId: "sunset",
        fontFamily: "Plus Jakarta Sans",
        device: { y: 34, scale: 78, style: "3d", rotateY: -14, rotateX: 5 },
      },
      {
        headline: "Ready to publish",
        subheadline: "Export Ultra PNGs for marketing sites and store listings.",
        backgroundColor: "#a855f7",
        backgroundMode: "gradient",
        gradientPresetId: "berry",
        fontFamily: "Plus Jakarta Sans",
        device: { y: 30, scale: 84, style: "flat" },
      },
    ]),
  },
  {
    id: "bleed-bottom",
    name: "Bleed Bottom",
    description: "Big type up top, phone bleeding off the bottom edge.",
    screenshots: makeSet([
      {
        headline: "Less clutter. More clarity.",
        subheadline: "A layout that puts your UI front and center.",
        backgroundColor: "#18181b",
        headlineY: 10,
        subheadlineY: 20,
        fontFamily: "Space Grotesk",
        device: { y: 48, scale: 110, style: "flat" },
      },
      {
        headline: "Designed to convert",
        subheadline: "Store screenshots that sell the experience in seconds.",
        backgroundColor: "#0c0a09",
        headlineY: 10,
        subheadlineY: 20,
        fontFamily: "Space Grotesk",
        device: { y: 50, scale: 112, style: "flat" },
      },
      {
        headline: "One consistent set",
        subheadline: "Reuse framing across every feature callout.",
        backgroundColor: "#1c1917",
        headlineY: 10,
        subheadlineY: 20,
        fontFamily: "Space Grotesk",
        device: { y: 48, scale: 108, style: "flat" },
      },
      {
        headline: "Modern and bold",
        subheadline: "Large headlines with room for your product UI.",
        backgroundColor: "#09090b",
        headlineY: 10,
        subheadlineY: 20,
        fontFamily: "Space Grotesk",
        device: { y: 52, scale: 115, style: "flat" },
      },
      {
        headline: "Export and ship",
        subheadline: "High-resolution PNGs ready for App Store Connect.",
        backgroundColor: "#171717",
        headlineY: 10,
        subheadlineY: 20,
        fontFamily: "Space Grotesk",
        device: { y: 48, scale: 110, style: "flat" },
      },
    ]),
  },
  {
    id: "dual-device",
    name: "Dual Device",
    description: "Two phones per screen for depth and comparison.",
    screenshots: [
      {
        headline: "See every angle",
        subheadline: "Layer multiple devices for richer compositions.",
        backgroundColor: "#020617",
        backgroundMode: "solid",
        backgroundImageSrc: null,
        backgroundImageZoom: 100,
        backgroundImageOffsetX: 0,
        backgroundImageOffsetY: 0,
        gradientPresetId: null,
        textColor: "#ffffff",
        headlineX: 50,
        headlineY: 7,
        headlineWidth: 88,
        subheadlineX: 50,
        subheadlineY: 14,
        subheadlineWidth: 80,
        fontFamily: "Manrope",
        devices: [
          { x: 34, y: 34, scale: 68, style: "3d", rotateY: -22, rotateX: 6 },
          { x: 66, y: 38, scale: 62, style: "3d", rotateY: 18, rotateX: 5 },
        ],
      },
      {
        headline: "Compare the flow",
        subheadline: "Show before and after, or two key screens together.",
        backgroundColor: "#111827",
        backgroundMode: "solid",
        backgroundImageSrc: null,
        backgroundImageZoom: 100,
        backgroundImageOffsetX: 0,
        backgroundImageOffsetY: 0,
        gradientPresetId: null,
        textColor: "#ffffff",
        headlineX: 50,
        headlineY: 7,
        headlineWidth: 88,
        subheadlineX: 50,
        subheadlineY: 14,
        subheadlineWidth: 80,
        fontFamily: "Manrope",
        devices: [
          { x: 36, y: 36, scale: 66, style: "flat", rotation: -8 },
          { x: 64, y: 36, scale: 66, style: "flat", rotation: 8 },
        ],
      },
      {
        headline: "Depth that sells",
        subheadline: "Perspective frames make your UI feel tangible.",
        backgroundColor: "#0f172a",
        backgroundMode: "gradient",
        backgroundImageSrc: null,
        backgroundImageZoom: 100,
        backgroundImageOffsetX: 0,
        backgroundImageOffsetY: 0,
        gradientPresetId: "royal",
        textColor: "#ffffff",
        headlineX: 50,
        headlineY: 7,
        headlineWidth: 88,
        subheadlineX: 50,
        subheadlineY: 14,
        subheadlineWidth: 80,
        fontFamily: "Manrope",
        devices: [
          { x: 32, y: 32, scale: 70, style: "3d", rotateY: -24, rotateX: 8 },
          { x: 68, y: 40, scale: 58, style: "3d", rotateY: 20, rotateX: 6 },
        ],
      },
      {
        headline: "Keep it cohesive",
        subheadline: "Same brand style across every multi-device layout.",
        backgroundColor: "#1e293b",
        backgroundMode: "solid",
        backgroundImageSrc: null,
        backgroundImageZoom: 100,
        backgroundImageOffsetX: 0,
        backgroundImageOffsetY: 0,
        gradientPresetId: null,
        textColor: "#ffffff",
        headlineX: 50,
        headlineY: 7,
        headlineWidth: 88,
        subheadlineX: 50,
        subheadlineY: 14,
        subheadlineWidth: 80,
        fontFamily: "Manrope",
        devices: [
          { x: 38, y: 34, scale: 64, style: "3d", rotateY: -16, rotateX: 5 },
          { x: 62, y: 36, scale: 64, style: "3d", rotateY: 16, rotateX: 5 },
        ],
      },
      {
        headline: "Ready for launch",
        subheadline: "Finish the set, export Ultra, and submit.",
        backgroundColor: "#020617",
        backgroundMode: "solid",
        backgroundImageSrc: null,
        backgroundImageZoom: 100,
        backgroundImageOffsetX: 0,
        backgroundImageOffsetY: 0,
        gradientPresetId: null,
        textColor: "#ffffff",
        headlineX: 50,
        headlineY: 7,
        headlineWidth: 88,
        subheadlineX: 50,
        subheadlineY: 14,
        subheadlineWidth: 80,
        fontFamily: "Manrope",
        devices: [
          { x: 35, y: 33, scale: 70, style: "flat" },
          { x: 65, y: 39, scale: 60, style: "3d", rotateY: 22, rotateX: 7 },
        ],
      },
    ],
  },
];

export const applyScreenshotTemplate = (
  template: ScreenshotTemplate,
  fallbackDeviceId: string,
  fallbackColorId: string,
): Screenshot[] =>
  template.screenshots.map((screen) => {
    const devices = (screen.devices ?? [{}]).map((deviceOverrides) => {
      const device = deviceOverrides ?? {};
      return createDeviceInstance({
        ...device,
        deviceId: device.deviceId ?? fallbackDeviceId,
        colorId: device.colorId ?? fallbackColorId,
        id: id(),
      });
    });

    return {
      id: id(),
      headline: screen.headline,
      subheadline: screen.subheadline,
      backgroundColor: screen.backgroundColor,
      backgroundMode: screen.backgroundMode,
      backgroundImageSrc: screen.backgroundImageSrc ?? null,
      backgroundImageZoom: screen.backgroundImageZoom ?? 100,
      backgroundImageOffsetX: screen.backgroundImageOffsetX ?? 0,
      backgroundImageOffsetY: screen.backgroundImageOffsetY ?? 0,
      gradientPresetId: screen.gradientPresetId,
      textColor: screen.textColor,
      headlineX: screen.headlineX,
      headlineY: screen.headlineY,
      headlineWidth: screen.headlineWidth,
      subheadlineX: screen.subheadlineX,
      subheadlineY: screen.subheadlineY,
      subheadlineWidth: screen.subheadlineWidth,
      fontFamily: screen.fontFamily,
      overlayImages: [],
      devices,
      activeDeviceId: devices[0].id,
    };
  });

export const applyStyleFromScreenshot = (
  source: Screenshot,
  targets: Screenshot[],
): Screenshot[] =>
  targets.map((target) => ({
    ...target,
    backgroundColor: source.backgroundColor,
    backgroundMode: source.backgroundMode,
    backgroundImageSrc: source.backgroundImageSrc,
    backgroundImageZoom: source.backgroundImageZoom,
    backgroundImageOffsetX: source.backgroundImageOffsetX,
    backgroundImageOffsetY: source.backgroundImageOffsetY,
    gradientPresetId: source.gradientPresetId,
    customGradient: source.customGradient ?? null,
    textColor: source.textColor,
    fontFamily: source.fontFamily,
    headlineWidth: source.headlineWidth,
    subheadlineWidth: source.subheadlineWidth,
    headlineX: source.headlineX,
    headlineY: source.headlineY,
    subheadlineX: source.subheadlineX,
    subheadlineY: source.subheadlineY,
    devices: target.devices.map((device, index) => {
      const sourceDevice =
        source.devices[Math.min(index, source.devices.length - 1)] ??
        source.devices[0];
      return cloneDeviceInstance(device, {
        id: device.id,
        screenshotSrc: device.screenshotSrc,
        deviceId: sourceDevice.deviceId,
        colorId: sourceDevice.colorId,
        x: sourceDevice.x,
        y: sourceDevice.y,
        scale: sourceDevice.scale,
        rotation: sourceDevice.rotation,
        style: sourceDevice.style,
        rotateY: sourceDevice.rotateY,
        rotateX: sourceDevice.rotateX,
        shadow: sourceDevice.shadow,
        screenZoom: sourceDevice.screenZoom,
        screenOffsetX: sourceDevice.screenOffsetX,
        screenOffsetY: sourceDevice.screenOffsetY,
      });
    }),
  }));
