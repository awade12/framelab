import type { Screenshot } from "../types";

export type LayerEntry =
  | { kind: "overlay"; id: string; layer: "behind" | "front"; label: string }
  | { kind: "headline"; label: string }
  | { kind: "subheadline"; label: string }
  | { kind: "device"; id: string; label: string };

export const buildLayerStack = (screenshot: Screenshot): LayerEntry[] => {
  const entries: LayerEntry[] = [];

  screenshot.overlayImages
    .filter((image) => image.layer === "behind")
    .forEach((image, index) => {
      entries.push({
        kind: "overlay",
        id: image.id,
        layer: "behind",
        label: `Asset ${index + 1}`,
      });
    });

  entries.push({ kind: "headline", label: "Headline" });
  entries.push({ kind: "subheadline", label: "Subheadline" });

  screenshot.devices.forEach((device, index) => {
    entries.push({
      kind: "device",
      id: device.id,
      label: `Device ${index + 1}`,
    });
  });

  screenshot.overlayImages
    .filter((image) => image.layer !== "behind")
    .forEach((image, index) => {
      entries.push({
        kind: "overlay",
        id: image.id,
        layer: "front",
        label: `Asset ${index + 1}`,
      });
    });

  return entries;
};

const reorder = <T>(items: T[], fromIndex: number, toIndex: number): T[] => {
  if (fromIndex === toIndex) return items;
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
};

export const reorderLayerStack = (
  screenshot: Screenshot,
  fromIndex: number,
  toIndex: number,
): Partial<Screenshot> | null => {
  const stack = buildLayerStack(screenshot);
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= stack.length ||
    toIndex >= stack.length
  ) {
    return null;
  }

  const moved = stack[fromIndex];
  const target = stack[toIndex];

  if (moved.kind === "headline" || moved.kind === "subheadline") {
    return null;
  }

  if (target.kind === "headline" || target.kind === "subheadline") {
    return null;
  }

  if (moved.kind === "device" && target.kind === "device") {
    const deviceIds = screenshot.devices.map((device) => device.id);
    const fromDeviceIndex = deviceIds.indexOf(moved.id);
    const toDeviceIndex = deviceIds.indexOf(target.id);
    if (fromDeviceIndex === -1 || toDeviceIndex === -1) return null;
    return {
      devices: reorder(screenshot.devices, fromDeviceIndex, toDeviceIndex),
    };
  }

  if (moved.kind === "overlay" && target.kind === "overlay") {
    const behind = screenshot.overlayImages.filter(
      (image) => image.layer === "behind",
    );
    const front = screenshot.overlayImages.filter(
      (image) => image.layer !== "behind",
    );

    if (moved.layer === "behind" && target.layer === "behind") {
      const fromIndexLocal = behind.findIndex((image) => image.id === moved.id);
      const toIndexLocal = behind.findIndex((image) => image.id === target.id);
      const reorderedBehind = reorder(behind, fromIndexLocal, toIndexLocal);
      return { overlayImages: [...reorderedBehind, ...front] };
    }

    if (moved.layer === "front" && target.layer === "front") {
      const fromIndexLocal = front.findIndex((image) => image.id === moved.id);
      const toIndexLocal = front.findIndex((image) => image.id === target.id);
      const reorderedFront = reorder(front, fromIndexLocal, toIndexLocal);
      return { overlayImages: [...behind, ...reorderedFront] };
    }

    const movedImage = screenshot.overlayImages.find(
      (image) => image.id === moved.id,
    );
    if (!movedImage) return null;

    const withoutMoved = screenshot.overlayImages.filter(
      (image) => image.id !== moved.id,
    );
    const nextLayer = target.layer;
    const updatedMoved = { ...movedImage, layer: nextLayer };

    const behindNext = withoutMoved.filter((image) => image.layer === "behind");
    const frontNext = withoutMoved.filter((image) => image.layer !== "behind");

    if (nextLayer === "behind") {
      const insertAt = behindNext.findIndex((image) => image.id === target.id);
      const nextBehind = [...behindNext];
      nextBehind.splice(insertAt + (fromIndex < toIndex ? 1 : 0), 0, updatedMoved);
      return { overlayImages: [...nextBehind, ...frontNext] };
    }

    const insertAt = frontNext.findIndex((image) => image.id === target.id);
    const nextFront = [...frontNext];
    nextFront.splice(insertAt + (fromIndex < toIndex ? 1 : 0), 0, updatedMoved);
    return { overlayImages: [...behindNext, ...nextFront] };
  }

  return null;
};

export const setOverlayLayer = (
  screenshot: Screenshot,
  imageId: string,
  layer: "behind" | "front",
): Partial<Screenshot> => {
  const image = screenshot.overlayImages.find((item) => item.id === imageId);
  if (!image || image.layer === layer) return {};

  const remaining = screenshot.overlayImages.filter(
    (item) => item.id !== imageId,
  );
  const behind = remaining.filter((item) => item.layer === "behind");
  const front = remaining.filter((item) => item.layer !== "behind");
  const updated = { ...image, layer };

  if (layer === "behind") {
    return { overlayImages: [...behind, updated, ...front] };
  }

  return { overlayImages: [...behind, ...front, updated] };
};
