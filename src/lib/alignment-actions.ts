import type { DeviceInstance, DeviceSpec, ExportSize, SelectedElement, Screenshot } from "../types";
import { APP_STORE_SAFE_AREA } from "./alignment-snapping";

export type AlignMode =
  | "center-h"
  | "center-v"
  | "center"
  | "to-device"
  | "align-left"
  | "align-right"
  | "align-top"
  | "align-bottom"
  | "match-width"
  | "match-height";

export type DistributeMode = "distribute-h" | "distribute-v";

export type SnapPreset =
  | "headline-above-device"
  | "subheadline-under-headline"
  | "device-bottom-bleed";

export const FLAT_ROTATION_SNAP = [0, 15, 30, 45, 60, 90, 120, 135, 180, 225, 270, 315, 360];
export const ROTATE_Y_SNAP = [-45, -30, -15, 0, 15, 30, 45];
export const ROTATE_X_SNAP = [-30, -15, -10, 0, 10, 15, 30];
export const OVERLAY_ROTATION_SNAP = FLAT_ROTATION_SNAP;

export const snapAngle = (
  value: number,
  targets: number[],
  threshold = 4,
): number => {
  let best: { value: number; distance: number } | null = null;

  for (const target of targets) {
    const distance = Math.abs(value - target);
    if (distance <= threshold && (!best || distance < best.distance)) {
      best = { value: target, distance };
    }
  }

  return best?.value ?? value;
};

export const snapFlatRotation = (value: number) =>
  snapAngle(value, FLAT_ROTATION_SNAP);

export const snapRotateY = (value: number) => snapAngle(value, ROTATE_Y_SNAP);

export const snapRotateX = (value: number) => snapAngle(value, ROTATE_X_SNAP);

export const estimateDeviceHeightPercent = (
  device: DeviceInstance,
  spec: DeviceSpec,
  exportSize: ExportSize,
): number => {
  const canvasAspect = exportSize.width / exportSize.height;
  const deviceAspect = spec.height / spec.width;
  return (device.scale * deviceAspect) / canvasAspect;
};

export const getDeviceForScreenshot = (
  screenshot: Screenshot,
  preferredDeviceId?: string,
): DeviceInstance | null => {
  if (preferredDeviceId) {
    const match = screenshot.devices.find((device) => device.id === preferredDeviceId);
    if (match) return match;
  }
  return (
    screenshot.devices.find((device) => device.id === screenshot.activeDeviceId) ??
    screenshot.devices[0] ??
    null
  );
};

export const getAlignUpdates = (
  selected: SelectedElement,
  screenshot: Screenshot,
  mode: AlignMode,
  exportSize: ExportSize,
  getDeviceSpec: (deviceId: string) => DeviceSpec,
): Partial<Screenshot> | null => {
  const device = getDeviceForScreenshot(
    screenshot,
    selected.type === "device" ? selected.id : screenshot.activeDeviceId,
  );

  if (mode === "center-h") {
    if (selected.type === "headline") return { headlineX: 50 };
    if (selected.type === "subheadline") return { subheadlineX: 50 };
    if (selected.type === "device" && selected.id) {
      return {
        devices: screenshot.devices.map((item) =>
          item.id === selected.id ? { ...item, x: 50 } : item,
        ),
      };
    }
    if (selected.type === "image" && selected.id) {
      return {
        overlayImages: screenshot.overlayImages.map((item) =>
          item.id === selected.id ? { ...item, x: 50 } : item,
        ),
      };
    }
  }

  if (mode === "center-v") {
    if (selected.type === "headline") return { headlineY: 50 };
    if (selected.type === "subheadline") return { subheadlineY: 50 };
    if (selected.type === "device" && selected.id) {
      return {
        devices: screenshot.devices.map((item) =>
          item.id === selected.id ? { ...item, y: 50 } : item,
        ),
      };
    }
    if (selected.type === "image" && selected.id) {
      return {
        overlayImages: screenshot.overlayImages.map((item) =>
          item.id === selected.id ? { ...item, y: 50 } : item,
        ),
      };
    }
  }

  if (mode === "center") {
    if (selected.type === "headline") return { headlineX: 50, headlineY: 50 };
    if (selected.type === "subheadline") return { subheadlineX: 50, subheadlineY: 50 };
    if (selected.type === "device" && selected.id) {
      return {
        devices: screenshot.devices.map((item) =>
          item.id === selected.id ? { ...item, x: 50, y: 50 } : item,
        ),
      };
    }
    if (selected.type === "image" && selected.id) {
      return {
        overlayImages: screenshot.overlayImages.map((item) =>
          item.id === selected.id ? { ...item, x: 50, y: 50 } : item,
        ),
      };
    }
  }

  const referenceDevice = device;

  if (mode === "align-left") {
    if (selected.type === "headline") {
      return { headlineX: APP_STORE_SAFE_AREA.left + screenshot.headlineWidth / 2 };
    }
    if (selected.type === "subheadline") {
      return {
        subheadlineX: APP_STORE_SAFE_AREA.left + screenshot.subheadlineWidth / 2,
      };
    }
    if (selected.type === "device" && selected.id) {
      const current = screenshot.devices.find((item) => item.id === selected.id);
      if (!current) return null;
      return {
        devices: screenshot.devices.map((item) =>
          item.id === selected.id
            ? { ...item, x: APP_STORE_SAFE_AREA.left + item.scale / 2 }
            : item,
        ),
      };
    }
    if (selected.type === "image" && selected.id) {
      const current = screenshot.overlayImages.find((item) => item.id === selected.id);
      if (!current) return null;
      return {
        overlayImages: screenshot.overlayImages.map((item) =>
          item.id === selected.id
            ? { ...item, x: APP_STORE_SAFE_AREA.left + item.width / 2 }
            : item,
        ),
      };
    }
  }

  if (mode === "align-right") {
    if (selected.type === "headline") {
      return { headlineX: APP_STORE_SAFE_AREA.right - screenshot.headlineWidth / 2 };
    }
    if (selected.type === "subheadline") {
      return {
        subheadlineX:
          APP_STORE_SAFE_AREA.right - screenshot.subheadlineWidth / 2,
      };
    }
    if (selected.type === "device" && selected.id) {
      return {
        devices: screenshot.devices.map((item) =>
          item.id === selected.id
            ? { ...item, x: APP_STORE_SAFE_AREA.right - item.scale / 2 }
            : item,
        ),
      };
    }
    if (selected.type === "image" && selected.id) {
      return {
        overlayImages: screenshot.overlayImages.map((item) =>
          item.id === selected.id
            ? { ...item, x: APP_STORE_SAFE_AREA.right - item.width / 2 }
            : item,
        ),
      };
    }
  }

  if (mode === "align-top") {
    if (selected.type === "headline") return { headlineY: APP_STORE_SAFE_AREA.top };
    if (selected.type === "subheadline") {
      return { subheadlineY: APP_STORE_SAFE_AREA.top + 6 };
    }
    if (selected.type === "device" && selected.id) {
      return {
        devices: screenshot.devices.map((item) =>
          item.id === selected.id ? { ...item, y: APP_STORE_SAFE_AREA.top + 8 } : item,
        ),
      };
    }
    if (selected.type === "image" && selected.id) {
      const current = screenshot.overlayImages.find((item) => item.id === selected.id);
      if (!current) return null;
      return {
        overlayImages: screenshot.overlayImages.map((item) =>
          item.id === selected.id
            ? { ...item, y: APP_STORE_SAFE_AREA.top + item.height / 2 }
            : item,
        ),
      };
    }
  }

  if (mode === "align-bottom") {
    if (selected.type === "headline") {
      return { headlineY: APP_STORE_SAFE_AREA.bottom - 4 };
    }
    if (selected.type === "subheadline") {
      return { subheadlineY: APP_STORE_SAFE_AREA.bottom - 1 };
    }
    if (selected.type === "device" && selected.id) {
      const current = screenshot.devices.find((item) => item.id === selected.id);
      if (!current) return null;
      const spec = getDeviceSpec(current.deviceId);
      const height = estimateDeviceHeightPercent(current, spec, exportSize);
      return {
        devices: screenshot.devices.map((item) =>
          item.id === selected.id
            ? { ...item, y: APP_STORE_SAFE_AREA.bottom - height * 0.15 }
            : item,
        ),
      };
    }
    if (selected.type === "image" && selected.id) {
      return {
        overlayImages: screenshot.overlayImages.map((item) =>
          item.id === selected.id
            ? {
                ...item,
                y: APP_STORE_SAFE_AREA.bottom - item.height / 2,
              }
            : item,
        ),
      };
    }
  }

  if (mode === "match-width" && referenceDevice) {
    const targetScale = referenceDevice.scale;
    if (selected.type === "device" && selected.id) {
      return {
        devices: screenshot.devices.map((item) =>
          item.id === selected.id ? { ...item, scale: targetScale } : item,
        ),
      };
    }
    if (selected.type === "image" && selected.id) {
      return {
        overlayImages: screenshot.overlayImages.map((item) =>
          item.id === selected.id ? { ...item, width: targetScale } : item,
        ),
      };
    }
  }

  if (mode === "match-height" && referenceDevice) {
    const spec = getDeviceSpec(referenceDevice.deviceId);
    const targetHeight = estimateDeviceHeightPercent(
      referenceDevice,
      spec,
      exportSize,
    );
    if (selected.type === "image" && selected.id) {
      return {
        overlayImages: screenshot.overlayImages.map((item) =>
          item.id === selected.id ? { ...item, height: targetHeight } : item,
        ),
      };
    }
    if (selected.type === "device" && selected.id) {
      return {
        devices: screenshot.devices.map((item) =>
          item.id === selected.id ? { ...item, scale: referenceDevice.scale } : item,
        ),
      };
    }
  }

  if (mode === "to-device") {
    if (!device) return null;
    const spec = getDeviceSpec(device.deviceId);
    const deviceHeight = estimateDeviceHeightPercent(device, spec, exportSize);
    const screenCenterY = device.y + deviceHeight * 0.42;

    if (selected.type === "headline") {
      return {
        headlineX: device.x,
        headlineY: Math.max(APP_STORE_SAFE_AREA.top, device.y - 6),
      };
    }
    if (selected.type === "subheadline") {
      return {
        subheadlineX: device.x,
        subheadlineY: Math.max(
          APP_STORE_SAFE_AREA.top + 6,
          Math.min(device.y - 1, screenshot.headlineY + 7),
        ),
      };
    }
    if (selected.type === "image" && selected.id) {
      return {
        overlayImages: screenshot.overlayImages.map((item) =>
          item.id === selected.id
            ? { ...item, x: device.x, y: screenCenterY }
            : item,
        ),
      };
    }
    if (selected.type === "device" && selected.id) {
      return {
        devices: screenshot.devices.map((item) =>
          item.id === selected.id
            ? { ...item, x: device.x, y: device.y }
            : item,
        ),
      };
    }
  }

  return null;
};

const distributeAxisValues = (values: number[]): number[] => {
  if (values.length < 2) return values;
  const indexed = values.map((value, index) => ({ value, index }));
  indexed.sort((a, b) => a.value - b.value);
  const min = indexed[0].value;
  const max = indexed[indexed.length - 1].value;
  const step = (max - min) / (indexed.length - 1);
  const distributed = indexed.map((item, position) => ({
    index: item.index,
    value: min + step * position,
  }));
  const result = [...values];
  for (const item of distributed) {
    result[item.index] = item.value;
  }
  return result;
};

export const distributeScreenshotElements = (
  screenshot: Screenshot,
  mode: DistributeMode,
): Partial<Screenshot> | null => {
  let nextDevices = screenshot.devices;
  let nextOverlays = screenshot.overlayImages;
  let changed = false;

  if (screenshot.devices.length >= 2) {
    if (mode === "distribute-h") {
      const xs = distributeAxisValues(screenshot.devices.map((device) => device.x));
      nextDevices = screenshot.devices.map((device, index) => ({
        ...device,
        x: xs[index],
      }));
    } else {
      const ys = distributeAxisValues(screenshot.devices.map((device) => device.y));
      nextDevices = screenshot.devices.map((device, index) => ({
        ...device,
        y: ys[index],
      }));
    }
    changed = true;
  }

  const distributeOverlays = (layer: "behind" | "front") => {
    const group = nextOverlays.filter((image) =>
      layer === "behind" ? image.layer === "behind" : image.layer !== "behind",
    );
    if (group.length < 2) return;

    const other = nextOverlays.filter((image) =>
      layer === "behind" ? image.layer !== "behind" : image.layer === "behind",
    );

    if (mode === "distribute-h") {
      const xs = distributeAxisValues(group.map((image) => image.x));
      const nextGroup = group.map((image, index) => ({ ...image, x: xs[index] }));
      nextOverlays =
        layer === "behind" ? [...nextGroup, ...other] : [...other, ...nextGroup];
    } else {
      const ys = distributeAxisValues(group.map((image) => image.y));
      const nextGroup = group.map((image, index) => ({ ...image, y: ys[index] }));
      nextOverlays =
        layer === "behind" ? [...nextGroup, ...other] : [...other, ...nextGroup];
    }
    changed = true;
  };

  distributeOverlays("behind");
  distributeOverlays("front");

  if (!changed) return null;

  return { devices: nextDevices, overlayImages: nextOverlays };
};

export const applySnapPreset = (
  screenshot: Screenshot,
  preset: SnapPreset,
  exportSize: ExportSize,
  getDeviceSpec: (deviceId: string) => DeviceSpec,
): Partial<Screenshot> | null => {
  const device = getDeviceForScreenshot(screenshot);

  if (preset === "headline-above-device") {
    if (!device) return null;
    return {
      headlineX: device.x,
      headlineY: Math.max(APP_STORE_SAFE_AREA.top, device.y - 6),
    };
  }

  if (preset === "subheadline-under-headline") {
    return {
      subheadlineX: screenshot.headlineX,
      subheadlineY: Math.min(
        screenshot.headlineY + 7,
        device ? device.y - 1 : screenshot.headlineY + 7,
      ),
    };
  }

  if (preset === "device-bottom-bleed") {
    if (!device) return null;
    const spec = getDeviceSpec(device.deviceId);
    const deviceHeight = estimateDeviceHeightPercent(device, spec, exportSize);
    const bleedY = 102 - deviceHeight * 0.35;
    return {
      devices: screenshot.devices.map((item) =>
        item.id === device.id ? { ...item, y: bleedY, x: item.x } : item,
      ),
    };
  }

  return null;
};

export const getRotationStepUpdate = (
  selected: SelectedElement,
  screenshot: Screenshot,
  direction: -1 | 1,
): Partial<Screenshot> | null => {
  const step = 15 * direction;

  if (selected.type === "device" && selected.id) {
    return {
      devices: screenshot.devices.map((device) => {
        if (device.id !== selected.id) return device;
        if (device.style === "3d") {
          return { ...device, rotateY: snapRotateY(device.rotateY + step) };
        }
        const next = device.rotation + step;
        return { ...device, rotation: snapFlatRotation((next + 360) % 360) };
      }),
    };
  }

  if (selected.type === "image" && selected.id) {
    return {
      overlayImages: screenshot.overlayImages.map((image) => {
        if (image.id !== selected.id) return image;
        const next = (image.rotation ?? 0) + step;
        return {
          ...image,
          rotation: snapAngle(next, OVERLAY_ROTATION_SNAP),
        };
      }),
    };
  }

  return null;
};
