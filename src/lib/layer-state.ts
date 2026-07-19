import type { LayerEntry } from "./layer-stack";
import type { Screenshot, SelectedElement } from "../types";

export const isLayerLocked = (
  screenshot: Screenshot,
  entry: LayerEntry,
): boolean => {
  if (entry.kind === "headline") return Boolean(screenshot.headlineLocked);
  if (entry.kind === "subheadline") return Boolean(screenshot.subheadlineLocked);
  if (entry.kind === "device") {
    return Boolean(
      screenshot.devices.find((device) => device.id === entry.id)?.locked,
    );
  }
  if (entry.kind === "overlay") {
    return Boolean(
      screenshot.overlayImages.find((image) => image.id === entry.id)?.locked,
    );
  }
  return false;
};

export const isLayerHidden = (
  screenshot: Screenshot,
  entry: LayerEntry,
): boolean => {
  if (entry.kind === "headline") return Boolean(screenshot.headlineHidden);
  if (entry.kind === "subheadline") return Boolean(screenshot.subheadlineHidden);
  if (entry.kind === "device") {
    return Boolean(
      screenshot.devices.find((device) => device.id === entry.id)?.hidden,
    );
  }
  if (entry.kind === "overlay") {
    return Boolean(
      screenshot.overlayImages.find((image) => image.id === entry.id)?.hidden,
    );
  }
  return false;
};

export const isSelectedElementLocked = (
  screenshot: Screenshot,
  selected: SelectedElement,
): boolean => {
  if (selected.type === "headline") return Boolean(screenshot.headlineLocked);
  if (selected.type === "subheadline") {
    return Boolean(screenshot.subheadlineLocked);
  }
  if (selected.type === "device" && selected.id) {
    return Boolean(
      screenshot.devices.find((device) => device.id === selected.id)?.locked,
    );
  }
  if (selected.type === "image" && selected.id) {
    return Boolean(
      screenshot.overlayImages.find((image) => image.id === selected.id)?.locked,
    );
  }
  return false;
};

export const toggleLayerVisibility = (
  screenshot: Screenshot,
  entry: LayerEntry,
): Partial<Screenshot> => {
  if (entry.kind === "headline") {
    return { headlineHidden: !screenshot.headlineHidden };
  }
  if (entry.kind === "subheadline") {
    return { subheadlineHidden: !screenshot.subheadlineHidden };
  }
  if (entry.kind === "device") {
    return {
      devices: screenshot.devices.map((device) =>
        device.id === entry.id ? { ...device, hidden: !device.hidden } : device,
      ),
    };
  }
  return {
    overlayImages: screenshot.overlayImages.map((image) =>
      image.id === entry.id ? { ...image, hidden: !image.hidden } : image,
    ),
  };
};

export const toggleLayerLock = (
  screenshot: Screenshot,
  entry: LayerEntry,
): Partial<Screenshot> => {
  if (entry.kind === "headline") {
    return { headlineLocked: !screenshot.headlineLocked };
  }
  if (entry.kind === "subheadline") {
    return { subheadlineLocked: !screenshot.subheadlineLocked };
  }
  if (entry.kind === "device") {
    return {
      devices: screenshot.devices.map((device) =>
        device.id === entry.id ? { ...device, locked: !device.locked } : device,
      ),
    };
  }
  return {
    overlayImages: screenshot.overlayImages.map((image) =>
      image.id === entry.id ? { ...image, locked: !image.locked } : image,
    ),
  };
};

export const getScreenshotDisplayLabel = (
  screenshot: Screenshot,
  index: number,
) => screenshot.label?.trim() || `Screen ${index + 1}`;

export const getExportScreenshots = (
  screenshots: Screenshot[],
  scope: "all" | "active" | "checked",
  activeScreenshotId: string,
): Screenshot[] => {
  if (scope === "active") {
    return screenshots.filter((screenshot) => screenshot.id === activeScreenshotId);
  }
  if (scope === "checked") {
    return screenshots.filter((screenshot) => screenshot.includeInExport !== false);
  }
  return screenshots;
};
