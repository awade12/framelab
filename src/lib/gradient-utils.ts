import type { CustomGradient, GradientPreset, Screenshot } from "../types";
import { gradientPresets as builtInGradientPresets } from "../constants";

export const DEFAULT_CUSTOM_GRADIENT: CustomGradient = {
  from: "#8b5cf6",
  to: "#ec4899",
  angle: 160,
};

export const buildGradientCss = (
  from: string,
  to: string,
  angle = 180,
): string => `linear-gradient(${angle}deg, ${from}, ${to})`;

export const resolveScreenshotGradient = (
  screenshot: Screenshot,
  userPresets: GradientPreset[] = [],
): { from: string; to: string; angle: number } => {
  if (screenshot.gradientPresetId === "custom" && screenshot.customGradient) {
    return screenshot.customGradient;
  }

  const allPresets = [...builtInGradientPresets, ...userPresets];
  const preset =
    allPresets.find((item) => item.id === screenshot.gradientPresetId) ??
    builtInGradientPresets[0];

  return {
    from: preset.from,
    to: preset.to,
    angle: preset.angle ?? 180,
  };
};

export const getScreenshotBackgroundStyle = (
  screenshot: Screenshot,
  userPresets: GradientPreset[] = [],
): string => {
  if (screenshot.backgroundMode === "gradient") {
    const { from, to, angle } = resolveScreenshotGradient(
      screenshot,
      userPresets,
    );
    return buildGradientCss(from, to, angle);
  }
  return screenshot.backgroundColor;
};
